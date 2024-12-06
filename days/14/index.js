import assert from 'assert'
import read from '../../utils/read.js'

const DIR = {
  N: [-1, 0],
  W: [0, -1],
  S: [1, 0],
  E: [0, 1],
}

function getNewMatrixPerspective({ matrix, dir }) {
  if (dir === DIR.W) return matrix.rotateClockwise()
  if (dir === DIR.S) return matrix.rotateClockwise().rotateClockwise()
  if (dir === DIR.E) return matrix.rotateCounterClockwise()
  return matrix.map((line) => [...line])
}

function revertMatrixPerspective({ matrix, dir }) {
  if (dir === DIR.W) return matrix.rotateCounterClockwise()
  if (dir === DIR.S) return matrix.rotateClockwise().rotateClockwise()
  if (dir === DIR.E) return matrix.rotateClockwise()
  return matrix
}

function tilt({ matrix, dir }) {
  const newMatrix = getNewMatrixPerspective({ matrix, dir })

  for (let i = 0; i < newMatrix.length; i++) {
    for (let j = 0; j < newMatrix[0].length; j++) {
      const spot = newMatrix[i][j]

      // Move rock
      if (spot === 'O') {
        let y = i
        while (y - 1 >= 0 && newMatrix[y - 1][j] === '.') {
          y--
        }
        newMatrix[i][j] = '.'
        newMatrix[y][j] = 'O'
      }
    }
  }

  return revertMatrixPerspective({ matrix: newMatrix, dir })
}

function totalLoad({ tilted }) {
  return tilted.reduce((acc, row, i) => {
    const rocks = row.filter((spot) => spot === 'O').length

    return acc + rocks * (tilted.length - i)
  }, 0)
}

function solution01(list) {
  const matrix = list.map((line) => line.split(''))
  const tilted = tilt({ matrix, dir: DIR.N })

  return totalLoad({ tilted })
}

function getCyclePattern(stackCycles) {
  if (stackCycles.length < 2) return false

  const last = stackCycles[stackCycles.length - 1]
  const sameIdx = stackCycles.findIndex(
    (cycle, i) => i !== stackCycles.length - 1 && cycle.are2DSame(last)
  )

  if (sameIdx === -1) return false

  const patternSize = stackCycles.length - 1 - sameIdx

  if (sameIdx <= patternSize - 1) return false

  const pattern1 = stackCycles.slice(-patternSize)
  const pattern2 = stackCycles.slice(
    stackCycles.length - 2 * patternSize,
    -patternSize
  )

  const equal = pattern1.every((cycle, i) => cycle.are2DSame(pattern2[i]))

  return equal ? pattern1 : false
}

function getLastCycle(list) {
  const MAX = 1000000000
  let tilted = list.map((line) => line.split(''))
  const stackCycles = []

  for (let i = 0; i < MAX; i++) {
    tilted = tilt({ matrix: tilted, dir: DIR.N })
    tilted = tilt({ matrix: tilted, dir: DIR.W })
    tilted = tilt({ matrix: tilted, dir: DIR.S })
    tilted = tilt({ matrix: tilted, dir: DIR.E })

    stackCycles.push(tilted)

    const pattern = getCyclePattern(stackCycles)

    if (pattern) {
      const rest = stackCycles.length - 2 * pattern.length
      const idx = ((MAX - rest) % pattern.length) - 1

      return pattern[idx]
    }
  }

  return false
}

function solution02(list) {
  const lastMatrix = getLastCycle(list)

  return totalLoad({ tilted: lastMatrix })
}

read('test.txt').then((list) => {
  assert.deepEqual(solution01(list), 136)
  assert.deepEqual(solution02(list), 64)
})

read('input.txt').then((list) => {
  assert.deepEqual(solution01(list), 105461)
  assert.deepEqual(solution02(list), 102829)
})
