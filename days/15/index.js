import assert from 'assert'
import read from '../../utils/read.js'
import { compareArrays } from '../../utils/index.js'

function getDiamonds({ sensor, manhattan, baseline }) {
  const diamondCut = []
  const [x, y] = sensor
  for (let i = 0; i < manhattan; i++) {
    // bottom-right diagonal
    if (y + i === baseline) diamondCut.push([x + manhattan - i, y + i])
    // top-left diagonal
    if (y - i === baseline) diamondCut.push([x - manhattan + i, y - i])
    // bottom-left diagonal
    if (y + manhattan - i === baseline)
      diamondCut.push([x - i, y + manhattan - i])
    // top-right diagonal
    if (y - manhattan + i === baseline)
      diamondCut.push([x + i, y - manhattan + i])
  }
  return diamondCut
}

function parseMap(list) {
  return list.map((line) => {
    const [sensor, beacon] = line
      .split(':')
      .map((s) => s.match(/-?\d*\.?\d+/g).toNumber())
    const manhattan =
      Math.abs(beacon[0] - sensor[0]) + Math.abs(beacon[1] - sensor[1])

    return { sensor, beacon, manhattan }
  })
}

function getDiamondCuts({ map, baseline }) {
  return map
    .map((sensorSet) =>
      getDiamonds({ ...sensorSet, baseline })
        .map((pair) => pair[0])
        .sortIntegers()
    )
    .filter((cut) => cut.length)
}

function solution01(list, baseline) {
  const map = parseMap(list)
  const cuts = getDiamondCuts({ map, baseline })
  const size = cuts
    .sort((a, b) => compareArrays(b, a))
    .reduce((acc, [min, max]) => {
      const realMax = max || min
      if (!acc.length) {
        return [[min || Infinity, realMax]]
      }
      const [Min, Max] = acc.pop()

      if (Max < min - 1) return [...acc, [Min, Max], [min, realMax]]
      return [...acc, [Math.min(Min, min), Math.max(Max, realMax)]]
    }, [])
    .flat()

  return size[1] - size[0]
}

function solution02(list) {
  const map = parseMap(list)
  console.log(map)
}

read('test.txt').then((list) => {
  assert.deepEqual(solution01(list, 10), 26)
  // assert.deepEqual(solution02(list), 56000011)
})

read('input.txt').then((list) => {
  assert.deepEqual(solution01(list, 2000000), 5166077)
  // assert.deepEqual(solution02(list), 24813)
})
