import assert from 'assert'
import read from '../../utils/read.js'

const OPERATIONS_1 = [(a, b) => a + b, (a, b) => a * b]
const OPERATIONS_2 = [...OPERATIONS_1, (a, b) => Number(`${a}${b}`)]

function parseInput(list) {
  return list.map((line) => {
    const [result, ...rest] = line.split(': ')
    return [Number(result), ...rest.map((v) => v.split(' ').map(Number))]
  })
}

function testOperations(list, OP) {
  return parseInput(list).reduce((acc, [result, values]) => {
    // Amount of operands
    const operands = values.length - 1
    // number of possible variants
    const variants = OP.length ** operands

    const correct = [].nMatrix(variants).some((_, i) => {
      // baseNumber is convert to binary in solution1 with same amount of digits
      const baseNumber = i.toString(OP.length).padStart(operands, '0')
      const test = baseNumber
        .split('')
        .map(Number)
        .reduce((acc2, opIdx, j) => {
          if (j === 0) return OP[opIdx](values[0], values[1])

          return OP[opIdx](acc2, values[j + 1])
        }, 0)

      return test === result
    })

    return acc + (correct ? result : 0)
  }, 0)
}

function solution01(list) {
  return testOperations(list, OPERATIONS_1)
}
function solution02(list) {
  return testOperations(list, OPERATIONS_2)
}

read('test.txt').then((list) => {
  assert.deepEqual(solution01(list), 3749)
  assert.deepEqual(solution02(list), 11387)
})

read('input.txt').then((list) => {
  assert.deepEqual(solution01(list), 267566105056)
  assert.deepEqual(solution02(list), 116094961956019)
})
