import assert from 'assert'
import read from '../../utils/read.js'

function spreadRegion({ matrix, plot, area = [] }) {
  const [y, x] = plot

  if (area.some(([ay, ax]) => ay === y && ax === x)) return area

  area.push(plot)

  if (matrix[y - 1]?.[x] === matrix[y][x])
    spreadRegion({ matrix, plot: [y - 1, x], area })
  if (matrix[y + 1]?.[x] === matrix[y][x])
    spreadRegion({ matrix, plot: [y + 1, x], area })
  if (matrix[y][x - 1] === matrix[y][x])
    spreadRegion({ matrix, plot: [y, x - 1], area })
  if (matrix[y][x + 1] === matrix[y][x])
    spreadRegion({ matrix, plot: [y, x + 1], area })

  return area
}

function parseInput(list) {
  const matrix = list.map((line) => line.split(''))

  const plotMap = matrix.reduce((acc, row, y) => {
    row.forEach((region, x) => {
      if (!acc[region]) acc[region] = []
      if (
        acc[region].some((plotSet) =>
          plotSet.some(([py, px]) => py === y && px === x)
        )
      )
        return

      acc[region].push(spreadRegion({ matrix, plot: [y, x] }))
    })

    return acc
  }, {})

  return { matrix, plotMap }
}

function getFences({ matrix, plots }) {
  return plots.reduce((acc, [y, x]) => {
    const region = matrix[y][x]
    let fences = 4

    if (matrix[y - 1]?.[x] === region) fences--
    if (matrix[y + 1]?.[x] === region) fences--
    if (matrix[y][x - 1] === region) fences--
    if (matrix[y][x + 1] === region) fences--

    return acc + fences
  }, 0)
}

function solution(plotMap, fencesMap) {
  return Object.values(plotMap).reduce((acc, plotSet) => {
    const fences = plotSet.map(fencesMap)

    return acc + fences.sumAll()
  }, 0)
}

function solution01(list) {
  const { matrix, plotMap } = parseInput(list)

  return solution(
    plotMap,
    (plots) => getFences({ matrix, plots }) * plots.length
  )
}

function getSideFences({ increment1, increment2, matrixCheck }) {
  return increment1.reduce(
    (acc, i) => {
      const last = increment2.filter((j) => {
        return matrixCheck(i, j)
      })

      if (!acc.last.length) acc.count += last.length
      else acc.count += last.filter((n) => !acc.last.includes(n)).length
      acc.last = last

      return acc
    },
    { count: 0, last: [] }
  ).count
}

function getDiscountFences({ matrix, plots }) {
  const [[firstY, firstX]] = plots
  const region = matrix[firstY][firstX]
  const [minY, minX, maxY, maxX] = [
    Math.min(...plots.map(([y]) => y)),
    Math.min(...plots.map(([, x]) => x)),
    Math.max(...plots.map(([y]) => y)),
    Math.max(...plots.map(([, x]) => x)),
  ]
  const incrementX = [].nMatrix(maxX - minX + 1).map((_, idx) => idx + minX)
  const incrementY = [].nMatrix(maxY - minY + 1).map((_, idy) => idy + minY)

  const left = getSideFences({
    increment1: incrementY,
    increment2: incrementX,
    matrixCheck: (y, x) =>
      plots.some(([py, px]) => py === y && px === x) &&
      matrix[y][x - 1] !== region,
  })
  const right = getSideFences({
    increment1: incrementY,
    increment2: [...incrementX].reverse(),
    matrixCheck: (y, x) =>
      plots.some(([py, px]) => py === y && px === x) &&
      matrix[y][x + 1] !== region,
  })
  const up = getSideFences({
    increment1: incrementX,
    increment2: incrementY,
    matrixCheck: (x, y) =>
      plots.some(([py, px]) => py === y && px === x) &&
      matrix[y - 1]?.[x] !== region,
  })
  const down = getSideFences({
    increment1: incrementX,
    increment2: [...incrementY].reverse(),
    matrixCheck: (x, y) =>
      plots.some(([py, px]) => py === y && px === x) &&
      matrix[y + 1]?.[x] !== region,
  })

  return left + right + up + down
}

function solution02(list) {
  const { matrix, plotMap } = parseInput(list)

  return solution(
    plotMap,
    (plots) => getDiscountFences({ matrix, plots }) * plots.length
  )
}

read('test.txt').then((list) => {
  assert.deepEqual(solution01(list), 1930)
  assert.deepEqual(solution02(list), 1206)
})

read('input.txt').then((list) => {
  assert.deepEqual(solution01(list), 1467094)
  assert.deepEqual(solution02(list), 881182)
})
