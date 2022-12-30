import assert from 'assert'
import read from '../../utils/read.js'

function getAllMinMax(line) {
  const [one, two] = line.split(',')
  const [oneMin, oneMax] = one.split('-').toNumber()
  const [twoMin, twoMax] = two.split('-').toNumber()

  return [oneMin, oneMax, twoMin, twoMax]
}

function solution01(list) {
  return list.reduce((acc, curr) => {
    const [oneMin, oneMax, twoMin, twoMax] = getAllMinMax(curr)

    if (oneMin <= twoMin && oneMax >= twoMax) return acc + 1
    if (twoMin <= oneMin && twoMax >= oneMax) return acc + 1
    return acc
  }, 0)
}

function solution02(list) {
  return list.reduce((acc, curr) => {
    const [oneMin, oneMax, twoMin, twoMax] = getAllMinMax(curr)

    if (oneMin <= twoMin && oneMax >= twoMax) return acc + 1
    if (twoMin <= oneMin && twoMax >= oneMax) return acc + 1
    if (oneMin >= twoMin && oneMin <= twoMax) return acc + 1
    if (oneMax >= twoMin && oneMax <= twoMax) return acc + 1
    return acc
  }, 0)
}

read('test.txt').then((list) => {
  assert.deepEqual(solution01(list), 2)
  assert.deepEqual(solution02(list), 4)
})

read('input.txt').then((list) => {
  assert.deepEqual(solution01(list), 599)
  assert.deepEqual(solution02(list), 928)
})
