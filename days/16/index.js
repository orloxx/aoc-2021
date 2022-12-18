import assert from 'assert'
import read from '../../utils/read.js'
import bfs from '../../utils/bfs.js'

function parseInput(list) {
  return list.reduce(
    (acc, line) => {
      const [valveInfo, tunnelsInfo] = line.split(';')
      const [valve] = valveInfo.match(/[A-Z]{2}/g)
      const [pressure] = valveInfo.match(/-?\d*\.?\d+/g).toNumber()
      const tunnel = tunnelsInfo.match(/[A-Z]{2}/g)

      return {
        tree: { ...acc.tree, [valve]: tunnel },
        cost: { ...acc.cost, [valve]: pressure },
      }
    },
    { tree: {}, cost: {} }
  )
}

function openingValves({ distances, valve, minutes, active, opened = {} }) {
  const allValves = [opened]

  active.forEach((other, index) => {
    const newMinutes = minutes - distances[valve][other] - 1
    if (newMinutes < 1) return

    const newOpened = JSON.parse(JSON.stringify(opened))
    newOpened[other] = newMinutes

    const newActive = [...active]
    newActive.splice(index, 1)

    allValves.push(
      ...openingValves({
        distances,
        valve: other,
        minutes: newMinutes,
        active: newActive,
        opened: newOpened,
      })
    )
  })

  return allValves
}

function solution01(list) {
  const { tree, cost } = parseInput(list)
  const distances = Object.keys(tree).reduce((accStart, start) => {
    return Object.keys(tree).reduce((accEnd, end) => {
      return {
        ...accEnd,
        [start]: { ...accEnd[start], [end]: bfs(tree, start, end).length - 1 },
      }
    }, accStart)
  }, {})
  const active = Object.keys(tree).filter((valve) => cost[valve] > 0)

  return openingValves({ distances, valve: 'AA', minutes: 30, active })
    .map((path) => {
      return Object.entries(path).reduce((acc, [node, minutes]) => {
        return acc + cost[node] * minutes
      }, 0)
    })
    .sortIntegers()
    .pop()
}

function solution02(list) {}

read('test.txt').then((list) => {
  assert.deepEqual(solution01(list), 1651)
  // assert.deepEqual(solution02(list), 1707)
})

read('input.txt').then((list) => {
  assert.deepEqual(solution01(list), 1792)
  // assert.deepEqual(solution02(list), 2000)
})
