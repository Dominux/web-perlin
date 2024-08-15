use crate::types::Float;

#[derive(Clone, Copy, Debug)]
pub struct Grad {
    pub x: Float,
    pub y: Float,
}

impl Grad {
    pub fn dot2(&self, x: Float, y: Float) -> Float {
        self.x * x + self.y * y
    }
}

impl Default for Grad {
    fn default() -> Self {
        Grad { x: 0.0, y: 0.0 }
    }
}
