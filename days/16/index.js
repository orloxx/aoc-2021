import assert from 'assert'
import read from '../../utils/read.js'

const DIR = {
  N: [-1, 0],
  W: [0, -1],
  S: [1, 0],
  E: [0, 1],
}

const DIR_CHANGE = {
  // mirror /
  [`/${DIR.N.join()}`]: DIR.E,
  [`/${DIR.W.join()}`]: DIR.S,
  [`/${DIR.S.join()}`]: DIR.W,
  [`/${DIR.E.join()}`]: DIR.N,
  // mirror \
  [`\\${DIR.N.join()}`]: DIR.W,
  [`\\${DIR.W.join()}`]: DIR.N,
  [`\\${DIR.S.join()}`]: DIR.E,
  [`\\${DIR.E.join()}`]: DIR.S,
}

const SPLIT = {
  // splitter -
  [`-${DIR.N.join()}`]: [DIR.W, DIR.E],
  [`-${DIR.W.join()}`]: [],
  [`-${DIR.S.join()}`]: [DIR.W, DIR.E],
  [`-${DIR.E.join()}`]: [],
  // splitter |
  [`|${DIR.N.join()}`]: [],
  [`|${DIR.W.join()}`]: [DIR.N, DIR.S],
  [`|${DIR.S.join()}`]: [],
  [`|${DIR.E.join()}`]: [DIR.N, DIR.S],
}

function beamMeUp({ mirrorMatrix, start = [0, 0], dir = DIR.E }) {
  const matrix = mirrorMatrix.map((row) => row.map((c) => ({ ...c })))
  const heads = [{ pos: start, dir }]

  while (heads.length) {
    heads.forEach((_, i) => {
      const [y, x] = heads[i].pos

      // stop when out of bounds or when beam is in a cycle
      if (
        y < 0 ||
        x < 0 ||
        y >= matrix.length ||
        x >= matrix[0].length ||
        matrix[y][x].dirs.some((d) => d.join() === heads[i].dir.join())
      ) {
        heads.splice(i, 1)
        return
      }

      const { cell } = matrix[y][x]
      // energize cell
      matrix[y][x].energy++
      // add beam direction to cell
      matrix[y][x].dirs.push(heads[i].dir)

      // Change direction
      if (['/', '\\'].includes(cell)) {
        heads[i].dir = DIR_CHANGE[`${cell}${heads[i].dir.join()}`]
      } else if (['-', '|'].includes(cell)) {
        const splits = SPLIT[`${cell}${heads[i].dir.join()}`]

        if (splits.length) {
          const [dy, dx] = splits[1]

          heads[i].dir = splits[0]
          heads.push({ pos: [y + dy, x + dx], dir: splits[1] })
        }
      }

      const [dy, dx] = heads[i].dir

      // move head
      heads[i].pos = [y + dy, x + dx]
    })
  }

  return matrix
}

function getMirrorMatrix(list) {
  return list.map((row) =>
    row.split('').map((c) => ({ cell: c, energy: 0, dirs: [] }))
  )
}

function solution01(list, start = [0, 0], dir = DIR.E) {
  const mirrorMatrix = getMirrorMatrix(list)
  const energyMatrix = beamMeUp({ mirrorMatrix, start, dir }).map((line) =>
    line.map((c) => (c.energy > 0 ? '#' : '.'))
  )

  return energyMatrix.flat2DMatrix().filter((c) => c === '#').length
}

function solution02(list) {
  const energyList = []

  for (let i = 0; i < list.length; i++) {
    energyList.push(solution01(list, [i, 0], DIR.E))
    energyList.push(solution01(list, [0, i], DIR.S))
    energyList.push(solution01(list, [i, list.length - 1], DIR.W))
    energyList.push(solution01(list, [list.length - 1, i], DIR.N))
  }

  return Math.max(...energyList)
}

read('test.txt').then((list) => {
  assert.deepEqual(solution01(list), 46)
  assert.deepEqual(solution02(list), 51)
})

read('input.txt').then((list) => {
  assert.deepEqual(solution01(list), 7870)
  assert.deepEqual(solution02(list), 8143)
})
