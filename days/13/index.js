import assert from 'assert'
import read from '../../utils/read.js'

const nameMap = {
  'Button A': 'A',
  'Button B': 'B',
  Prize: 'prize',
}

const priceMap = { A: 3, B: 1 }

function parseInput(list, offset = 0) {
  return list.reduce(
    (acc, item) => {
      if (!item) {
        acc.push({})
        return acc
      }

      const [last] = acc.slice(-1)
      const [key, values] = item.split(': ')
      const applyOffset = nameMap[key] === 'prize' ? offset : 0
      const [x, y] = values
        .split(', ')
        .map(
          (v) => Number(v.replace(/(X\+)|(X=)|(Y\+)|(Y=)/g, '')) + applyOffset
        )

      acc[acc.length - 1] = {
        ...last,
        [nameMap[key]]: [y, x],
      }

      return acc
    },
    [{}]
  )
}

function solution(list, offset) {
  return parseInput(list, offset).reduce((acc, { A, B, prize }) => {
    const a = (prize[1] * B[0] - prize[0] * B[1]) / (A[1] * B[0] - B[1] * A[0])
    const b = (prize[0] - a * A[0]) / B[0]

    if (!Number.isInteger(a) || !Number.isInteger(b)) return acc

    return acc + priceMap.A * a + priceMap.B * b
  }, 0)
}

function solution01(list) {
  return solution(list)
}
function solution02(list) {
  return solution(list, 10000000000000)
}

read('test.txt').then((list) => {
  assert.deepEqual(solution01(list), 480)
  assert.deepEqual(solution02(list), 875318608908)
})

read('input.txt').then((list) => {
  assert.deepEqual(solution01(list), 29436)
  assert.deepEqual(solution02(list), 103729094227877)
})
