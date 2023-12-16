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

const TURNS = ['7', 'J', 'L', 'F']
// D: Derecha, I: Izquierda
const TURN = {
  7: { [DIR.E]: 'D', [DIR.N]: 'I' },
  J: { [DIR.S]: 'D', [DIR.E]: 'I' },
  L: { [DIR.W]: 'D', [DIR.S]: 'I' },
  F: { [DIR.N]: 'D', [DIR.W]: 'I' },
}

/**
 * Look direction by direction when looking to the right
 * When looking to the left, reverse the axis
 *
 * [0,1] E -> [1, 0] S = [1, -1] (turns right)
 * [0,1] E -> [-1, 0] N = [-1, -1] (turns left)
 *
 * c = turn coefficient
 */
const LOOK_DIR = {
  [DIR.E]: (c = 1) => [c, -1],
  [DIR.S]: (c = 1) => [-1, -c],
  [DIR.W]: (c = 1) => [-c, 1],
  [DIR.N]: (c = 1) => [1, c],
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

  while (newDirection) {
    position[0] += newDirection[0]
    position[1] += newDirection[1]

    const flags = TILES[list[position[0]][position[1]]]
    const dirFrom = newDirection
    const directions = findDirections({ list, start: position, flags })
    newDirection = directions.find(
      ([d1, d2]) => d1 + newDirection[0] !== 0 || d2 + newDirection[1] !== 0
    )

    yield { position: [...position], newDirection, dirFrom }
  }

  yield null
}

function getNavigationPointers(list) {
  const start = findStart(list)
  const [dir1, dir2] = findDirections({ list, start })
  const [nav1, nav2] = [
    navigate({ list, start, direction: dir1 }),
    navigate({ list, start, direction: dir2 }),
  ]
  return { start, nav1, nav2 }
}

function solution01(list) {
  const { nav1, nav2 } = getNavigationPointers(list)
  let [p1, p2] = [-1, -1]
  let count = 0

  do {
    p1 = nav1.next().value.position
    p2 = nav2.next().value.position
    count++
  } while (!(p1[0] === p2[0] && p1[1] === p2[1]))

  return count
}

function getPipePositions({ list, nav }) {
  const pipes = []
  let pos = 1

  while (pos) {
    // current pipe position
    pos = nav.next().value

    if (pos) {
      const [y, x] = pos.position
      // pipe type
      const pipe = list[y][x]

      // If it's a turn pipe
      if (TURNS.includes(pipe)) {
        const turn = TURN[pipe]

        // Save the pipe position and the turn direction
        pipes.push({ pipe, pos, turn: turn[pos.dirFrom] })
      } else {
        // running straight
        pipes.push({ pipe, pos, turn: false })
      }
    }
  }

  return pipes
}

function solution02(list) {
  const { nav1 } = getNavigationPointers(list)
  const pipes = getPipePositions({ list, nav: nav1 })
  const pipesPositions = pipes.map(({ pos }) => pos.position)
  const rightTurns = pipes.filter(({ turn }) => turn === 'D')
  const leftTurns = pipes.filter(({ turn }) => turn === 'I')
  // 1 = mostly right turns, -1 = mostly left turns
  const turnCoefficient =
    Math.abs(rightTurns.length - leftTurns.length) /
    (rightTurns.length - leftTurns.length)
  const innerTiles = new Set()

  const isPipe = ([y, x]) =>
    pipesPositions.some(([py, px]) => py === y && px === x) ||
    list[y][x] === 'S'

  const swipeDirection = ({ position, direction }) => {
    const [dirY, dirX] = direction
    const [lookDirY, lookDirX] = LOOK_DIR[direction](turnCoefficient)
    const [swipeY, swipeX] = [dirY + lookDirY, dirX + lookDirX]
    let [y, x] = position

    while (!isPipe([y + swipeY, x + swipeX])) {
      const inner = `${y + swipeY},${x + swipeX}`
      innerTiles.add(inner)
      y += swipeY
      x += swipeX
    }
  }

  pipes.forEach((pipe) => {
    swipeDirection({ position: pipe.pos.position, direction: pipe.pos.dirFrom })

    if (!pipe.pos.newDirection) return

    swipeDirection({
      position: pipe.pos.position,
      direction: pipe.pos.newDirection,
    })
  })

  return innerTiles.size
}

read('test01.txt').then((list) => {
  assert.deepEqual(solution01(list), 4)
  assert.deepEqual(solution02(list), 1)
})

read('test02.txt').then((list) => {
  assert.deepEqual(solution01(list), 8)
  assert.deepEqual(solution02(list), 1)
})

read('test03.txt').then((list) => {
  assert.deepEqual(solution02(list), 10)
})

read('input.txt').then((list) => {
  assert.deepEqual(solution01(list), 6956)
  assert.deepEqual(solution02(list), 455)
})
