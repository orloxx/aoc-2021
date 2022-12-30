import assert from 'assert'
import read from '../../utils/read.js'

const N = [
  [-1, 0],
  [-1, -1],
  [-1, 1],
]
const S = [
  [1, 0],
  [1, -1],
  [1, 1],
]
const W = [
  [0, -1],
  [-1, -1],
  [1, -1],
]
const E = [
  [0, 1],
  [-1, 1],
  [1, 1],
]

function getElves(list) {
  return list
    .map((line, y) =>
      line.split('').map((p, x) => {
        if (p === '.') return undefined
        return { pos: [y, x] }
      })
    )
    .flat()
    .filter((e) => e)
}

function isEveryEmpty(elves, dir, [y, x]) {
  return dir.every(([j, i]) => {
    return !elves.some((elf) => {
      return elf.pos[0] === y + j && elf.pos[1] === x + i
    })
  })
}

function getIntent(elves, pos, order) {
  const intents = order.reduce((acc, dir) => {
    // if every spot is empty, add it to the intents array
    if (isEveryEmpty(elves, dir, pos)) {
      return [...acc, dir]
    }
    return acc
  }, [])

  // 4 intents means all are empty, elf doesn't move
  return !intents.length || intents.length === 4 ? false : intents[0]
}

function moveElves(elves, order) {
  const intentMap = elves.reduce((acc, elf) => {
    const [y, x] = elf.pos
    const intent = getIntent(elves, elf.pos, order)

    if (intent) {
      const [[j, i]] = intent
      const cord = [y + j, x + i]

      if (acc[cord]) return { ...acc, [cord]: [...acc[cord], elf] }
      return { ...acc, [cord]: [elf] }
    }
    return acc
  }, {})

  Object.keys(intentMap).forEach((intent) => {
    if (intentMap[intent].length === 1) {
      const [j, i] = intent.split(',').toNumber()
      const [elf] = intentMap[intent]
      elf.pos = [j, i]
    }
  })

  order.push(order.shift())

  return intentMap
}

function getEmptyArea(elves) {
  const { minY, minX, maxY, maxX } = elves.reduce(
    (acc, elf) => {
      const [y, x] = elf.pos
      return {
        minY: Math.min(acc.minY, y),
        minX: Math.min(acc.minX, x),
        maxY: Math.max(acc.maxY, y),
        maxX: Math.max(acc.maxX, x),
      }
    },
    { minY: Infinity, minX: Infinity, maxY: -Infinity, maxX: -Infinity }
  )

  return (maxY - minY + 1) * (maxX - minX + 1) - elves.length
}

function solution01(list) {
  const elves = getElves(list)
  const order = [N, S, W, E]

  for (let count = 0; count < 10; count++) {
    moveElves(elves, order)
  }

  return getEmptyArea(elves)
}

function solution02(list) {
  const elves = getElves(list)
  const order = [N, S, W, E]
  let intentMap = moveElves(elves, order)
  let count = 1

  while (Object.keys(intentMap).length) {
    intentMap = moveElves(elves, order)
    count++
  }

  return count
}

read('test.txt').then((list) => {
  assert.deepEqual(solution01(list), 110)
  assert.deepEqual(solution02(list), 20)
})

read('input.txt').then((list) => {
  assert.deepEqual(solution01(list), 3815)
  // super mega slow ~4 minutes
  assert.deepEqual(solution02(list), 893)
})
