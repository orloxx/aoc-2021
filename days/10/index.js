import assert from 'assert'
import read from '../../utils/read.js'
import Graph from '../../utils/path-finding.js'

function parseInput(list) {
  const matrix = list.map((line) => line.split('').map(Number))

  return matrix.reduce(
    (acc, heights, y) => {
      heights.forEach((height, x) => {
        if (height === 0) acc.trailHeads.push(`${y},${x}`)
        if (height === 9) acc.trailEnds.push(`${y},${x}`)

        const neighbors = [
          { pos: [y - 1, x], height: matrix[y - 1]?.[x] },
          { pos: [y + 1, x], height: matrix[y + 1]?.[x] },
          { pos: [y, x - 1], height: matrix[y][x - 1] },
          { pos: [y, x + 1], height: matrix[y][x + 1] },
        ].filter((n) => n.height === height + 1)

        acc.trailMap[`${y},${x}`] = neighbors.map((n) => {
          const [ny, nx] = n.pos
          return `${ny},${nx}`
        })
      })

      return acc
    },
    { trailHeads: [], trailEnds: [], trailMap: {} }
  )
}

function solution(list, condition) {
  const { trailHeads, trailEnds, trailMap } = parseInput(list)

  const graph = new Graph(trailMap)

  return trailHeads.reduce((acc, head) => {
    const trails = trailEnds
      .map((end) => {
        graph.traverse(head, end)

        const rating = graph.allPaths.length

        graph.reset()

        return rating
      })
      .filter((rating) => rating > 0)

    return acc + condition(trails)
  }, 0)
}

function solution01(list) {
  return solution(list, (trails) => trails.length)
}

function solution02(list) {
  return solution(list, (trails) => trails.sumAll())
}

read('test.txt').then((list) => {
  assert.deepEqual(solution01(list), 36)
  assert.deepEqual(solution02(list), 81)
})

read('input.txt').then((list) => {
  assert.deepEqual(solution01(list), 674)
  assert.deepEqual(solution02(list), 1372)
})
