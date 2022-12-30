import assert from 'assert'
import read from '../../utils/read.js'

const SPACE = ' '
const BLOCK = '█'
const O = 'o'
const [Ix, Iy] = [500, 0]

function parseCave(list) {
  const size = 1100
  const cave = [].n2DMatrix(size, SPACE)
  let floor = 0

  list.forEach((line) => {
    const stoneTrace = line
      .split(' -> ')
      .map((coordinates) => coordinates.split(',').toNumber())

    stoneTrace.forEach(([x, y], i) => {
      floor = Math.max(floor, y)
      if (i === stoneTrace.length - 1) return

      const [x1, y1] = stoneTrace[i + 1]
      const delta = x === x1 ? y1 - y : x1 - x
      const dir = delta / Math.abs(delta)

      for (let j = 0; j <= Math.abs(delta); j++) {
        // draw vertical
        if (x === x1) cave[y + j * dir][x] = BLOCK
        // draw horizontal
        else if (y === y1) cave[y][x + j * dir] = BLOCK
      }
    }, cave)
  })

  cave.splice(floor + 3)

  return cave
}

function fallingSand(cave) {
  const newCave = cave
  let [ix, iy] = [Ix, Iy]
  const stopFalling = () =>
    cave[iy + 1][ix] !== SPACE &&
    cave[iy + 1][ix - 1] !== SPACE &&
    cave[iy + 1][ix + 1] !== SPACE

  try {
    while (!stopFalling()) {
      if (cave[iy + 1][ix] === SPACE) {
        // do nothing
      } else if (cave[iy + 1][ix - 1] === SPACE) {
        ix--
      } else if (cave[iy + 1][ix + 1] === SPACE) {
        ix++
      }
      iy++
    }
  } catch (error) {
    return false
  }

  if (iy === Iy && ix === Ix) return false

  newCave[iy][ix] = O
  return true
}

function addFloor(cave) {
  const newCave = cave
  const lastIdx = newCave.length - 1

  newCave[lastIdx] = newCave[lastIdx].map(() => BLOCK)
}

function startFalling({ list, hasFloor = false }) {
  const cave = parseCave(list)
  let sand = 0

  if (hasFloor) {
    addFloor(cave)
    sand = 1
  }

  while (fallingSand(cave)) {
    sand++
  }

  return sand
}

function solution01(list) {
  return startFalling({ list })
}

function solution02(list) {
  return startFalling({ list, hasFloor: true })
}

read('test.txt').then((list) => {
  assert.deepEqual(solution01(list), 24)
  assert.deepEqual(solution02(list), 93)
})

read('input.txt').then((list) => {
  assert.deepEqual(solution01(list), 873)
  assert.deepEqual(solution02(list), 24813)
})
