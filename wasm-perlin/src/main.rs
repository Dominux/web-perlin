mod grad;
mod perlin;
mod types;

fn main() {
    // let noise = perlin::Perlin::default();
    let noise = perlin::Perlin::new(691.4120);
    let perlin2_noise = noise.perlin2(228.14288, 1337.4534);
    let perlin3_noise = noise.perlin3(228.14288, 1337.4534, 23.45345345);
    println!("Perlin2: {perlin2_noise}, Perlin3: {perlin3_noise}");
}
