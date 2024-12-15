/* eslint-disable no-param-reassign */
import assert from 'assert'
import read from '../../utils/read.js'

const ELEMS = {
  wall: '#',
  empty: '.',
  box: 'O',
  robot: '@',
}

function parseInput(list) {
  const splitIdx = list.findIndex((line) => line === '')
  const { map, robot } = list.slice(0, splitIdx).reduce(
    (acc, line, y) => {
      const cells = line.split('')
      const x = cells.findIndex((cell) => cell === ELEMS.robot)

      if (x >= 0) acc.robot = [y, x]

      acc.map.push(cells)

      return acc
    },
    { map: [], robot: [] }
  )
  const moves = list
    .slice(splitIdx + 1)
    .join('')
    .split('')

  return { map, moves, robot }
}

function getEmptyOffset(line) {
  const wallIdx = line.findIndex((n) => n === ELEMS.wall)
  const noWalls = line.slice(0, wallIdx)

  return noWalls.findIndex((n) => n === ELEMS.empty) + 1
}

function moveX({ map, position, direction = 1 }) {
  const [y, x] = position
  const line =
    direction > 0 ? map[y].slice(x + 1) : map[y].slice(0, x).reverse()
  const emptyOffset = getEmptyOffset(line)

  // If no empty spaces, do nothing
  if (!emptyOffset) return [y, x]
  // There's a box in the middle
  if (emptyOffset > 1) map[y][x + emptyOffset * direction] = ELEMS.box

  map[y][x] = ELEMS.empty
  map[y][x + direction] = ELEMS.robot

  return [y, x + direction]
}

function moveY({ map, position, direction = 1 }) {
  const [y, x] = position
  const verticalLine = map.map((l) => l[x])
  const line =
    direction > 0
      ? verticalLine.slice(y + 1)
      : verticalLine.slice(0, y).reverse()
  const emptyOffset = getEmptyOffset(line)

  if (!emptyOffset) return [y, x]
  if (emptyOffset > 1) map[y + emptyOffset * direction][x] = ELEMS.box

  map[y][x] = ELEMS.empty
  map[y + direction][x] = ELEMS.robot

  return [y + direction, x]
}

const MOVE = {
  '>': (map, position) => {
    return moveX({ map, position })
  },
  '<': (map, position) => {
    return moveX({ map, position, direction: -1 })
  },
  v: (map, position) => {
    return moveY({ map, position })
  },
  '^': (map, position) => {
    return moveY({ map, position, direction: -1 })
  },
}

function solution01(list) {
  const { map, moves, robot } = parseInput(list)

  moves.reduce((position, move) => {
    return MOVE[move](map, position)
  }, robot)

  return map.reduce((acc, row, y) => {
    return row.reduce((acc2, cell, x) => {
      if (cell !== ELEMS.box) return acc2

      return acc2 + y * 100 + x
    }, acc)
  }, 0)
}

function solution02(list) {}

read('test.txt').then((list) => {
  assert.deepEqual(solution01(list), 10092)
  // assert.deepEqual(solution02(list), 12)
})

read('input.txt').then((list) => {
  assert.deepEqual(solution01(list), 1552463)
  // assert.deepEqual(solution02(list), 7083)
})
