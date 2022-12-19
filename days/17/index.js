import assert from 'assert'
import read from '../../utils/read.js'
import Tetris from './tetris.js'

function playTetris(list, top) {
  const tetris = new Tetris(list, top)

  while (!tetris.isDone) {
    const current = tetris.next

    while (current.falling) {
      const direction = tetris.nextDirection

      if (tetris.canMoveSide(current, direction)) {
        current.moveSides(direction)
      }

      if (tetris.canMoveDown(current)) {
        current.moveDown()
      } else {
        tetris.put(current)
      }
    }
  }

  return tetris.height
}

function solve(list, [total, first, top, height]) {
  const piecesPerBlock = top - first
  const numBlocks = Math.floor((total - first) / piecesPerBlock)
  const rest = total - numBlocks * piecesPerBlock
  const calcH = height * numBlocks

  return calcH + playTetris(list, rest)
}

function solution01(list, params) {
  return solve(list, [2022, ...params])
}

function solution02(list, params) {
  return solve(list, [1000000000000, ...params])
}

read('test.txt').then((list) => {
  const params = [15, 50, 53]
  assert.deepEqual(solution01(list, params), 3068)
  assert.deepEqual(solution02(list, params), 1514285714288)
})

read('input.txt').then((list) => {
  const params = [255, 2005, 2781]
  assert.deepEqual(solution01(list, params), 3211)
  assert.deepEqual(solution02(list, params), 1589142857183)
})
