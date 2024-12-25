import assert from 'assert'

function findLowestCostNode(costs, processed) {
  return Object.keys(costs).reduce((lowest, node) => {
    if (
      (lowest === null || costs[node] < costs[lowest]) &&
      !processed.includes(node)
    ) {
      return node
    }
    return lowest
  }, null)
}

function dijkstra(graph, start, end) {
  if (start === end) return { distance: 0, path: [] }

  const costs = { [end]: Infinity, ...graph[start] }
  const parents = { [end]: null }
  const processed = []

  let node = findLowestCostNode(costs, processed)

  while (node) {
    const cost = costs[node]
    const children = graph[node]

    Object.keys(children).forEach((n) => {
      const newCost = cost + children[n]

      if (!costs[n] || costs[n] > newCost) {
        costs[n] = newCost
        parents[n] = node
      }
    })

    processed.push(node)
    node = findLowestCostNode(costs, processed)
  }

  const optimalPath = [end]
  let parent = parents[end]
  while (parent) {
    optimalPath.push(parent)
    parent = parents[parent]
  }
  optimalPath.reverse()

  return { distance: costs[end], path: optimalPath }
}

export default dijkstra

const tree01 = {
  // A to B weights 1, and A to C weights 4
  A: { B: 1, C: 4 },
  B: { A: 1, C: 2, D: 5 },
  C: { A: 4, B: 2, D: 1 },
  D: { B: 5, C: 1 },
}

assert.deepEqual(dijkstra(tree01, 'A', 'C'), { distance: 3, path: ['B', 'C'] })
