use crate::types::Float;

#[derive(Clone, Copy, Debug)]
pub struct Grad {
    pub x: Float,
    pub y: Float,
    pub z: Float,
}

impl Grad {
    pub fn dot2(&self, x: Float, y: Float) -> Float {
        self.x * x + self.y * y
    }

    pub fn dot3(&self, x: Float, y: Float, z: Float) -> Float {
        self.x * x + self.y * y + self.z * z
    }
}

impl Default for Grad {
    fn default() -> Self {
        Grad {
            x: Float::default(),
            y: Float::default(),
            z: Float::default(),
        }
    }
}
