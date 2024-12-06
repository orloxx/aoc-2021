import assert from 'assert'
import read from '../../utils/read.js'

const DIR = {
  up: [-1, 0],
  down: [1, 0],
  left: [0, -1],
  right: [0, 1],
  turnRight(dir) {
    if (dir === this.up) return this.right
    if (dir === this.right) return this.down
    if (dir === this.down) return this.left
    return this.up
  },
}

function parseInput(list) {
  return list.reduce(
    (acc, line, y) => {
      const x = line.indexOf('^')

      if (x >= 0) acc.guard = [y, x]

      acc.matrix.push(line.split(''))

      return acc
    },
    { matrix: [], guard: [0, 0] }
  )
}

function* guardMovement({ matrix, initialGuard }) {
  const newMatrix = matrix.map((row) => [...row])
  const positions = new Set()
  let direction = DIR.up
  let guard = [...initialGuard]
  let loop = 0

  while (true) {
    const [y, x] = guard
    const [dy, dx] = direction
    const [ny, nx] = [y + dy, x + dx]

    positions.add(`${y},${x}`)

    if (newMatrix[ny]?.[nx] === '#') {
      newMatrix[ny][nx] = 0
      direction = DIR.turnRight(direction)
    } else if (newMatrix[ny]?.[nx] === '.' || newMatrix[ny]?.[nx] === '^') {
      guard = [ny, nx]

      yield { positions, loop, ended: false }
    } else if (typeof newMatrix[ny]?.[nx] === 'number') {
      direction = DIR.turnRight(direction)
      loop = newMatrix[ny][nx]++
    } else {
      yield { positions, loop, ended: true }
    }
  }
}

function getGuardStep({ matrix, guard }) {
  const movementGenerator = guardMovement({ matrix, initialGuard: guard })
  let ended = false
  let loop = 0
  let step

  do {
    step = movementGenerator.next().value

    ended = step.ended
    loop = step.loop
  } while (!ended && loop < 2)

  return step
}

function solution01(list) {
  const { matrix, guard } = parseInput(list)
  const step = getGuardStep({ matrix, guard })

  return step.positions.size
}

function solution02(list) {
  const { matrix, guard } = parseInput(list)
  const step = getGuardStep({ matrix, guard })

  return [...step.positions].reduce((acc, pos) => {
    const [y, x] = pos.split(',').map(Number)
    const [gy, gx] = guard

    if (y === gy && x === gx) return acc

    const newMatrix = matrix.map((row) => [...row])

    newMatrix[y][x] = '#'

    const newStep = getGuardStep({ matrix: newMatrix, guard })

    return acc + (newStep.loop > 1 ? 1 : 0)
  }, 0)
}

read('test.txt').then((list) => {
  assert.deepEqual(solution01(list), 41)
  assert.deepEqual(solution02(list), 6)
})

read('input.txt').then((list) => {
  assert.deepEqual(solution01(list), 5086)
  assert.deepEqual(solution02(list), 1770)
})
