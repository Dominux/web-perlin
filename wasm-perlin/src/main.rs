mod perlin;
mod types;

fn main() {
    let noise = perlin::Perlin::default();
    println!("Hello, world, {:?}!", noise);
}
