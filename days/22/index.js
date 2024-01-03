import assert from 'assert'
import read from '../../utils/read.js'

function getMovingIndex(start, end) {
  for (let i = 0; i < start.length; i++) {
    if (start[i] !== end[i]) {
      return i
    }
  }
  return -1
}

function parseInput(list) {
  return list.reduce((acc, line) => {
    const [start, end] = line.split('~').map((n) => n.split(',').toNumber())
    const idx = getMovingIndex(start, end)

    if (idx === -1) {
      return [...acc, [start]]
    }

    const delta = end[idx] - start[idx]
    const blocks = [].nMatrix(delta + 1).map(() => [...start])

    for (let i = 0; i < blocks.length; i++) {
      blocks[i][idx] += i
    }

    return [...acc, blocks]
  }, [])
}

function sortBlocks(a, b) {
  const [, , az] = a[0]
  const [, , bz] = b[0]

  return az - bz
}

/**
 * Converts a flattened key to a xyz 2D matrix key
 *
 * from '1,2,3,4,5,6' to [[1,2,3],[4,5,6]]
 */
function parseFlattenedKey(key) {
  return key
    .split(',')
    .toNumber()
    .reduce((acc, n) => {
      if (acc.length === 0) return [[n]]

      const last = acc[acc.length - 1]

      if (last.length === 3) return [...acc, [n]]

      return [...acc.slice(0, -1), [...last, n]]
    }, [])
}

function calculateZIndex({ map, block, count = 1 }) {
  const [zMin, zMax] = [block[0][2], block[block.length - 1][2]]
  const delta = zMax - zMin

  if (map[block] && map[block].below.length) {
    return calculateZIndex({
      map,
      block: map[block].below[0],
      count: count + delta + 1,
    })
  }

  return count + delta
}

function getXYZMap(blocks) {
  return blocks.reduce((map, block) => {
    const positioned = Object.keys(map).map(parseFlattenedKey)
    let maxZIndex = 1
    const below = positioned
      .filter((underBlock) => {
        return underBlock.some(([ux, uy]) => {
          return block.some(([bx, by]) => {
            return ux === bx && uy === by
          })
        })
      })
      .sort((a, b) => map[b].zIndex - map[a].zIndex)
      .filter((underBlock) => {
        maxZIndex = Math.max(maxZIndex, map[underBlock].zIndex)

        return map[underBlock].zIndex === maxZIndex
      })
    const flatBlock = block.flat2DMatrix().join()
    const updateAbove = below.reduce((acc, underBlock) => {
      return {
        ...acc,
        [underBlock]: {
          ...acc[underBlock],
          above: [...acc[underBlock].above, flatBlock],
        },
      }
    }, map)
    const localMap = { ...updateAbove, [flatBlock]: { below, above: [] } }

    localMap[block].zIndex = calculateZIndex({ map: localMap, block })

    return localMap
  }, {})
}

function solution01(list) {
  const blocks = parseInput(list).sort(sortBlocks)
  const xyzMap = getXYZMap(blocks)

  return Object.values(xyzMap).reduce((acc, { above }) => {
    if (!above.length) return acc + 1

    const willFall = above.some((aboveBlock) => {
      return xyzMap[aboveBlock].below.length < 2
    })

    return willFall ? acc : acc + 1
  }, 0)
}

function countBlocksAbove({ map, above, set = new Set() }) {
  if (!above.length) return set

  above.forEach((aboveBlock) => {
    const { above: aboveAbove } = map[aboveBlock]

    set.add(aboveBlock)
    countBlocksAbove({ map, above: aboveAbove, set })
  })

  return set
}

function solution02(list) {
  const blocks = parseInput(list).sort(sortBlocks)
  const xyzMap = getXYZMap(blocks)

  return Object.values(xyzMap).reduce((acc, { above }) => {
    if (!above.length) return acc

    const willFall = above.some((aboveBlock) => {
      return xyzMap[aboveBlock].below.length < 2
    })

    if (willFall) {
      const blocksAbove = countBlocksAbove({ map: xyzMap, above })

      return acc + blocksAbove.size
    }

    return acc
  }, 0)
}

read('test.txt').then((list) => {
  // assert.deepEqual(solution01(list), 5)
  assert.deepEqual(solution02(list), 7)
})

read('input.txt').then((list) => {
  // assert.deepEqual(solution01(list), 515)
  assert.deepEqual(solution02(list), 114230)
})
