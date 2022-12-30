import assert from 'assert'
import read from '../../utils/read.js'

const SNAFU_MAP = {
  '-2': '=',
  '-1': '-',
  0: 0,
  1: 1,
  2: 2,
}

function parseSnafuDigit(d) {
  if (d === '=') return -2
  if (d === '-') return -1
  return parseInt(d, 10)
}

function snafuToDecimal(snafu) {
  return snafu
    .split('')
    .reverse()
    .map((d, i) => {
      return 5 ** i * parseSnafuDigit(d)
    })
    .sumAll()
}

function decimalToSnafu(d) {
  let nums = d.toString(5).split('').toNumber()
  let idx = nums.findIndex((num) => num > 2)
  while (idx !== -1) {
    nums[idx] -= 5
    if (idx > 0) {
      nums[idx - 1]++
    } else {
      nums = [1, ...nums]
    }
    idx = nums.findIndex((num) => num > 2)
  }
  return nums.map((num) => SNAFU_MAP[num]).join('')
}

function solution01(list) {
  const decimalSum = list.reduce((acc, snafu) => {
    return acc + snafuToDecimal(snafu)
  }, 0)

  return decimalToSnafu(decimalSum)
}

read('test.txt').then((list) => {
  assert.deepEqual(solution01(list), '2=-1=0')
})

read('input.txt').then((list) => {
  assert.deepEqual(solution01(list), '2---0-1-2=0=22=2-011')
})
