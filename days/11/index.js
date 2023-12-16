import assert from 'assert'
import read from '../../utils/read.js'

function getGalaxies(universe) {
  return universe.reduce((acc, row, y) => {
    return [...acc, ...row.getAllIndex('#').map((x) => [y, x])]
  }, [])
}

function getEmptyCoords(universe) {
  return universe
    .map((row, i) => (row.includes('#') ? -1 : i))
    .filter((i) => i >= 0)
}

function getEmptySpace(empty, d1, d2, expansion) {
  return empty
    .map((d) => {
      if (d1 < d2 && d1 < d && d < d2) return expansion - 1
      if (d1 > d2 && d1 > d && d > d2) return -(expansion - 1)
      return 0
    })
    .filter((d) => d !== 0)
    .sumAll()
}

function solution(list, expansion) {
  const universe = list.map((row) => row.split(''))
  const galaxies = getGalaxies(universe)
  const emptyY = getEmptyCoords(universe)
  const emptyX = getEmptyCoords(universe.rotateClockwise())

  return galaxies.reduce((acc, [y1, x1], i) => {
    const distancesSum = galaxies.slice(i).reduce((sum, [y2, x2]) => {
      const eY = getEmptySpace(emptyY, y1, y2, expansion)
      const eX = getEmptySpace(emptyX, x1, x2, expansion)

      return sum + Math.abs(y1 - y2 - eY) + Math.abs(x1 - x2 - eX)
    }, 0)

    return acc + distancesSum
  }, 0)
}

read('test.txt').then((list) => {
  assert.deepEqual(solution(list, 2), 374)
  assert.deepEqual(solution(list, 100), 8410)
})

read('input.txt').then((list) => {
  assert.deepEqual(solution(list, 2), 9734203)
  assert.deepEqual(solution(list, 1000000), 568914596391)
})
