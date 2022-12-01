import assert from 'assert'
import read from '../../utils/read.js'

const PRIO = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

function findCommon(a, b) {
  return a.split('').find((l) => b.split('').indexOf(l) >= 0)
}

function findCommon2([a, b, c]) {
  return a
    .split('')
    .find((l) => b.split('').indexOf(l) >= 0 && c.split('').indexOf(l) >= 0)
}

function solution01(list) {
  return list.reduce((acc, curr) => {
    const mid = curr.length / 2
    const common = findCommon(
      curr.substring(0, mid),
      curr.substring(mid, curr.length)
    )
    return acc + PRIO.indexOf(common) + 1
  }, 0)
}

function solution02(list) {
  return list
    .reduce((acc, curr) => {
      if (!acc.length) return [[curr]]
      const last = acc[acc.length - 1]

      if (last.length < 3) {
        last.push(curr)
        return acc
      }
      return [...acc, [curr]]
    }, [])
    .reduce((acc, curr) => {
      const common = findCommon2(curr)
      return acc + PRIO.indexOf(common) + 1
    }, 0)
}

read('test.txt').then((list) => {
  assert.deepEqual(solution01(list), 157)
  assert.deepEqual(solution02(list), 70)
})

read('input.txt').then((list) => {
  assert.deepEqual(solution01(list), 7568)
  assert.deepEqual(solution02(list), 2780)
})
