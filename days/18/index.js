import assert from 'assert'
import read from '../../utils/read.js'

const ADJACENT = [
  [-1, 0, 0],
  [1, 0, 0],
  [0, -1, 0],
  [0, 1, 0],
  [0, 0, -1],
  [0, 0, 1],
]

function getLava(list) {
  const positions = list.map((line) => line.split(',').toNumber())
  const lava = positions.map(([x, y, z]) => [x + 1, y + 1, z + 1])
  const maxX = Math.max(...lava.map(([x]) => x)) + 1
  const maxY = Math.max(...lava.map(([, y]) => y)) + 1
  const maxZ = Math.max(...lava.map(([, , z]) => z)) + 1
  const space = []
    .range(maxX + 1)
    .map(() =>
      [].range(maxY + 1).map(() => [].range(maxZ + 1).map(() => false))
    )
  lava.forEach(([x, y, z]) => {
    space[x][y][z] = true
  })

  return { lava, space, maxX, maxY, maxZ }
}

function solution01(list) {
  const { lava, space } = getLava(list)

  return lava.reduce((acc, [x, y, z]) => {
    return ADJACENT.reduce((acc1, [dx, dy, dz]) => {
      if (!space[x + dx][y + dy][z + dz]) {
        return acc1 + 1
      }
      return acc1
    }, acc)
  }, 0)
}

function solution02(list) {
  const { space, maxX, maxY, maxZ } = getLava(list)
  const visited = space.map((slice) => slice.map((row) => row.map(() => false)))
  const queue = [[0, 0, 0]]
  let sides = 0

  while (queue.length > 0) {
    const [x, y, z] = queue.pop()

    if (!visited[x][y][z]) {
      visited[x][y][z] = true

      // eslint-disable-next-line no-loop-func
      ADJACENT.forEach(([dx, dy, dz]) => {
        const [xp, yp, zp] = [x, y, z].sumNMatrix([dx, dy, dz])

        if (xp < 0 || yp < 0 || zp < 0 || xp > maxX || yp > maxY || zp > maxZ) {
          return
        }

        if (space[xp][yp][zp]) {
          sides++
          return
        }

        queue.push([xp, yp, zp])
      })
    }
  }

  return sides
}

read('test.txt').then((list) => {
  assert.deepEqual(solution01(list), 64)
  assert.deepEqual(solution02(list), 58)
})

read('input.txt').then((list) => {
  assert.deepEqual(solution01(list), 4580)
  assert.deepEqual(solution02(list), 2610)
})
