import assert from 'assert'
import read from '../../utils/read.js'

const NUM = [
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
]

const DIG = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ...NUM]

function solution01(list) {
  return list.reduce((acc, curr) => {
    const digits = curr.replace(/[^0-9]/g, '')

    return acc + Number(digits[0] + digits[digits.length - 1])
  }, 0)
}

function getNumber(n) {
  if (NUM.includes(n)) return NUM.indexOf(n)

  return Number(n)
}

function solution02(list) {
  return list.reduce((acc, curr) => {
    const digits = DIG.map((n) => ({ n, i: curr.getAllIndex(n) }))
      .filter(({ i }) => i.length > 0)
      .reduce((result, { n, i }) => {
        return [...result, ...i.map((idx) => ({ n, i: idx }))]
      }, [])
      .sort((a, b) => a.i - b.i)
      .map(({ n }) => getNumber(n))

    const final = Number(`${digits[0]}${digits[digits.length - 1]}`)

    return acc + final
  }, 0)
}

read('test.txt').then((list) => {
  assert.deepEqual(solution01(list), 142)
})

read('test2.txt').then((list) => {
  assert.deepEqual(solution02(list), 281)
})

read('input.txt').then((list) => {
  assert.deepEqual(solution01(list), 57346)
  assert.deepEqual(solution02(list), 57345)
})
