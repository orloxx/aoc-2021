import assert from 'assert'
import read from '../../utils/read.js'

const DIR = {
  U: [-1, 0],
  L: [0, -1],
  D: [1, 0],
  R: [0, 1],
}

const HEX_DIR = ['R', 'D', 'L', 'U']

function getPolygonPoints(list) {
  let lastPoint = [0, 0]

  return list.map((line) => {
    const [dir, steps] = line.split(' ')
    const [y, x] = lastPoint
    const [dy, dx] = DIR[dir]
    const [ny, nx] = [y + dy * steps, x + dx * steps]

    lastPoint = [ny, nx]

    return [ny, nx]
  })
}

function getPolygonArea(points) {
  const shoeLace2 = points.reduce((acc, [y, x], i) => {
    const [ny, nx] = points[i + 1] || points[0]
    // Apply shoelace formula
    return acc + (ny * x - y * nx)
  }, 0)

  return Math.abs(shoeLace2 / 2)
}

function getPolygonPerimeter(points) {
  const perimeter = points.reduce((acc, [y, x], i) => {
    const [ny, nx] = points[i + 1] || points[0]
    // Apply shoelace formula
    return acc + Math.sqrt((ny - y) ** 2 + (nx - x) ** 2)
  }, 0)

  return (perimeter + 2) / 2
}

function solution01(list) {
  const polygonPoints = getPolygonPoints(list)

  return getPolygonArea(polygonPoints) + getPolygonPerimeter(polygonPoints)
}

function solution02(list) {
  const newList = list.map((line) => {
    const [, , hex] = line.split(' ')
    const hexValue = hex.replace('(#', '').replace(')', '')
    const decimal = parseInt(hexValue.slice(0, 5), 16)
    const dir = HEX_DIR[hexValue.slice(5, 6)]

    return `${dir} ${decimal}`
  })
  const polygonPoints = getPolygonPoints(newList)

  return getPolygonArea(polygonPoints) + getPolygonPerimeter(polygonPoints)
}

read('test.txt').then((list) => {
  assert.deepEqual(solution01(list), 62)
  assert.deepEqual(solution02(list), 952408144115)
})

read('input.txt').then((list) => {
  assert.deepEqual(solution01(list), 49578)
  assert.deepEqual(solution02(list), 52885384955882)
})
