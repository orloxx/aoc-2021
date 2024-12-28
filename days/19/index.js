import assert from 'assert'
import read from '../../utils/read.js'

function parseInput(list) {
  const patternsList = list[0].split(', ')
  const towels = list.slice(2)

  return { patternsList, towels }
}

function countPossible({ patternsList, towel, memo = {} }) {
  if (towel.length === 0) return 1

  if (memo[towel]) return memo[towel]

  const [firstLetter] = towel

  const possiblePatterns = patternsList.filter(
    (pattern) => pattern[0] === firstLetter
  )

  const count = possiblePatterns.reduce((acc, pattern) => {
    if (towel.startsWith(pattern)) {
      const remainingTowel = towel.slice(pattern.length)

      return acc + countPossible({ patternsList, towel: remainingTowel, memo })
    }

    return acc
  }, 0)

  // eslint-disable-next-line no-param-reassign
  memo[towel] = count

  return count
}

function solution01(list) {
  const { patternsList, towels } = parseInput(list)

  return towels.reduce((acc, towel) => {
    return acc + (countPossible({ patternsList, towel }) > 0 ? 1 : 0)
  }, 0)
}

function solution02(list) {
  const { patternsList, towels } = parseInput(list)

  return towels.reduce((acc, towel) => {
    return acc + countPossible({ patternsList, towel })
  }, 0)
}

read('test.txt').then((list) => {
  assert.deepEqual(solution01(list), 6)
  assert.deepEqual(solution02(list), 16)
})

read('input.txt').then((list) => {
  assert.deepEqual(solution01(list), 374)
  assert.deepEqual(solution02(list), 1100663950563322)
})
