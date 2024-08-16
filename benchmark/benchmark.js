import init, { Perlin } from './wasm-perlin-pkg/wasm_perlin.js'
await init()

const seed = Math.random()

noise.seed(seed)
const noiseWasm = new Perlin(seed)

const experiments = [
  ['perlinjs', noise],
  ['webperlin', noiseWasm],
]
experiments.forEach(([id, noise]) => {
  const canvas = document.getElementById(id)
  canvas.width = 1024
  canvas.height = 768

  const ctx = canvas.getContext('2d')

  const image = ctx.createImageData(canvas.width, canvas.height)
  const data = image.data

  const totalStart = Date.now()

  for (let x = 0; x < canvas.width; x++) {
    for (let y = 0; y < canvas.height; y++) {
      const value = Math.abs(noise.perlin2(x / 100, y / 100)) * 256

      const cell = (x + y * canvas.width) * 4
      data[cell] = data[cell + 1] = data[cell + 2] = value
      data[cell] += Math.max(0, (25 - value) * 8)
      data[cell + 3] = 255 // alpha.
    }
  }

  const totalEnd = Date.now()

  ctx.fillColor = 'black'
  ctx.fillRect(0, 0, 100, 100)
  ctx.putImageData(image, 0, 0)

  ctx.font = '16px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(
    'Rendered in ' + (totalEnd - totalStart) + ' ms',
    canvas.width / 2,
    canvas.height - 20
  )

  if (console) {
    console.log(`[${id}] Rendered in ` + (totalEnd - totalStart) + ' ms')
  }
})
