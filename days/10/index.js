import assert from 'assert'
import read from '../../utils/read.js'

// Coordinates are [N, W, S, E]
const TILES = {
  '|': [1, 0, 1, 0],
  '-': [0, 1, 0, 1],
  L: [1, 0, 0, 1],
  J: [1, 1, 0, 0],
  7: [0, 1, 1, 0],
  F: [0, 0, 1, 1],
}

const DIR = {
  N: [-1, 0],
  W: [0, -1],
  S: [1, 0],
  E: [0, 1],
}

function findTile([N, W, S, E]) {
  return Object.keys(TILES).filter((key) => {
    const [n, w, s, e] = TILES[key]
    return (N && N === n) || (W && W === w) || (S && S === s) || (E && E === e)
  })
}

function findStart(list) {
  for (let y = 0; y < list.length; y++) {
    for (let x = 0; x < list[y].length; x++) {
      if (list[y][x] === 'S') return [y, x]
    }
  }
  return [-1, -1]
}

function findDirections({ list, start, flags = [1, 1, 1, 1] }) {
  const [y, x] = start
  const directions = []
  const [n, w, s, e] = flags
  const [N, W, S, E] = [
    list[y - 1] && list[y - 1][x],
    list[y][x - 1],
    list[y + 1] && list[y + 1][x],
    list[y][x + 1],
  ]

  // N - look for symbols with S connection [x, x, 1, x]
  if (n && N && findTile([0, 0, 1, 0]).includes(N)) {
    directions.push(DIR.N)
  }
  // W - look for symbols with E connection [x, x, x, 1]
  if (w && W && findTile([0, 0, 0, 1]).includes(W)) {
    directions.push(DIR.W)
  }
  // S - look for symbols with N connection [1, x, x, x]
  if (s && S && findTile([1, 0, 0, 0]).includes(S)) {
    directions.push(DIR.S)
  }
  // E - look for symbols with W connection [x, 1, x, x]
  if (e && E && findTile([0, 1, 0, 0]).includes(E)) {
    directions.push(DIR.E)
  }

  return directions
}

function* navigate({ list, start, direction }) {
  const position = [...start]
  let newDirection = [...direction]

  while (true) {
    position[0] += newDirection[0]
    position[1] += newDirection[1]

    const flags = TILES[list[position[0]][position[1]]]
    const directions = findDirections({ list, start: position, flags })
    newDirection = directions.find(
      ([d1, d2]) => d1 + newDirection[0] !== 0 || d2 + newDirection[1] !== 0
    )

    yield position
  }
}

function solution01(list) {
  const start = findStart(list)
  const [dir1, dir2] = findDirections({ list, start })
  const [nav1, nav2] = [
    navigate({ list, start, direction: dir1 }),
    navigate({ list, start, direction: dir2 }),
  ]
  let [p1, p2] = [-1, -1]
  let count = 0

  do {
    p1 = nav1.next().value
    p2 = nav2.next().value
    count++
  } while (!(p1[0] === p2[0] && p1[1] === p2[1]))

  return count
}

function solution02(list) {}

read('test01.txt').then((list) => {
  assert.deepEqual(solution01(list), 4)
  // assert.deepEqual(solution02(list), 2)
})

read('test02.txt').then((list) => {
  assert.deepEqual(solution01(list), 8)
  // assert.deepEqual(solution02(list), 2)
})

read('input.txt').then((list) => {
  assert.deepEqual(solution01(list), 6956)
  // assert.deepEqual(solution02(list), 1041)
})
