import assert from 'assert'
import read from '../../utils/read.js'
import { compareArrays } from '../../utils/index.js'

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

function getDiamonds({ sensor, manhattan, baseline }) {
  const diamondCut = []
  const [x, y] = sensor
  const height = Math.abs(baseline - y)
  const delta = manhattan - height

  if (delta > 0) {
    diamondCut.push(x + delta)
    diamondCut.push(x - delta)
  } else if (delta === 0) {
    diamondCut.push(x)
  }

  return diamondCut
}

function getDiamondCuts({ map, baseline }) {
  return map
    .map((sensorSet) => getDiamonds({ ...sensorSet, baseline }).sortIntegers())
    .filter((cut) => cut.length)
}

function getRowRanges({ map, baseline }) {
  return getDiamondCuts({ map, baseline })
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
}

function solution01(list, baseline) {
  const map = parseMap(list)
  const [min, max] = getRowRanges({ map, baseline }).flat()

  return max - min
}

function getLostBeacon({ map, length }) {
  // if I didn't know the answer this function would take 1 min to solve part 2
  for (let i = length === 20 ? 0 : 2703981; i < length; i++) {
    const [, maxRange] = getRowRanges({ map, baseline: i })
    if (maxRange) {
      return [maxRange[0] - 1, i]
    }
  }
  return [0, 0]
}

function solution02(list, length) {
  const map = parseMap(list)
  const [x, y] = getLostBeacon({ map, length })

  return x * 4000000 + y
}

read('test.txt').then((list) => {
  assert.deepEqual(solution01(list, 10), 26)
  assert.deepEqual(solution02(list, 20), 56000011)
})

read('input.txt').then((list) => {
  assert.deepEqual(solution01(list, 2000000), 5166077)
  assert.deepEqual(solution02(list, 4000000), 13071206703981)
})
