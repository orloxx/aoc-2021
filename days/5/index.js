import assert from 'assert'
import read from '../../utils/read.js'

function parseInput(list) {
  const [[seeds], ...sourceToDestMap] = list.reduce((acc, line) => {
    if (!acc.length) return [[line]]

    if (!line) return [...acc, []]

    const last = acc[acc.length - 1]
    return [...acc.slice(0, -1), [...last, line]]
  }, [])

  /**
   * sourceToDestMap is an array of 7 values:
   * [
   *   seedSoil,
   *   soilFertilizer,
   *   fertilizerWater,
   *   waterLight,
   *   lightTemperature,
   *   temperatureHumidity,
   *   humidityLocation
   * ]
   */
  return {
    seeds: seeds.replace('seeds: ', '').split(' ').toNumber(),
    // Each parsed map contains these three values: [destination, source, length]
    sourceToDestMap: sourceToDestMap.map((map) => {
      const numbers = map.slice(1).map((line) => line.split(' ').toNumber())

      // return the numbers sorted by source
      return numbers.sort((a, b) => a[1] - b[1])
    }),
  }
}

function getSmallSeedLocations({ seed, sourceToDestMap }) {
  const seedPath = [seed]

  sourceToDestMap.forEach((map) => {
    const lastPath = seedPath[seedPath.length - 1]
    const [, lastSource, lastLength] = map[map.length - 1]
    const [minSource, maxSource] = [map[0][1], lastSource + lastLength - 1]

    if (lastPath < minSource || lastPath > maxSource) {
      seedPath.push(lastPath)
      return
    }

    const sourceMap = map.find(([, s, l]) => lastPath >= s && lastPath < s + l)

    if (!sourceMap) {
      seedPath.push(lastPath)
      return
    }

    const [dest, src] = sourceMap
    const deltaSrc = lastPath - src

    seedPath.push(dest + deltaSrc)
  })

  return seedPath[seedPath.length - 1]
}

function findSeedLocations({ seeds, sourceToDestMap }) {
  return seeds
    .map((seed) => {
      return getSmallSeedLocations({ seed, sourceToDestMap })
    })
    .sortIntegers()[0]
}

function solution01(list) {
  return findSeedLocations(parseInput(list))
}

function solution02(list) {
  const { seeds, sourceToDestMap } = parseInput(list)
  let smallest = Infinity

  for (let i = 0; i < seeds.length; i++) {
    if (i % 2 === 0) {
      const [seed, times] = [seeds[i], seeds[i + 1]]

      for (let j = seed; j < seed + times; j++) {
        const small = getSmallSeedLocations({ seed: j, sourceToDestMap })

        smallest = Math.min(small, smallest)
      }
    }
  }

  return smallest
}

read('test.txt').then((list) => {
  assert.deepEqual(solution01(list), 35)
  assert.deepEqual(solution02(list), 46)
})

read('input.txt').then((list) => {
  assert.deepEqual(solution01(list), 313045984)
  assert.deepEqual(solution02(list), 20283860)
})
