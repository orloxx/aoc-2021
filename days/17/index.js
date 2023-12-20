import assert from 'assert'
import read from '../../utils/read.js'

const DIR = {
  N: [-1, 0],
  W: [0, -1],
  S: [1, 0],
  E: [0, 1],
}

function solution01(list) {
  const matrix = list.map((line) => line.split('').toNumber())

  return 0
}

function solution02(list) {}

read('test.txt').then((list) => {
  assert.deepEqual(solution01(list), 102)
  // assert.deepEqual(solution02(list), 51)
})

read('input.txt').then((list) => {
  // assert.deepEqual(solution01(list), 7870)
  // assert.deepEqual(solution02(list), 8143)
})
