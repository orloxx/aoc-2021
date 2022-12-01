import assert from 'assert'
import read from '../../utils/read.js'

function getSortedCalories(list) {
  return list
    .reduce(
      (acc, curr) => {
        if (curr === '') return [...acc, 0]
        acc[acc.length - 1] += parseInt(curr, 10)
        return acc
      },
      [0]
    )
    .sortIntegers(-1)
}

function solution01(list) {
  return getSortedCalories(list).shift()
}

function solution02(list) {
  return getSortedCalories(list)
    .filter((item, i) => i < 3)
    .sumAll()
}

read('test.txt').then((list) => {
  assert.deepEqual(solution01(list), 24000)
  assert.deepEqual(solution02(list), 45000)
})

read('input.txt').then((list) => {
  assert.deepEqual(solution01(list), 67450)
  assert.deepEqual(solution02(list), 199357)
})
