import assert from 'assert'
import read from '../../utils/read.js'

function hasSymbolAdjacent({ list, part, y }) {
  for (let j = y - 1; j <= y + 1; j++) {
    for (let i = part.x - 1; i <= part.x + part.n.length; i++) {
      const current = list[j] && list[j][i]

      if (current?.match(/[^.0-9]/g)) {
        return true
      }
    }
  }

  return false
}

function isFakeIdx({ n, line, idx }) {
  return line[idx - 1]?.match(/\d+/g) || line[idx + n.length]?.match(/\d+/g)
}

function getParts({ line, numbers }) {
  return [...new Set(numbers)]
    .map((n) => ({
      x: line.getAllIndex(n).filter((idx) => !isFakeIdx({ n, line, idx })),
      n,
    }))
    .reduce(
      (allParts, part) => [
        ...allParts,
        ...part.x.map((x) => ({ n: part.n, x })),
      ],
      []
    )
}

function solution01(list) {
  return list.reduce((acc, line, y) => {
    const numbers = line.match(/\d+/g)

    if (!numbers) return acc

    const parts = getParts({ line, numbers })
      .filter((part) => hasSymbolAdjacent({ list, part, y }))
      .map(({ n }) => Number(n))

    return acc + parts.sumAll()
  }, 0)
}

function findGear({ list, part, y }) {
  for (let j = y - 1; j <= y + 1; j++) {
    for (let i = part.x - 1; i <= part.x + part.n.length; i++) {
      const current = list[j] && list[j][i]

      if (current === '*') {
        return `${j},${i}`
      }
    }
  }

  return ''
}

function solution02(list) {
  const gearMap = list
    .map((line, y) => {
      const numbers = line.match(/\d+/g)

      if (!numbers) return null

      const parts = getParts({ line, numbers })
        .map((part) => ({
          ...part,
          gear: findGear({ list, part, y }),
        }))
        .filter(({ gear }) => gear.length)

      return parts.length ? parts : null
    })
    .filter((o) => o)
    .flat2DMatrix()
    .reduce((acc, { n, gear }) => {
      if (!acc[gear]) return { ...acc, [gear]: [Number(n)] }
      return { ...acc, [gear]: [...acc[gear], Number(n)] }
    }, {})

  return Object.values(gearMap)
    .filter((engines) => engines.length > 1)
    .map(([e1, e2]) => e1 * e2)
    .sumAll()
}

read('test.txt').then((list) => {
  assert.deepEqual(solution01(list), 4361)
  assert.deepEqual(solution02(list), 467835)
})

read('input.txt').then((list) => {
  assert.deepEqual(solution01(list), 557705)
  assert.deepEqual(solution02(list), 84266818)
})
