import assert from 'assert'
import read from '../../utils/read.js'

function parseLine(line) {
  return line.split(/ +/g).map(Number)
}

function calculateWins({ time, distance }) {
  const tes = [].nMatrix(time).map((_, j) => {
    const currentTime = j + 1

    return (time - currentTime) * currentTime
  })

  return tes.filter((n) => n > distance).length
}

function solution01(list) {
  const [timeLine, distanceLine] = list
  const time = parseLine(timeLine.replace(/Time: +/g, ''))
  const distance = parseLine(distanceLine.replace(/Distance: +/g, ''))

  return time
    .map((t, i) => calculateWins({ time: t, distance: distance[i] }))
    .multiplyAll()
}

function parseLine02(line) {
  return Number(line.replace(/ +/g, ''))
}

function solution02(list) {
  const [timeLine, distanceLine] = list
  const time = parseLine02(timeLine.replace(/Time: +/g, ''))
  const distance = parseLine02(distanceLine.replace(/Distance: +/g, ''))

  return calculateWins({ time, distance })
}

read('test.txt').then((list) => {
  assert.deepEqual(solution01(list), 4 * 8 * 9)
  assert.deepEqual(solution02(list), 71503)
})

read('input.txt').then((list) => {
  assert.deepEqual(solution01(list), 128700)
  assert.deepEqual(solution02(list), 39594072)
})
