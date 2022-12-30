import assert from 'assert'
import read from '../../utils/read.js'

const testStacks = () => ({
  1: ['Z', 'N'],
  2: ['M', 'C', 'D'],
  3: ['P'],
})

const inputStacks = () => ({
  1: ['D', 'B', 'J', 'V'],
  2: ['P', 'V', 'B', 'W', 'R', 'D', 'F'],
  3: ['R', 'G', 'F', 'L', 'D', 'C', 'W', 'Q'],
  4: ['W', 'J', 'P', 'M', 'L', 'N', 'D', 'B'],
  5: ['H', 'N', 'B', 'P', 'C', 'S', 'Q'],
  6: ['R', 'D', 'B', 'S', 'N', 'G'],
  7: ['Z', 'B', 'P', 'M', 'Q', 'F', 'S', 'H'],
  8: ['W', 'L', 'F'],
  9: ['S', 'V', 'F', 'M', 'R'],
})

function getString(stack) {
  return Object.keys(stack).reduce((acc, curr) => {
    return `${acc}${stack[curr].pop()}`
  }, '')
}

function solution01(list, stack) {
  list.forEach((line) => {
    const [move, from, to] = line.match(/[0-9]+/g).toNumber()

    for (let i = 0; i < move; i += 1) {
      stack[to].push(stack[from].pop())
    }
  })

  return getString(stack)
}

function solution02(list, stack) {
  list.forEach((line) => {
    const [move, from, to] = line.match(/[0-9]+/g).toNumber()
    stack[to].push(...stack[from].splice(stack[from].length - move))
  })

  return getString(stack)
}

read('test.txt').then((list) => {
  assert.deepEqual(solution01(list, testStacks()), 'CMZ')
  assert.deepEqual(solution02(list, testStacks()), 'MCD')
})

read('input.txt').then((list) => {
  assert.deepEqual(solution01(list, inputStacks()), 'BSDMQFLSP')
  assert.deepEqual(solution02(list, inputStacks()), 'PGSQBFLDP')
})
