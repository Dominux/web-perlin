import init, { Perlin } from './wasm-perlin-pkg/wasm_perlin.js'
await init()

const seed = Math.random()
const scale = 42

noise.seed(seed)
const noiseWasm = new Perlin(seed)

const perlin2Experiment = () => {
  const jsNoise = (x, y, scale) =>
    [...Array(x).keys()].map((x) =>
      [...Array(y).keys()].map((y) => noise.perlin2(x / scale, y / scale))
    )

  const experiments = [
    ['perlinjs2', jsNoise],
    ['wasmperlin2', (x, y, scale) => noiseWasm.perlin2Matrix(x, y, scale)],
  ]

  for (const [id, noiseFunc] of experiments) {
    const canvas = document.getElementById(id)
    canvas.width = 1024
    canvas.height = 768

    const startTime = Date.now()

    const result = noiseFunc(canvas.width, canvas.height, scale)

    const endTime = Date.now()

    console.log(`${id} | ${endTime - startTime} ms`)

    const ctx = canvas.getContext('2d')
    const image = ctx.createImageData(canvas.width, canvas.height)
    const data = image.data

    for (let x = 0; x < canvas.width; x++) {
      for (let y = 0; y < canvas.height; y++) {
        let value = result[x][y]

        value = (1 + value) * 128

        const cell = (x + y * canvas.width) * 4
        data[cell] = data[cell + 1] = data[cell + 2] = value
        data[cell + 3] = 255 // alpha.
      }
    }

    ctx.putImageData(image, 0, 0)

    setTimeout(0)
  }
}

const perlin3Experiment = () => {
  const jsNoise = (x, y, z, scale) =>
    [...Array(x).keys()].map((x) =>
      [...Array(y).keys()].map((y) =>
        [...Array(z).keys()].map((z) =>
          noise.perlin3(x / scale, y / scale, z / scale)
        )
      )
    )

  const experiments = [
    ['perlinjs3', jsNoise],
    [
      'wasmperlin3',
      (x, y, z, scale) => noiseWasm.perlin3Matrix(x, y, z, scale),
    ],
  ]

  for (const [id, noiseFunc] of experiments) {
    const canvas = document.getElementById(id)
    canvas.width = 1024 / 5
    canvas.height = 768 / 5

    const zMax = 60

    const startTime = Date.now()

    const result = noiseFunc(canvas.width, canvas.height, zMax, scale / 4)

    const endTime = Date.now()

    console.log(`${id} | ${endTime - startTime} ms`)

    const ctx = canvas.getContext('2d')
    const image = ctx.createImageData(canvas.width, canvas.height)
    const data = image.data

    for (let x = 0; x < canvas.width; x++) {
      for (let y = 0; y < canvas.height; y++) {
        const zs = Array.from(Array(zMax).keys()).map(
          (z) => (1 + result[x][y][z]) * 128
        )

        const cell = (x + y * canvas.width) * 4

        data[cell] = getAverage(zs.slice(0, zMax / 3))
        data[cell + 1] = getAverage(zs.slice(zMax / 3, (zMax / 3) * 2))
        data[cell + 2] = getAverage(zs.slice((zMax / 3) * 2, zMax))
        data[cell + 3] = 255 // alpha.
      }
    }

    ctx.putImageData(image, 0, 0)

    setTimeout(0)
  }
}

const getAverage = (arr) => arr.reduce((p, c) => p + c, 0) / arr.length

perlin2Experiment()
perlin3Experiment()
