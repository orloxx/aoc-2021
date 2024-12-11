import assert from 'assert'
import read from '../../utils/read.js'

function rockSum(rock, count = 25, memoMap = {}) {
  let result = 0
  const memo = `${rock}:${count}`
  const rockStr = `${rock}`

  if (memoMap[memo]) return memoMap[memo]
  if (count === 0) return 1

  if (rock === 0) result = rockSum(1, count - 1, memoMap)
  else if (rockStr.length % 2 === 0) {
    const [rock1, rock2] = [
      rockStr.slice(0, rockStr.length / 2),
      rockStr.slice(rockStr.length / 2),
    ]
    result =
      rockSum(Number(rock1), count - 1, memoMap) +
      rockSum(Number(rock2), count - 1, memoMap)
  } else {
    result = rockSum(rock * 2024, count - 1, memoMap)
  }

  // eslint-disable-next-line no-param-reassign
  memoMap[memo] = result

  return result
}

function solution(list, blinks) {
  const [line] = list
  const rocks = line.split(' ').map(Number)

  return rocks.reduce((acc, rock) => acc + rockSum(rock, blinks), 0)
}

function solution01(list) {
  return solution(list, 25)
}

function solution02(list) {
  return solution(list, 75)
}

read('test.txt').then((list) => {
  assert.deepEqual(solution01(list), 55312)
  assert.deepEqual(solution02(list), 65601038650482)
})

read('input.txt').then((list) => {
  assert.deepEqual(solution01(list), 185894)
  assert.deepEqual(solution02(list), 221632504974231)
})
