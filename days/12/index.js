import assert from 'assert'
import read from '../../utils/read.js'

const alphabet = 'abcdefghijklmnopqrstuvwxyz'

function parseMap(list) {
  const StartEndPos = { start: [0, 0], end: [0, 0] }

  const terrain = list.map((line, x) =>
    line.split('').map((letter, y) => {
      if (letter === 'S') {
        StartEndPos.start = [x, y]
        return Infinity
      }
      if (letter === 'E') {
        StartEndPos.end = [x, y]
        return alphabet.indexOf('z')
      }
      return alphabet.indexOf(`${letter}`)
    })
  )

  return { terrain, ...StartEndPos }
}

function shortest({ terrain, end }) {
  const visited = terrain.map((line) => line.map(() => false))
  const shortestPaths = terrain.map((line, i) =>
    line.map((n, j) => {
      if (i === end[0] && j === end[1]) return 0
      return Infinity
    })
  )

  const queue = [end]

  while (queue.length > 0) {
    const [x, y] = queue.shift()
    visited[x][y] = true

    const adjacent = [
      [x, y - 1],
      [x, y + 1],
      [x - 1, y],
      [x + 1, y],
    ].filter(([i, j]) => {
      return terrain[i]?.[j] !== undefined
    })

    adjacent.forEach(([i, j]) => {
      const height = terrain[x][y]
      const adjHeight = terrain[i][j]

      if (height > adjHeight - 2) {
        shortestPaths[x][y] = Math.min(
          shortestPaths[x][y],
          shortestPaths[i][j] + 1
        )
      }

      if (!visited[i][j] && height < adjHeight + 2) {
        queue.push([i, j])
        visited[i][j] = true
      }
    })
  }

  return shortestPaths
}

function solution01(list) {
  const { terrain, start, end } = parseMap(list)
  return shortest({ terrain, end })[start[0]][start[1]]
}

function solution02(list) {
  const { terrain, start, end } = parseMap(list)
  const paths = shortest({ terrain, start, end })

  return terrain.reduce((acc, line, x) => {
    return line.reduce((acc01, height, y) => {
      if (height === 0) return Math.min(acc01, paths[x][y])
      return acc01
    }, acc)
  }, Infinity)
}

read('test.txt').then((list) => {
  assert.deepEqual(solution01(list), 31)
  assert.deepEqual(solution02(list), 29)
})

read('input.txt').then((list) => {
  assert.deepEqual(solution01(list), 408)
  assert.deepEqual(solution02(list), 399)
})
