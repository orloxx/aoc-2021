import assert from 'assert'
import read from '../../utils/read.js'

function getSumOfMul(line) {
  const mulRegex = /mul\(\d+,\d+\)/g
  return line.match(mulRegex).reduce((acc, mul) => {
    const [a, b] = mul.match(/\d+/g).map(Number)

    return acc + a * b
  }, 0)
}

function solution01(list) {
  return getSumOfMul(list.join(''))
}

function solution02(list) {
  const cleanLine = list
    .join('')
    // Removes everything between don't()---do()
    .replace(/(don't\(\)).+?(do\(\))/g, '')
    // Removes the last don't()---
    .replace(/(don't\(\)).+/g, '')

  return getSumOfMul(cleanLine)
}

read('test.txt').then((list) => {
  assert.deepEqual(solution01(list), 161)
  assert.deepEqual(solution02(list), 48)
})

read('input.txt').then((list) => {
  assert.deepEqual(solution01(list), 184576302)
  assert.deepEqual(solution02(list), 118173507)
})
