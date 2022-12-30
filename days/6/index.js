import assert from 'assert'
import read from '../../utils/read.js'

function calculateStream(list, steps) {
  return list.map((stream) => {
    for (let i = 0; i < stream.length; i++) {
      const subStream = stream.substring(i, i + steps).split('')
      if (subStream.areDistinct()) return i + steps
    }
    return null
  })
}

function solution01(list) {
  return calculateStream(list, 4)
}

function solution02(list) {
  return calculateStream(list, 14)
}

read('test.txt').then((list) => {
  assert.deepEqual(solution01(list), [7, 5, 6, 10, 11])
  assert.deepEqual(solution02(list), [19, 23, 23, 29, 26])
})

read('input.txt').then((list) => {
  assert.deepEqual(solution01(list), [1702])
  assert.deepEqual(solution02(list), [3559])
})
