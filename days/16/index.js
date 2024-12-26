import assert from 'assert'
import read from '../../utils/read.js'
import dijkstra from '../../utils/dijkstra.js'

const CELLS = {
  wall: '#',
  empty: '.',
  start: 'S',
  end: 'E',
}

const DIR = {
  north: [-1, 0],
  east: [0, 1],
  south: [1, 0],
  west: [0, -1],
}

function getCapicua(list) {
  const matrix = list.map((line) => line.split(''))

  return matrix.reduce(
    (acc, row, y) => {
      row.forEach((cell, x) => {
        if (cell === CELLS.start) acc.start = [y, x]
        else if (cell === CELLS.end) acc.end = [y, x]
      })

      return acc
    },
    { matrix, start: [], end: [] }
  )
}

function scan({ matrix, start, dir }) {
  const [y, x] = start
  const cIdx = dir.findIndex((c) => c !== 0)
  const [dy, dx] = dir
  let i = start[cIdx]
  const turns = []

  const notWall = (idx) => {
    return cIdx === 0
      ? // scan up/down
        matrix[idx][x] !== CELLS.wall
      : // scan left/right
        matrix[y][idx] !== CELLS.wall
  }

  while (notWall(i)) {
    i += dir[cIdx]

    // cell where the turn could happen
    const [ty, tx] = cIdx === 0 ? [i, x] : [y, i]

    // check if there's a way to turn:
    if (
      matrix[ty + dx][tx + dy] === CELLS.empty ||
      matrix[ty - dx][tx - dy] === CELLS.empty
    ) {
      turns.push([ty, tx])
    }
  }

  return turns
}

function buildTurnsTree({ matrix, start, end, tree = {} }) {
  if (start === end) return tree

  const [y, x] = start

  const weightedTurns = Object.values(DIR).reduce((acc, dir) => {
    scan({ matrix, start, dir }).forEach(([ty, tx]) => {
      acc[[ty, tx]] = Math.abs(ty - y) + Math.abs(tx - x) + 1000
    })

    return acc
  }, {})

  // eslint-disable-next-line no-param-reassign
  tree[start] = weightedTurns

  return Object.keys(weightedTurns).reduce((acc, turn) => {
    if (acc[turn]) return acc

    const [ty, tx] = turn.split(',').map(Number)

    return buildTurnsTree({
      matrix,
      start: [ty, tx],
      end,
      tree: acc,
    })
  }, tree)
}

function solution01(list) {
  const capicua = getCapicua(list)
  const tree = buildTurnsTree(capicua)

  const cheapPath = dijkstra(tree, capicua.start.join(), capicua.end.join())

  return cheapPath.distance
}

function solution02(list) {}

read('test01.txt').then((list) => {
  assert.deepEqual(solution01(list), 7036)
  // assert.deepEqual(solution02(list), 12)
})

read('test02.txt').then((list) => {
  assert.deepEqual(solution01(list), 11048)
  // assert.deepEqual(solution02(list), 12)
})

read('input.txt').then((list) => {
  assert.deepEqual(solution01(list), 99448)
  // assert.deepEqual(solution02(list), 7083)
})
