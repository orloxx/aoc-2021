import assert from 'assert'

function bfs({ tree, start, end }) {
  const queue = [[start]]
  const visited = new Set([start])

  if (start === end) return [start]

  while (queue.length > 0) {
    const path = queue.shift()
    const node = path[path.length - 1]

    for (let i = 0; i < tree[node].length; i++) {
      const neighbor = tree[node][i]

      if (!visited.has(neighbor)) {
        if (neighbor === end) return path.concat([neighbor])
        visited.add(neighbor)
        queue.push(path.concat([neighbor]))
      }
    }
  }

  return []
}

export default bfs

const tree = {
  start: ['a', 'c'],
  a: ['b', 'end'],
  b: ['end'],
  c: ['e'],
  d: ['end'],
  e: ['d', 'end'],
  end: [],
}

assert.deepEqual(
  bfs({
    tree,
    start: 'start',
    end: 'end',
  }),
  ['start', 'a', 'end']
)
