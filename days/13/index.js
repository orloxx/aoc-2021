import assert from 'assert'
import read from '../../utils/read.js'

function parseInput(list) {
  return list.reduce((acc, line) => {
    if (!acc.length) return [[JSON.parse(line)]]
    if (line) {
      const last = [...acc.pop(), JSON.parse(line)]
      return [...acc, last]
    }
    return [...acc, []]
  }, [])
}

function check(o1, o2) {
  if (typeof o1 === 'number' && typeof o2 === 'number') {
    const rest = o2 - o1
    if (rest === 0) return rest
    return rest / Math.abs(rest)
  }
  const [one, two] = [
    typeof o1 === 'number' ? [o1] : o1,
    typeof o2 === 'number' ? [o2] : o2,
  ]

  for (let i = 0; i < one.length; i++) {
    if (typeof two[i] === 'undefined') return -1

    const valid = check(one[i], two[i])

    if (valid !== 0) return valid
  }

  if (one.length < two.length) return 1
  return 0
}

function solution01(list) {
  const data = parseInput(list)

  return data.reduce((acc, pair, i) => {
    const [one, two] = pair
    const correct = check(one, two)

    if (correct === 1) return acc + i + 1

    return acc
  }, 0)
}

function solution02(list) {
  const two = [[2]]
  const six = [[6]]
  const data = parseInput(list).flat().concat([two], [six])

  return data
    .sort((a, b) => check(b, a))
    .map((n, i) => (n === two || n === six ? i + 1 : 1))
    .multiplyAll()
}

read('test.txt').then((list) => {
  assert.deepEqual(solution01(list), 13)
  assert.deepEqual(solution02(list), 140)
})

read('input.txt').then((list) => {
  assert.deepEqual(solution01(list), 6484)
  assert.deepEqual(solution02(list), 0)
})
