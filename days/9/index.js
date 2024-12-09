import assert from 'assert'
import read from '../../utils/read.js'

function getDisk(list) {
  const [line] = list
  const blocks = line.split('').map(Number)

  return blocks.reduce((acc, block, i) => {
    if (i % 2 !== 0) {
      acc.push(...[].nMatrix(block, false))
    } else {
      acc.push(...[].nMatrix(block, i / 2))
    }

    return acc
  }, [])
}

function getDiskMap(list) {
  let lastBlock = -1
  let idx = 0
  return getDisk(list).reduce(
    (acc, block, i) => {
      if (block === false) acc.freeSpace[i] = block
      else acc.usedSpace[i] = block

      acc.diskMap[i] = block

      if (block !== lastBlock) {
        idx = i
        acc.groupedMap[idx] = [block]
      } else acc.groupedMap[idx].push(block)

      lastBlock = block

      return acc
    },
    { diskMap: {}, freeSpace: {}, usedSpace: {}, groupedMap: {} }
  )
}

function checksumDisk(disk) {
  return disk.reduce((acc, block, idx) => {
    if (block === false) return acc
    return acc + block * idx
  }, 0)
}

function solution01(list) {
  const { diskMap, freeSpace, usedSpace } = getDiskMap(list)
  const used = Object.keys(usedSpace)
  const free = Object.keys(freeSpace)

  // Fragment disk
  free.some((idx) => {
    const usedIdx = used.pop()

    if (Number(usedIdx) <= Number(idx)) return true

    diskMap[idx] = diskMap[usedIdx]
    diskMap[usedIdx] = false

    return false
  })

  return checksumDisk(Object.values(diskMap).filter((v) => v !== false))
}

function solution02(list) {
  const { groupedMap } = getDiskMap(list)
  const disk = Object.keys(groupedMap)
  const used = disk
    .filter((idx) => groupedMap[idx].some((v) => v !== false))
    .reverse()
  const free = disk.filter((idx) => groupedMap[idx].some((v) => v === false))

  // fragment
  used.forEach((idx) => {
    const blocks = groupedMap[idx]
    const fileSize = blocks.length
    const freeSpaceIdx = free.find(
      (freeIdx) =>
        groupedMap[freeIdx].filter((b) => b === false).length >= fileSize
    )

    // Do nothing
    if (!freeSpaceIdx) return

    if (Number(freeSpaceIdx) > Number(idx)) return

    groupedMap[freeSpaceIdx] = [
      ...groupedMap[freeSpaceIdx].filter((v) => v !== false),
      ...groupedMap[freeSpaceIdx]
        .filter((v) => v === false)
        .map((_, i) => blocks[i] || false),
    ]

    groupedMap[idx] = groupedMap[idx].map(() => false)
  })

  return checksumDisk(Object.values(groupedMap).flat())
}

read('test.txt').then((list) => {
  assert.deepEqual(solution01(list), 1928)
  assert.deepEqual(solution02(list), 2858)
})

read('input.txt').then((list) => {
  assert.deepEqual(solution01(list), 6242766523059)
  assert.deepEqual(solution02(list), 6272188244509)
})
