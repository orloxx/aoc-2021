import assert from 'assert'
import read from '../../utils/read.js'

function parseTerrains(list) {
  return list.reduce((acc, line) => {
    if (!acc.length) return [[line.split('')]]
    if (!line) return [...acc, []]

    const last = acc[acc.length - 1]

    return [...acc.slice(0, -1), [...last, line.split('')]]
  }, [])
}

function getBounds({ flattened, i }) {
  if (i < Math.floor(flattened.length / 2)) {
    const len = Math.min(2 * (i + 1), flattened.length)

    return { start: 0, end: len - 1 }
  }

  const len = Math.min(2 * (flattened.length - i - 1), flattened.length)

  return { start: flattened.length - len, end: flattened.length - 1 }
}

function isPerfectReflection({ boundTerrain }) {
  for (let i = 0; i < Math.floor(boundTerrain.length / 2); i++) {
    const first = boundTerrain[i]
    const last = boundTerrain[boundTerrain.length - i - 1]

    if (first !== last) return false
  }

  return true
}

function findReflectionIdx(terrain, excludeIdx) {
  const flattened = terrain.map((row) => row.join(''))

  for (let i = 0; i < flattened.length - 1; i++) {
    const { start, end } = getBounds({ flattened, i })
    const boundTerrain = flattened.slice(start, end + 1)

    if (isPerfectReflection({ boundTerrain }) && i !== excludeIdx) {
      return i
    }
  }

  // didn't find a reflection
  return -1
}

function countPoints(mirrors) {
  return mirrors.reduce((acc, { vertical, horizontal }) => {
    if (vertical === -1 && horizontal === -1) return acc

    if (vertical === -1) return acc + (horizontal + 1) * 100

    return acc + vertical + 1
  }, 0)
}

function solution01(list) {
  const terrains = parseTerrains(list)

  const mirrors = terrains.map((terrain) => {
    const horizontal = findReflectionIdx(terrain)
    const vertical = findReflectionIdx(terrain.rotateClockwise())

    return { vertical, horizontal }
  })

  return countPoints(mirrors)
}

function findSmudge(terrain) {
  const originalHorizontal = findReflectionIdx(terrain)
  const originalVertical = findReflectionIdx(terrain.rotateClockwise())
  const terrainClone = terrain.map((row) => [...row])

  for (let i = 0; i < terrainClone.length; i++) {
    for (let j = 0; j < terrainClone[i].length; j++) {
      const slot = terrainClone[i][j]

      terrainClone[i][j] = slot === '#' ? '.' : '#' // smudge

      const horizontal = findReflectionIdx(terrainClone, originalHorizontal)
      const vertical = findReflectionIdx(
        terrainClone.rotateClockwise(),
        originalVertical
      )

      if (horizontal !== -1 || vertical !== -1) {
        return {
          vertical: vertical === originalVertical ? -1 : vertical,
          horizontal: horizontal === originalHorizontal ? -1 : horizontal,
        }
      }

      terrainClone[i][j] = slot
    }
  }

  // Should never trigger based on the problem premise
  // "All patterns have 1 smudge that generates a reflection"
  return { vertical: originalVertical, horizontal: originalHorizontal }
}

function solution02(list) {
  const terrains = parseTerrains(list)

  const mirrors = terrains.map((terrain) => {
    return findSmudge(terrain)
  })

  return countPoints(mirrors)
}

read('test.txt').then((list) => {
  assert.deepEqual(solution01(list), 405)
  assert.deepEqual(solution02(list), 400)
})

read('input.txt').then((list) => {
  assert.deepEqual(solution01(list), 32723)
  assert.deepEqual(solution02(list), 34536)
})
