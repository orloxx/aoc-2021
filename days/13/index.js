import assert from 'assert'
import read from '../../utils/read.js'
import { compareArrays } from '../../utils/index.js'

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

function solution01(list) {
  const data = parseInput(list)

  return data.reduce((acc, pair, i) => {
    const [one, two] = pair
    const correct = compareArrays(one, two)

    if (correct === 1) return acc + i + 1

    return acc
  }, 0)
}

function solution02(list) {
  const two = [[2]]
  const six = [[6]]
  const data = parseInput(list).flat().concat([two], [six])

  return data
    .sort((a, b) => compareArrays(b, a))
    .map((n, i) => (n === two || n === six ? i + 1 : 1))
    .multiplyAll()
}

read('test.txt').then((list) => {
  assert.deepEqual(solution01(list), 13)
  assert.deepEqual(solution02(list), 140)
})

read('input.txt').then((list) => {
  assert.deepEqual(solution01(list), 6484)
  assert.deepEqual(solution02(list), 19305)
})
