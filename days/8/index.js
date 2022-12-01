import assert from 'assert'
import read from '../../utils/read.js'

function isEdge(list, i, j) {
  return i === 0 || j === 0 || i === list.length - 1 || j === list.length - 1
}

function treesUp(list, i, j) {
  return [].nMatrix(i).map((n, ix) => parseInt(list[i - ix - 1][j], 10))
}

function treesToLeft(list, i, j) {
  return [].nMatrix(j).map((n, jx) => parseInt(list[i][j - jx - 1], 10))
}

function treesDown(list, i, j) {
  return []
    .nMatrix(list.length - i - 1)
    .map((n, ix) => parseInt(list[i + ix + 1][j], 10))
}

function treesToRight(list, i, j) {
  return []
    .nMatrix(list.length - j - 1)
    .map((n, jx) => parseInt(list[i][j + jx + 1], 10))
}

function isSeen({ list, curr, i, j }) {
  return (
    isEdge(list, i, j) ||
    treesUp(list, i, j).every((n) => n < curr) ||
    treesToLeft(list, i, j).every((n) => n < curr) ||
    treesDown(list, i, j).every((n) => n < curr) ||
    treesToRight(list, i, j).every((n) => n < curr)
  )
}

function solution01(list) {
  return list.reduce((sum, line, i) => {
    return (
      sum +
      line
        .split('')
        .map((n) => parseInt(n, 10))
        .reduce((acc, curr, j) => {
          if (isSeen({ list, curr, i, j })) return acc + 1
          return acc
        }, 0)
    )
  }, 0)
}

function getLineOfSight(trees, current) {
  return trees.reduce((acc, n) => {
    if (acc.every((t) => t < current)) {
      return [...acc, n]
    }
    return acc
  }, [])
}

function solution02(list) {
  return list
    .map((line, i) => {
      return line
        .split('')
        .map((n) => parseInt(n, 10))
        .map((tree, j) => {
          if (isEdge(list, i, j)) return 0

          const up = getLineOfSight(treesUp(list, i, j), tree)
          const left = getLineOfSight(treesToLeft(list, i, j), tree)
          const down = getLineOfSight(treesDown(list, i, j), tree)
          const right = getLineOfSight(treesToRight(list, i, j), tree)

          return up.length * left.length * down.length * right.length
        })
    })
    .map((line) => Math.max(...line))
    .sortIntegers()
    .pop()
}

read('test.txt').then((list) => {
  assert.deepEqual(solution01(list), 21)
  assert.deepEqual(solution02(list), 8)
})

read('input.txt').then((list) => {
  assert.deepEqual(solution01(list), 1703)
  assert.deepEqual(solution02(list), 4978279)
})
