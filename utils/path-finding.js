import assert from 'assert'

export default class Graph {
  constructor(tree) {
    this.tree = tree || {}
    this.reset()
  }

  reset() {
    this.isVisited = {}
    this.pathList = []
    this.allPaths = []
  }

  addEdge(start, end) {
    if (!this.tree[start]) this.tree[start] = []
    this.tree[start].push(end)
  }

  /**
   * Traverse all paths from start to end.
   *
   * @param {string} node - Starting node.
   * @param {string | Function} end - Ending node or function that returns true when path should end.
   * @param {number} [count] - Number of nodes traversed.
   */
  traverse(node, end, count = 0) {
    // Store node in local path
    this.pathList.push(node)

    const shouldPathEnd = () =>
      (typeof end === 'string' && node === end) ||
      (typeof end === 'function' && end({ node, count }))

    // if match found no need to traverse more
    if (shouldPathEnd()) {
      // Add path to all paths
      this.allPaths.push(this.pathList.slice())
      return
    }

    // mark current node
    this.isVisited[node] = true

    // loop through all neighbours
    for (let i = 0; i < this.tree[node].length; i++) {
      const neighbor = this.tree[node][i]

      if (!this.isVisited[neighbor]) {
        // recursively traverse all paths
        this.traverse(neighbor, end, count + 1)

        // remove current node from local path
        this.pathList.splice(this.pathList.indexOf(neighbor), 1)
      }
    }

    // mark current node as unvisited
    this.isVisited[node] = false
  }
}

const tree = {
  start: ['a', 'c'],
  a: ['b', 'end'],
  b: ['end'],
  c: ['e'],
  d: ['end'],
  e: ['d', 'end'],
  end: [],
}

const graph = new Graph(tree)

graph.traverse('start', 'end')
assert.deepEqual(graph.allPaths, [
  ['start', 'a', 'b', 'end'],
  ['start', 'a', 'end'],
  ['start', 'c', 'e', 'd', 'end'],
  ['start', 'c', 'e', 'end'],
])

graph.reset()
graph.traverse('start', ({ count }) => count >= 3)
assert.deepEqual(graph.allPaths, [
  ['start', 'a', 'b', 'end'],
  ['start', 'c', 'e', 'd'],
  ['start', 'c', 'e', 'end'],
])
