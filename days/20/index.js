import assert from 'assert'
import read from '../../utils/read.js'
import { DIR, OBJ, treeFromGrid } from '../../utils/grid.js'
import bfs from '../../utils/bfs.js'

function parseInput(list) {
  return list.reduce(
    (acc, line, y) => {
      acc.grid.push([])

      line.split('').forEach((cell, x) => {
        if (cell === OBJ.start) acc.start = [y, x]
        else if (cell === OBJ.end) acc.end = [y, x]

        acc.grid[y].push(cell)
      })

      return acc
    },
    { grid: [], start: [], end: [] }
  )
}

function scanCheats({ grid, position, visited }) {
  const [y, x] = position

  return Object.values(DIR)
    .map(([dy, dx]) => {
      const [ny, nx] = [y + dy, x + dx]
      const [nny, nnx] = [ny + dy, nx + dx]
      const cell = grid[ny][nx]
      const nextCell = grid[nny]?.[nnx]

      if (
        cell === OBJ.wall &&
        nextCell &&
        nextCell !== OBJ.wall &&
        !visited.has([nny, nnx].join())
      ) {
        return [nny, nnx]
      }

      return null
    })
    .filter(Boolean)
}

function getCheatMap({ grid, fastestPath }) {
  const stepsMap = fastestPath.reduce((acc, coords, i) => {
    acc[coords] = i

    return acc
  }, {})
  const visited = new Set()

  return fastestPath.reduce((acc, coords, i) => {
    const position = coords.split(',').map(Number)
    const cheats = scanCheats({ grid, position, visited })

    cheats.forEach((cheat) => {
      const withoutCheat = stepsMap[cheat]
      const withCheat = i + 2
      const saves = withoutCheat - withCheat

      acc[saves] = acc[saves] ? acc[saves] + 1 : 1
    })

    visited.add(coords)

    return acc
  }, {})
}

// input path is 9336 steps long
function solution01(list, minSaves) {
  const { grid, start, end } = parseInput(list)
  const tree = treeFromGrid(grid)
  const fastestPath = bfs({ tree, start: start.join(), end: end.join() })
  const cheatMap = getCheatMap({ grid, fastestPath })

  return Object.entries(cheatMap).reduce((acc, [saves, count]) => {
    const savesNum = Number(saves)

    return acc + (savesNum >= minSaves ? count : 0)
  }, 0)
}

function solution02(list) {}

read('test.txt').then((list) => {
  assert.deepEqual(solution01(list, 20), 5)
  // assert.deepEqual(solution02(list), 0)
})

read('input.txt').then((list) => {
  assert.deepEqual(solution01(list, 100), 1393)
  // assert.deepEqual(solution02(list), 0)
})
