import assert from 'assert'
import read from '../../utils/read.js'

const INVENTORY = {
  red: 12,
  green: 13,
  blue: 14,
}

function parseGame(line) {
  const [game, ballSet] = line.split(': ')
  const gameId = Number(game.replace(/[^0-9]/g, ''))
  const balls = ballSet.split('; ')

  return {
    gameId,
    balls: balls.map((ball) => {
      return ball.split(', ').map((b) => {
        const [count, color] = b.split(' ')

        return { color, count: Number(count) }
      })
    }),
  }
}

function isGameValid(game) {
  return game.balls.every((ballSet) => {
    return ballSet.every((ball) => {
      return ball.count <= INVENTORY[ball.color]
    })
  })
}

function checkFewestBalls(game) {
  const flatBalls = game.balls.flat2DMatrix()

  return flatBalls.reduce(
    (prev, ball) => {
      if (prev[ball.color] < ball.count) {
        return { ...prev, [ball.color]: ball.count }
      }
      return prev
    },
    { red: 0, blue: 0, green: 0 }
  )
}

function solution01(list) {
  return list
    .map((line) => parseGame(line))
    .filter((game) => isGameValid(game))
    .map((game) => game.gameId)
    .sumAll()
}

function solution02(list) {
  return list
    .map((line) => {
      const fewer = checkFewestBalls(parseGame(line))

      return Object.values(fewer).multiplyAll()
    })
    .sumAll()
}

read('test.txt').then((list) => {
  assert.deepEqual(solution01(list), 8)
  assert.deepEqual(solution02(list), 2286)
})

read('input.txt').then((list) => {
  assert.deepEqual(solution01(list), 2545)
  assert.deepEqual(solution02(list), 0)
})
