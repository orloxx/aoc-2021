import assert from 'assert'
import read from '../../utils/read.js'

const OPTIONS = ['rock', 'paper', 'scissors']
const OPPONENT = ['A', 'B', 'C']
const MINE = ['X', 'Y', 'Z']

const WIN = { rock: OPTIONS[2], paper: OPTIONS[0], scissors: OPTIONS[1] }
const LOSE = { rock: OPTIONS[1], paper: OPTIONS[2], scissors: OPTIONS[0] }

function calculatePoints(opponent, mine) {
  const points = OPTIONS.indexOf(mine) + 1
  if (WIN[mine] === opponent) return points + 6
  if (LOSE[mine] === opponent) return points
  return points + 3
}

function getSolution(list, mineSelector) {
  return list.reduce((acc, curr) => {
    const [o, m] = curr.split(' ')
    const opponent = OPTIONS[OPPONENT.indexOf(o)]
    const mine = mineSelector(m, opponent)

    return acc + calculatePoints(opponent, mine)
  }, 0)
}

function solution01(list) {
  return getSolution(list, (m) => OPTIONS[MINE.indexOf(m)])
}

function solution02(list) {
  return getSolution(list, (option, choice) => {
    if (option === 'X') return WIN[choice]
    if (option === 'Y') return choice
    return LOSE[choice]
  })
}

read('test.txt').then((list) => {
  assert.deepEqual(solution01(list), 15)
  assert.deepEqual(solution02(list), 12)
})

read('input.txt').then((list) => {
  assert.deepEqual(solution01(list), 13268)
  assert.deepEqual(solution02(list), 15508)
})
