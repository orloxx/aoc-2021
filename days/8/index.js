import assert from 'assert'
import read from '../../utils/read.js'

function parseInput(list) {
  const matrix = list.map((line) => line.split(''))
  const maxY = matrix.length
  const maxX = matrix[0].length

  return { matrix, maxY, maxX }
}

function getAntennasMap(matrix) {
  return matrix.reduce((acc, row, y) => {
    return {
      ...acc,
      ...row.reduce((acc2, cell, x) => {
        if (cell === '.') return acc2

        return { ...acc2, [cell]: [...(acc2[cell] || []), `${y},${x}`] }
      }, acc),
    }
  }, {})
}

function findAntinode({ position1, position2, maxY, maxX }) {
  const [y1, x1] = position1.split(',').map(Number)
  const [y2, x2] = position2.split(',').map(Number)
  const [dy, dx] = [y2 - y1, x2 - x1]

  const [ay, ax] = [y1 - dy, x1 - dx]

  if (ay < 0 || ax < 0) return []
  if (ay >= maxY || ax >= maxX) return []

  return [ay, ax]
}

function findAntinodesSet(positions, compareCallback) {
  return positions.reduce((acc1, position1) => {
    return positions
      .filter((p) => p !== position1)
      .reduce((acc2, position2) => {
        return [...acc2, ...compareCallback(position1, position2)]
      }, acc1)
  }, [])
}

function findAllAntinodes(matrix, compareCallback) {
  const antennasMap = getAntennasMap(matrix)

  return Object.values(antennasMap).reduce((acc, positions) => {
    const antinodes = findAntinodesSet(positions, compareCallback)

    return [...acc, ...antinodes]
  }, [])
}

function solution01(list) {
  const { matrix, maxY, maxX } = parseInput(list)

  const antinodes = findAllAntinodes(matrix, (position1, position2) => {
    const [ay, ax] = findAntinode({ position1, position2, maxY, maxX })

    if (typeof ay === 'undefined') return []

    return [`${ay},${ax}`]
  })

  return new Set([...antinodes]).size
}

function findAntinodes({ position1, position2, maxY, maxX, set = [] }) {
  const [ay, ax] = findAntinode({ position1, position2, maxY, maxX })

  set.push(position1)
  set.push(position2)

  if (typeof ay === 'undefined') return set

  set.push(`${ay},${ax}`)

  return findAntinodes({
    position1: `${ay},${ax}`,
    position2: position1,
    maxY,
    maxX,
    set,
  })
}

function solution02(list) {
  const { matrix, maxY, maxX } = parseInput(list)

  const antinodes = findAllAntinodes(matrix, (position1, position2) => {
    return findAntinodes({ position1, position2, maxY, maxX })
  })

  return new Set([...antinodes]).size
}

read('test.txt').then((list) => {
  assert.deepEqual(solution01(list), 14)
  assert.deepEqual(solution02(list), 34)
})

read('input.txt').then((list) => {
  assert.deepEqual(solution01(list), 379)
  assert.deepEqual(solution02(list), 1339)
})
