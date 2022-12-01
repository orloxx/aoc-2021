import assert from 'assert'
import path from 'path'
import read from '../../utils/read.js'

let currentDir = ''

function buildFileSystem(list) {
  const fileSystem = {}

  list.forEach((line) => {
    if (line.startsWith('$ cd')) {
      const dir = path.join(currentDir, line.replace('$ cd ', ''))

      fileSystem[dir] = {
        ...fileSystem[dir],
      }
      currentDir = dir
    } else if (line.startsWith('dir')) {
      const dir = path.join(currentDir, line.replace('dir ', ''))

      fileSystem[currentDir] = {
        ...fileSystem[currentDir],
        children: [...(fileSystem[currentDir]?.children || []), dir],
      }
    } else if (line.startsWith('$ ls')) {
      // do nothing
    } else {
      const [size, filename] = line.split(' ')
      fileSystem[currentDir] = {
        ...fileSystem[currentDir],
        [filename]: parseInt(size, 10),
      }
    }
  })

  return fileSystem
}

function calculateSize(fileSystem, start) {
  const dir = fileSystem[start]
  const total = Object.keys(dir)
    .filter((k) => k !== 'children')
    .map((k) => dir[k])
    .sumAll()

  if (dir.children) {
    dir.total =
      total +
      dir.children.reduce((acc, curr) => {
        return acc + calculateSize(fileSystem, curr)
      }, 0)
  } else {
    dir.total = total
  }
  return dir.total
}

function solution01(list) {
  currentDir = ''
  const fileSystem = buildFileSystem(list)

  calculateSize(fileSystem, '/')

  return Object.keys(fileSystem)
    .map((key) => fileSystem[key].total)
    .filter((n) => n <= 100000)
    .sumAll()
}

function solution02(list) {
  const TOTAL = 70000000
  const FREEUP = 30000000
  currentDir = ''
  const fileSystem = buildFileSystem(list)

  calculateSize(fileSystem, '/')

  const free = TOTAL - fileSystem['/'].total
  const needed = FREEUP - free

  return Object.keys(fileSystem)
    .map((key) => fileSystem[key].total)
    .filter((n) => n >= needed)
    .sortIntegers()
    .shift()
}

read('test.txt').then((list) => {
  assert.deepEqual(solution01(list), 95437)
  assert.deepEqual(solution02(list), 24933642)
})

read('input.txt').then((list) => {
  assert.deepEqual(solution01(list), 1844187)
  assert.deepEqual(solution02(list), 4978279)
})
