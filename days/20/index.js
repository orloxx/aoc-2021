import assert from 'assert'
import read from '../../utils/read.js'

function moveAround(list, key, cycles) {
  // wrap number in array to treat each one as unique
  const iterable = list.map((n) => n * key).map((d) => [d])
  const puzzle = [...iterable]

  for (let c = 0; c < cycles; c++) {
    iterable.forEach((item) => {
      // unwrap number from array
      const [n] = item
      const idx = puzzle.indexOf(item)

      puzzle.splice(idx, 1)
      puzzle.splice((idx + n) % puzzle.length, 0, item)
    })
  }

  return puzzle.flat()
}

function sumGrove(list, key = 1, cycles = 1) {
  const puzzle = moveAround(list.toNumber(), key, cycles)
  const zeroIdx = puzzle.findIndex((n) => n === 0)

  return [1000, 2000, 3000]
    .map((grove) => puzzle[(grove + zeroIdx) % puzzle.length])
    .sumAll()
}

function solution01(list) {
  return sumGrove(list)
}

function solution02(list) {
  return sumGrove(list, 811589153, 10)
}

read('test.txt').then((list) => {
  assert.deepEqual(solution01(list), 3)
  assert.deepEqual(solution02(list), 1623178306)
})

read('input.txt').then((list) => {
  assert.deepEqual(solution01(list), 8372)
  assert.deepEqual(solution02(list), 7865110481723)
})
