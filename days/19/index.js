import assert from 'assert'
import read from '../../utils/read.js'
import Graph from '../../utils/path-finding.js'
import { calculateCombinations } from '../../utils/logic-set.js'

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

function getRangesFromOperation(prev, operation) {
  const { paramName, operator, compareTo } = operation

  if (operator && operator === '>')
    return { ...prev, [paramName]: [compareTo + 1, prev[paramName][1]] }
  if (operator && operator === '<')
    return { ...prev, [paramName]: [prev[paramName][0], compareTo - 1] }

  return false
}

function getOppositeRangesFromOperation(prev, operation) {
  const { paramName, operator, compareTo } = operation

  if (operator && operator === '>')
    return { ...prev, [paramName]: [prev[paramName][0], compareTo] }
  if (operator && operator === '<')
    return { ...prev, [paramName]: [compareTo, prev[paramName][1]] }

  return false
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
  const END = 'A'
  G.traverse('in', END)

  const allCombinations = G.allPaths
    .map((path) => {
      return path.reduce(
        (acc, node, i) => {
          if (i === path.length - 1) return acc

          const then = path[i + 1]
          const operationIdx = flow[node].findIndex(
            (op) => op.then === then && !op.visited
          )
          const flowOperation = flow[node].slice(0, operationIdx + 1)

          return flowOperation.reduce((prev, op, j) => {
            if (operationIdx === j) {
              if (then === END) flow[node][j].visited = true
              return getRangesFromOperation(prev, op) || prev
            }

            return getOppositeRangesFromOperation(prev, op) || prev
          }, acc)
        },
        { x: [1, 4000], m: [1, 4000], a: [1, 4000], s: [1, 4000] }
      )
    })
    .map(({ x, m, a, s }) => calculateCombinations([x, m, a, s]))

  return allCombinations.sumAll()
}

read('test.txt').then((list) => {
  assert.deepEqual(solution01(list), 19114)
  assert.deepEqual(solution02(list), 167409079868000)
})

read('input.txt').then((list) => {
  assert.deepEqual(solution01(list), 434147)
  assert.deepEqual(solution02(list), 136146366355609)
})
