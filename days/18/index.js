import assert from 'assert'
import read from '../../utils/read.js'
import { OBJ, treeFromGrid } from '../../utils/grid.js'
import bfs from '../../utils/bfs.js'

function getWalledGrid(list, size) {
  return list.reduce((acc, line) => {
    const [x, y] = line.split(',').map(Number)

    acc[y][x] = OBJ.wall

    return acc
  }, [].n2DMatrix(size + 1, OBJ.empty))
}

function solution01(list, size, timeBytes) {
  const grid = getWalledGrid(list.slice(0, timeBytes), size)
  const tree = treeFromGrid(grid)

  return bfs({ tree, start: '0,0', end: `${size},${size}` }).length - 1
}

function solution02(list, size, timeBytes) {
  const grid = getWalledGrid(list.slice(0, timeBytes), size)
  const bytes = []
  let path = [-1]

  while (path.length) {
    const [cx, cy] = list[timeBytes + bytes.length].split(',').map(Number)

    grid[cy][cx] = OBJ.wall
    bytes.push([cy, cx])

    const tree = treeFromGrid(grid)

    path = bfs({ tree, start: '0,0', end: `${size},${size}` })
  }

  return bytes[bytes.length - 1]
}

read('test.txt').then((list) => {
  assert.deepEqual(solution01(list, 6, 12), 22)
  assert.deepEqual(solution02(list, 6, 12), [1, 6])
})

read('input.txt').then((list) => {
  assert.deepEqual(solution01(list, 70, 1024), 384)
  assert.deepEqual(solution02(list, 70, 1024), [10, 36])
})
