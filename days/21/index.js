import assert from 'assert'
import read from '../../utils/read.js'

function findStart(list) {
  return list.reduce(
    (acc, line, y) => {
      const x = line.indexOf('S')
      if (x !== -1) {
        return [y, x]
      }
      return acc
    },
    [0, 0]
  )
}

function buildTree(list) {
  return list.reduce((tree, line, y) => {
    return line.split('').reduce((acc, char, x) => {
      return {
        ...acc,
        [[y, x]]: [
          [y - 1, x],
          [y, x - 1],
          [y + 1, x],
          [y, x + 1],
        ]
          .filter(([i, j]) => {
            return list[i] && list[i][j] && list[i][j] !== '#'
          })
          .map((coord) => coord.toString()),
      }
    }, tree)
  }, {})
}

// Given an n-matrix and a radius, return the same matrix with a diamond shape of 'o' characters alternating with empty spaces like a checkerboard.
// The diamond should be centered in the matrix.
function getDiamond({ list, radius }) {
  const offset = Math.round((radius * 2 + 1 - list.length) / 2)
  const radiusParity = radius % 2

  return list.map((row, y) => {
    return row.split('').map((char, x) => {
      const centerDistance =
        Math.abs(x - radius + offset) + Math.abs(y - radius + offset)
      const distanceParity = centerDistance % 2

      if (char === '#') return char

      if (centerDistance <= radius && radiusParity === distanceParity)
        return [y, x]

      return '.'
    })
  })
}

function solution01(list, radius) {
  const diamond = getDiamond({ list, radius })
  const spots = diamond
    .flat2DMatrix()
    .filter((spot) => typeof spot === 'object')

  return 0
}

function solution02(list) {}

read('test.txt').then((list) => {
  // assert.deepEqual(solution01(list, 6), 16)
  // assert.deepEqual(solution02(list), 167409079868000)
})

read('input.txt').then((list) => {
  assert.deepEqual(solution01(list, 64), 0)
  // assert.deepEqual(solution02(list), 136146366355609)
})
