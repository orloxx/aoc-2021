import assert from 'assert'
import read from '../../utils/read.js'

const ROBOT = '█'

function* robotMovement({ position, velocity, dimensions }) {
  let [x, y] = position
  const [vx, vy] = velocity
  const [width, height] = dimensions

  while (true) {
    x += vx
    y += vy

    if (x < 0) x = width + (x % width)
    if (y < 0) y = height + (y % height)

    yield [x % width, y % height]
  }
}

function parseInput(list, dimensions) {
  return list.map((line) => {
    const [positionStr, velocityStr] = line.split(' ')
    const position = positionStr
      .split(',')
      .map((n) => Number(n.replace('p=', '')))
    const velocity = velocityStr
      .split(',')
      .map((n) => Number(n.replace('v=', '')))

    return robotMovement({ position, velocity, dimensions })
  })
}

function getGrid({ dimensions, robotsPositions = [] }) {
  const [width, height] = dimensions
  const grid = [].nm2DMatrix(height, width, ' ')

  if (robotsPositions.length) {
    robotsPositions.forEach(([x, y]) => {
      grid[y][x] = ROBOT
    })
  }

  return grid
}

function countCuadrants({ robotsPositions, dimensions }) {
  return robotsPositions
    .reduce(
      (acc, [x, y]) => {
        const [width, height] = dimensions

        if (x < Math.floor(width / 2) && y < Math.floor(height / 2))
          acc[0].push([x, y])
        if (x > Math.floor(width / 2) && y < Math.floor(height / 2))
          acc[1].push([x, y])
        if (x < Math.floor(width / 2) && y > Math.floor(height / 2))
          acc[2].push([x, y])
        if (x > Math.floor(width / 2) && y > Math.floor(height / 2))
          acc[3].push([x, y])

        return acc
      },
      // top left, top right, bottom left, bottom right
      [[], [], [], []]
    )
    .reduce((acc, robots) => {
      return acc * robots.length
    }, 1)
}

function solution01(list, dimensions) {
  const robotsPositions = parseInput(list, dimensions).map((robotMove) => {
    ;[].nMatrix(99).forEach(() => robotMove.next())

    return robotMove.next().value
  })

  return countCuadrants({ robotsPositions, dimensions })
}

function hasPattern({ robotsPositions, dimensions }) {
  const grid = getGrid({ dimensions, robotsPositions })

  return grid.some((row, y) =>
    row.some((cell, x) => {
      return (
        cell === ROBOT &&
        grid[y + 1]?.[x] === ROBOT &&
        grid[y + 2]?.[x] === ROBOT &&
        grid[y + 3]?.[x] === ROBOT &&
        grid[y + 1]?.[x + 1] === ROBOT &&
        grid[y + 2]?.[x + 2] === ROBOT &&
        grid[y + 3]?.[x + 3] === ROBOT &&
        grid[y + 4]?.[x + 4] === ROBOT
      )
    })
  )
}

function solution02(list, dimensions) {
  const robotsMovement = parseInput(list, dimensions)
  let robotsPositions = []
  let count = 0

  while (!hasPattern({ robotsPositions, dimensions })) {
    robotsPositions = robotsMovement.map((robotMove) => {
      return robotMove.next().value
    })
    count++
  }

  return count
}

read('test.txt').then((list) => {
  assert.deepEqual(solution01(list, [11, 7]), 12)
})

read('input.txt').then((list) => {
  assert.deepEqual(solution01(list, [101, 103]), 224357412)
  assert.deepEqual(solution02(list, [101, 103]), 7083)
})
