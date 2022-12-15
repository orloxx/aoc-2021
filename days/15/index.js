import assert from 'assert'
import read from '../../utils/read.js'

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

function solution01(list, baseline) {
  const map = parseMap(list)
  const beacons = map
    .filter(({ beacon }) => beacon[1] === baseline)
    .map(({ beacon }) => beacon[0])
  const cuts = map
    .map((sensorSet) =>
      getDiamonds({ ...sensorSet, baseline })
        .map((pair) => pair[0])
        .sortIntegers()
    )
    .filter((cut) => cut.length)

  return cuts.reduce((set, [min, max]) => {
    const addItem = (i) => beacons.indexOf(i) < 0 && set.add(i)
    if (!max) addItem(min)
    else {
      for (let i = min; i <= max; i++) {
        addItem(i)
      }
    }
    return set
  }, new Set()).size
}

function solution02(list) {}

read('test.txt').then((list) => {
  assert.deepEqual(solution01(list, 10), 26)
  // assert.deepEqual(solution02(list), 56000011)
})

read('input.txt').then((list) => {
  assert.deepEqual(solution01(list, 2000000), 5166077)
  // assert.deepEqual(solution02(list), 24813)
})
