import assert from 'assert'
import read from '../../utils/read.js'

function getMap(list) {
  const directions = list[0].split('')
  const map = list.slice(2).reduce((acc, line) => {
    const [name, coords] = line.split(' = ')
    const [left, right] = coords.replace(/[()]/g, '').split(', ')

    return { ...acc, [name]: { L: left, R: right } }
  }, {})
  const startPoints = Object.keys(map).filter(
    (key) => key[key.length - 1] === 'A'
  )

  return { map, directions, startPoints }
}

function* steps({ map, directions, start = 'AAA' }) {
  const cloneDirections = [...directions]
  let current = start

  while (true) {
    const direction = cloneDirections.shift()

    cloneDirections.push(direction)
    current = map[current][direction]

    yield current
  }
}

function solution01(list) {
  const { map, directions } = getMap(list)
  const gen = steps({ map, directions })
  let i = 1

  while (gen.next().value !== 'ZZZ') {
    i++
  }

  return i
}

function solution02(list) {
  const { map, directions, startPoints } = getMap(list)
  const generators = startPoints.map((start) =>
    steps({ map, directions, start })
  )

  return generators
    .map((gen) => {
      let i = 1
      let { value } = gen.next()
      while (value[value.length - 1] !== 'Z') {
        i++
        value = gen.next().value
      }
      return i
    })
    .lcm()
}

read('test01.txt').then((list) => {
  assert.deepEqual(solution01(list), 2)
})

read('test02.txt').then((list) => {
  assert.deepEqual(solution02(list), 6)
})

read('input.txt').then((list) => {
  assert.deepEqual(solution01(list), 16897)
  assert.deepEqual(solution02(list), 16563603485021)
})
