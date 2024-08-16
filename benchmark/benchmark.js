import init, { Perlin } from './wasm-perlin-pkg/wasm_perlin.js'
await init()

const seed = Math.random()

noise.seed(seed)
const noiseWasm = new Perlin(seed)

// console.log(noiseWasm.perlin3Matrix(100, 100, 100, 10))

const JsNoise = (x, y, scale) =>
  [...Array(x).keys()].map((x) =>
    [...Array(y).keys()].map((y) => noise.perlin2(x / scale, y / scale))
  )

const experiments = [
  ['perlinjs', JsNoise],
  ['webperlin', (x, y, scale) => noiseWasm.perlin2Matrix(x, y, scale)],
]

for (const [id, noiseFunc] of experiments) {
  const canvas = document.getElementById(id)
  canvas.width = 1024
  canvas.height = 768

  const startTime = Date.now()

  const result = noiseFunc(canvas.width, canvas.height, 100)

  const endTime = Date.now()

  const ctx = canvas.getContext('2d')
  const image = ctx.createImageData(canvas.width, canvas.height)
  const data = image.data

  for (let x = 0; x < canvas.width; x++) {
    for (let y = 0; y < canvas.height; y++) {
      let value = result[x][y]

      value = Math.abs(value) * 256

      const cell = (x + y * canvas.width) * 4
      data[cell] = data[cell + 1] = data[cell + 2] = value
      data[cell] += Math.max(0, (25 - value) * 8)
      data[cell + 3] = 255 // alpha.
    }
  }

  // ctx.fillColor = 'black'
  // ctx.fillRect(0, 0, 100, 100)
  ctx.putImageData(image, 0, 0)

  console.log(`${id} | ${endTime - startTime} ms`)
}
