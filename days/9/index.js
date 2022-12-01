import assert from 'assert'
import read from '../../utils/read.js'

function areAdjacent([x1, y1], [x2, y2]) {
  const dx = Math.abs(x1 - x2)
  const dy = Math.abs(y1 - y2)
  return dx < 2 && dy < 2
}

function move({ rope, num, dir, idx }) {
  return [].nMatrix(num).map(() => {
    const head = rope[0]
    const tail = rope[rope.length - 1]
    head[idx] += dir

    for (let i = 0; i < rope.length - 1; i++) {
      const body = rope[i + 1]
      if (!areAdjacent(rope[i], body)) {
        const x = rope[i][0] - body[0]
        const y = rope[i][1] - body[1]
        body[0] += x ? x / Math.abs(x) : 0
        body[1] += y ? y / Math.abs(y) : 0
      }
    }

    return [tail[0], tail[1]]
  })
}

const POSITIONS = {
  U: { dir: 1, idx: 0 },
  R: { dir: 1, idx: 1 },
  D: { dir: -1, idx: 0 },
  L: { dir: -1, idx: 1 },
}

function moveRope(list, ropeSize) {
  const tailSteps = new Set(['0,0'])
  const rope = [].nMatrix(ropeSize).map(() => [0, 0])

  list.forEach((line) => {
    const [dir, n] = line.split(' ')
    const tailPositions = move({
      rope,
      num: parseInt(n, 10),
      ...POSITIONS[dir],
    })

    tailPositions.forEach((p) => {
      const [x, y] = p
      tailSteps.add(`${x},${y}`)
    })
  })

  return tailSteps.size
}

function solution01(list) {
  return moveRope(list, 2)
}

function solution02(list) {
  return moveRope(list, 10)
}

read('test.txt').then((list) => {
  assert.deepEqual(solution01(list), 88)
  assert.deepEqual(solution02(list), 36)
})

read('input.txt').then((list) => {
  assert.deepEqual(solution01(list), 6037)
  assert.deepEqual(solution02(list), 2485)
})
