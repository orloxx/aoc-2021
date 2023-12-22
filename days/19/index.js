import assert from 'assert'
import read from '../../utils/read.js'
import Graph from '../../utils/path-finding.js'

const OP = {
  '>': (a, b) => a > b,
  '<': (a, b) => a < b,
}

function parseInput(list) {
  const { flow, parts } = list.reduce(
    (acc, line) => {
      if (line === '') return { ...acc, parts: [] }
      if (!acc.parts) return { flow: [...acc.flow, line] }

      return { ...acc, parts: [...acc.parts, line] }
    },
    { flow: [] }
  )

  return {
    flow: flow.reduce((acc, line) => {
      const [label, rest] = line.split('{')
      const operations = rest
        .replace('}', '')
        .split(',')
        .map((op) => {
          if (op.includes(':')) {
            const [operation, then] = op.split(':')
            const [paramName, compareTo] = operation.match(/\w+/g)
            const [operator] = operation.match(/[<>]/g)

            return {
              paramName,
              operator,
              compareTo: parseInt(compareTo, 10),
              then,
            }
          }
          return { then: op }
        })

      return { ...acc, [label]: operations }
    }, {}),
    parts: parts.map((line) => {
      const [x, m, a, s] = line
        .replace('{', '')
        .replace('}', '')
        .split(',')
        .map((partValue) => {
          const [value] = partValue.match(/\d+/g)
          return parseInt(value, 10)
        })

      return { x, m, a, s }
    }),
  }
}

function workflow({ flow, part, start = 'in' }) {
  let current = start

  while (current !== 'A' && current !== 'R') {
    const operations = flow[current]

    for (let i = 0; i < operations.length; i++) {
      const { paramName, operator, compareTo, then } = operations[i]

      if (!operator || (operator && OP[operator](part[paramName], compareTo))) {
        current = then
        break
      }
    }
  }

  return current
}

function solution01(list) {
  const { flow, parts } = parseInput(list)

  return parts.reduce((acc, part) => {
    const status = workflow({ flow, part })
    return status === 'A' ? acc + Object.values(part).sumAll() : acc
  }, 0)
}

function solution02(list) {
  const { flow } = parseInput(list)
  const graph = Object.keys(flow).reduce(
    (acc, key) => {
      const operations = flow[key]

      return { ...acc, [key]: operations.map((op) => op.then) }
    },
    { A: [], R: [] }
  )
  const G = new Graph(graph)
  G.traverse('in', 'A')

  const conditions = G.allPaths.map((path) => {
    return path.reduce(
      (acc, node, i) => {
        if (i === path.length - 1) return acc

        const then = path[i + 1]
        const { paramName, operator, compareTo } = flow[node].find(
          (op) => op.then === then
        )
        if (operator && operator === '>')
          return { ...acc, [paramName]: [compareTo, acc[paramName][1]] }
        if (operator && operator === '<')
          return { ...acc, [paramName]: [acc[paramName][0], compareTo] }

        return acc
      },
      { x: [1, 4001], m: [1, 4001], a: [1, 4001], s: [1, 4001] }
    )
  })

  const probabilities = conditions
    .map((condition) => {
      const { x, m, a, s } = condition
      const value = [x[1] - x[0], m[1] - m[0], a[1] - a[0], s[1] - s[0]]

      return { ...condition, value: value.multiplyAll() }
    })
    .sort((a, b) => b.value - a.value)

  return 0
}

read('test.txt').then((list) => {
  assert.deepEqual(solution01(list), 19114)
  assert.deepEqual(solution02(list), 167409079868000)
})

read('input.txt').then((list) => {
  assert.deepEqual(solution01(list), 434147)
  // assert.deepEqual(solution02(list), 52885384955882)
})
