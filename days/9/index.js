import assert from 'assert'
import read from '../../utils/read.js'

function* deltasGenerator(numbers) {
  let delta = [...numbers]

  while (delta.some((n) => n !== 0)) {
    delta = delta.reduce((acc, n, i) => {
      if (i === delta.length - 1) return acc

      return [...acc, delta[i + 1] - n]
    }, [])

    yield delta
  }

  yield false
}

function getAllDeltas(numbers) {
  const gen = deltasGenerator(numbers)
  const result = [numbers]
  let delta = gen.next().value

  while (delta) {
    result.push(delta)
    delta = gen.next().value
  }

  return result
}

function parseEnd(prev, curr, i) {
  if (i === 0) return prev

  return prev + curr[curr.length - 1]
}

function parseBeginning(prev, curr, i) {
  if (i === 0) return prev

  return -prev + curr[0]
}

function solution(list, callback) {
  return list.reduce((acc, line) => {
    const numbers = line.split(' ').toNumber()
    const allDeltas = getAllDeltas(numbers).reverse().reduce(callback, 0)

    return acc + allDeltas
  }, 0)
}

read('test.txt').then((list) => {
  assert.deepEqual(solution(list, parseEnd), 18 + 28 + 68)
  assert.deepEqual(solution(list, parseBeginning), 2)
})

read('input.txt').then((list) => {
  assert.deepEqual(solution(list, parseEnd), 1939607039)
  assert.deepEqual(solution(list, parseBeginning), 1041)
})
