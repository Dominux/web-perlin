use crate::{grad::Grad, types::Float};

static P: &'static [u8] = &[
    217, 13, 137, 91, 90, 15, 131, 160, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69,
    142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219,
    203, 117, 35, 11, 32, 57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175,
    74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230,
    220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76,
    132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173,
    186, 3, 64, 52, 151, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206,
    59, 227, 47, 16, 58, 17, 182, 180, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163,
    70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232,
    178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162,
    241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204,
    176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141,
    128, 195, 78, 66, 156, 61, 215, 189,
];
static GRAD3: &'static [Grad] = &[
    Grad { x: 1.0, y: 1.0 },
    Grad { x: -1.0, y: 1.0 },
    Grad { x: 1.0, y: -1.0 },
    Grad { x: -1.0, y: -1.0 },
    Grad { x: 1.0, y: 0.0 },
    Grad { x: -1.0, y: 0.0 },
    Grad { x: 1.0, y: 0.0 },
    Grad { x: -1.0, y: 0.0 },
    Grad { x: 0.0, y: 1.0 },
    Grad { x: 0.0, y: -1.0 },
    Grad { x: 0.0, y: 1.0 },
    Grad { x: 0.0, y: -1.0 },
];

#[derive(Debug)]
pub struct Perlin {
    perm: [u8; 512],
    grad_p: [Grad; 512],
}

impl Perlin {
    pub fn new(seed: Float) -> Self {
        let (perm, grad_p) = Self::calc_from_seed(seed);
        Self { perm, grad_p }
    }

    /// The original author said it isn't a very good seeding function,
    /// but I don't give a fuck about it in this case fr
    fn calc_from_seed(mut seed: Float) -> ([u8; 512], [Grad; 512]) {
        if seed > 0.0 && seed < 1.0 {
            // Scale the seed out
            seed *= u16::MAX as Float;
        }

        let mut seed = seed.floor().to_bits();
        if seed < u8::MAX as u64 + 1 {
            seed |= seed << 8;
        }

        let mut perm = [0; 512];
        let mut grad_p = [Grad::default(); 512];

        let seed_255 = (seed % u8::MAX as u64) as u8;
        let seed_r_255 = ((seed >> 8) % u8::MAX as u64) as u8;

        for i in 0..256 {
            let v = if i % 2 == 0 {
                P[i] ^ seed_255
            } else {
                P[i] ^ seed_r_255
            };

            perm[i] = v;
            perm[i + 256] = v;

            let grad_p_v = GRAD3[(v % 12) as usize];
            grad_p[i] = grad_p_v;
            grad_p[i + 256] = grad_p_v;
        }

        (perm, grad_p)
    }

    // I'd make this func generic, but there's no a pow built-in trait for this kinda moment
    fn fade(t: Float) -> Float {
        t.powi(3) * (t * (t * 6.0 - 15.0) + 10.0)
    }

    fn lerp(a: Float, b: Float, t: Float) -> Float {
        (1.0 - t) * a + t * b
    }

    /// 2D Perlin Noise
    #[allow(non_snake_case)]
    pub fn perlin2(&self, x: Float, y: Float) -> Float {
        // Find unit grid cell containing point
        let X = x.floor();
        let Y = y.floor();

        // Get relative xy coordinates of point within that cell
        let x = x - X;
        let y = y - Y;

        // Wrap the cells at 255
        let X = X as u64 % 255;
        let Y = Y as u64 % 255;

        // Calculate noise contributions from each of the four corners
        let n00 = self.grad_p[(X + (self.perm[Y as usize] as u64)) as usize].dot2(x, y);
        let n01 = self.grad_p[(X + (self.perm[(Y + 1) as usize] as u64)) as usize].dot2(x, y - 1.0);
        let n10 = self.grad_p[(X + 1 + (self.perm[Y as usize] as u64)) as usize].dot2(x - 1.0, y);
        let n11 = self.grad_p[(X + 1 + (self.perm[(Y + 1) as usize] as u64)) as usize]
            .dot2(x - 1.0, y - 1.0);

        // Compute the fade curve value for x
        let u = Self::fade(x);

        // Interpolate the four results
        Self::lerp(
            Self::lerp(n00, n10, u),
            Self::lerp(n01, n11, u),
            Self::fade(y),
        )
    }
}

impl Default for Perlin {
    fn default() -> Self {
        Self::new(Float::default())
    }
}
