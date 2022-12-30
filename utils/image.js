import path from 'path'
import sharp from 'sharp'

export const SPACE = ' '
export const BLOCK = '█'
export const PLUS = '+'
export const O = 'o'

const BLACK = { r: 0, g: 0, b: 0 }
const BLUE = { r: 0, g: 0, b: 255 }
const ORANGE = { r: 255, g: 100, b: 0 }
const YELLOW = { r: 255, g: 255, b: 0 }

function newImage({ width, height, size = 1, background = BLACK }) {
  return {
    create: {
      width: width || size,
      height: height || size,
      background,
      channels: 4,
    },
  }
}

const pixelMap = {
  [BLOCK]: newImage({ size: 1, background: BLUE }),
  [PLUS]: newImage({ size: 1, background: ORANGE }),
  [O]: newImage({ size: 1, background: YELLOW }),
}

export async function generate14({ map, filename = 'output.png' }) {
  const [, dirPath] = process.argv
  const filePath = path.join(dirPath, filename)
  const image = sharp(newImage({ width: map[0].length, height: map.length }))

  const images = map.reduce((acc, curr, i) => {
    return [
      ...acc,
      ...curr.reduce((acc01, point, j) => {
        if (point === SPACE) return acc01
        const input = pixelMap[point] || pixelMap[BLOCK]
        return [...acc01, { input, left: j, top: i }]
      }, []),
    ]
  }, [])

  await image.composite(images).toFile(filePath)
}

export async function generate15({ map, filename = 'output.png' }) {
  const [, dirPath] = process.argv
  const filePath = path.join(dirPath, filename)
  const image = sharp(newImage({ size: 30 }))

  const sensor = {
    input: pixelMap[BLOCK],
    left: map.sensor[0],
    top: map.sensor[1],
  }
  const diamond = map.diamond.map((pair) => ({
    input: pixelMap[O],
    left: pair[0],
    top: pair[1],
  }))
  const beacon = {
    input: pixelMap[PLUS],
    left: map.beacon[0],
    top: map.beacon[1],
  }

  await image.composite([sensor, ...diamond, beacon]).toFile(filePath)
}
