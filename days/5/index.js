import assert from 'assert'
import read from '../../utils/read.js'

function parseInput(list) {
  const breakIdx = list.indexOf('')
  const rules = list
    .slice(0, breakIdx)
    .map((line) => line.split('|').map(Number))
    .reduce((acc, [key, value]) => {
      acc[key] = [...(acc[key] || []), value]
      return acc
    }, {})
  const updates = list
    .slice(breakIdx + 1)
    .map((line) => line.split(',').map(Number))

  return { rules, updates }
}

function isCorrectUpdate({ update, rules }) {
  return update.every((value, i) => {
    if (i === 0) return true

    const rule = rules[value]
    const others = update.slice(0, i)

    return others.every((other) => {
      if (!rule) return true

      return !rule.includes(other)
    })
  })
}

function solution01(list) {
  const { rules, updates } = parseInput(list)

  return updates.reduce((acc, update) => {
    if (!isCorrectUpdate({ update, rules })) return acc

    const middle = update[Math.floor(update.length / 2)]

    return acc + middle
  }, 0)
}

function solution02(list) {
  const { rules, updates } = parseInput(list)

  return updates.reduce((acc, update) => {
    if (isCorrectUpdate({ update, rules })) return acc

    update.sort((a, b) => {
      const rule = rules[b]

      if (!rule) return 0

      return rule.includes(a) ? -1 : 1
    })

    const middle = update[Math.floor(update.length / 2)]

    return acc + middle
  }, 0)
}

read('test.txt').then((list) => {
  assert.deepEqual(solution01(list), 143)
  assert.deepEqual(solution02(list), 123)
})

read('input.txt').then((list) => {
  assert.deepEqual(solution01(list), 4569)
  assert.deepEqual(solution02(list), 6456)
})
