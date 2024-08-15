mod grad;
mod perlin;
mod types;

fn main() {
    // let noise = perlin::Perlin::default();
    let noise = perlin::Perlin::new(69.420);
    let perlin_noise = noise.perlin2(228.1488, 1337.4534);
    println!("{}", perlin_noise);
}
