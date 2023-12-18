import assert from 'assert'
import read from '../../utils/read.js'

function processLetter({ letter, start }) {
  return ((start + letter.charCodeAt(0)) * 17) % 256
}

function hashString(string) {
  return string
    .split('')
    .reduce((acc, letter) => processLetter({ letter, start: acc }), 0)
}

function solution01(list) {
  const [sequence] = list

  return sequence.split(',').reduce((sum, string) => {
    return sum + hashString(string)
  }, 0)
}

function solution02(list) {
  const [sequence] = list
  const instructions = sequence.split(',')
  const hashMap = instructions.reduce((map, instruction) => {
    if (instruction.includes('=')) {
      const [label, value] = instruction.split('=')
      const boxNumber = hashString(label)

      if (!map[boxNumber]) {
        return { ...map, [boxNumber]: { [label]: value } }
      }
      return { ...map, [boxNumber]: { ...map[boxNumber], [label]: value } }
    }

    const label = instruction.replace('-', '')
    const boxNumber = hashString(label)

    if (map[boxNumber] && map[boxNumber][label]) {
      // eslint-disable-next-line no-param-reassign
      delete map[boxNumber][label]
    }

    return map
  }, {})

  return Object.entries(hashMap).reduce((sum, [key, box]) => {
    const boxNumber = parseInt(key, 10)

    const boxSum = Object.values(box).reduce((prev, value, i) => {
      const focalLength = parseInt(value, 10)

      return prev + (boxNumber + 1) * (i + 1) * focalLength
    }, 0)

    return sum + boxSum
  }, 0)
}

read('test.txt').then((list) => {
  assert.deepEqual(solution01(list), 1320)
  assert.deepEqual(solution02(list), 145)
})

read('input.txt').then((list) => {
  assert.deepEqual(solution01(list), 498538)
  assert.deepEqual(solution02(list), 286278)
})
