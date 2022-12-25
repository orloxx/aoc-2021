import assert from 'assert'
import read from '../../utils/read.js'

const DIRS = ['E', 'S', 'W', 'N']
const DIR = [...DIRS]
const WALK = {
  E: ([y, x]) => [y, x + 1],
  S: ([y, x]) => [y + 1, x],
  W: ([y, x]) => [y, x - 1],
  N: ([y, x]) => [y - 1, x],
}
const FOLD = {
  E: (map, [y]) => [y, map[y].findIndex((c) => c)],
  S: (map, [, x]) => [map.findIndex((l) => l[x]), x],
  W: (map, [y]) => [y, map[y].length - 1],
  N: (map, [, x]) => [
    map.length -
      map
        .slice()
        .reverse()
        .findIndex((l) => l[x]) -
      1,
    x,
  ],
}
const TURN = {
  R: () => DIR.push(DIR.shift()),
  L: () => DIR.unshift(DIR.pop()),
}

function parseInput(list) {
  const splitIdx = list.findIndex((line) => !line)
  const map = list
    .slice(0, splitIdx)
    .map((line) => line.split('').map((n) => n.trim() || undefined))
  const [directions] = list.slice(splitIdx + 1)
  const turns = directions.getLetters()
  const steps = directions.getNumbers().reduce((acc, curr, i) => {
    const addStep = [...acc, curr]
    if (turns[i]) addStep.push(turns[i])
    return addStep
  }, [])
  const X = map[0].indexOf('.')

  return { map, steps, directions, X, turns }
}

function solution01(list) {
  const { map, steps, X } = parseInput(list)
  let current = [0, X]

  steps.forEach((step) => {
    if (typeof step === 'number') {
      for (let i = 0; i < step; i++) {
        const [dir] = DIR
        const [ny, nx] = WALK[dir](current)

        if (!map[ny] || !map[ny][nx]) {
          const [fy, fx] = FOLD[dir](map, current)

          if (map[fy][fx] === '.') {
            current = [fy, fx]
          } else {
            break
          }
        } else if (map[ny][nx] === '.') {
          current = [ny, nx]
        } else {
          break
        }
      }
    } else {
      TURN[step]()
    }
  })

  const [y, x] = current

  return 1000 * (y + 1) + 4 * (x + 1) + DIRS.indexOf(DIR[0])
}

const FOLD_CUBE = {
  E: ([y]) => {
    if ((y >= 0 && y < 50) || (y >= 100 && y < 150)) {
      return [150 - y, 99, ['R', 'R']]
    }
    if (y >= 50 && y < 100) {
      return [49, 50 + y, ['L']]
    }
    return [149, y - 100, ['L']]
  },
  S: ([, x]) => {
    if (x >= 100 && x < 150) {
      return [x - 50, 99, ['R']]
    }
    if (x >= 50 && x < 100) {
      return [100 + x, 49, ['R']]
    }
    return [0, 100 + x, []]
  },
  W: ([y, x]) => {
    if ((y >= 0 && y < 50) || (y >= 100 && y < 150)) {
      return [150 - y, 50 - x, ['R', 'R']]
    }
    if (y >= 50 && y < 100) {
      return [100, y - 50, ['L']]
    }
    return [0, y - 100, ['L']]
  },
  N: ([, x]) => {
    if (x >= 0 && x < 50) {
      return [50 + x, 50, ['R']]
    }
    if (x >= 50 && x < 100) {
      return [100 + x, 0, ['R']]
    }
    return [199, x - 100, []]
  },
}

function solution02(list) {
  const { map, steps, X } = parseInput(list)
  let current = [0, X]

  steps.forEach((step) => {
    if (typeof step === 'number') {
      for (let i = 0; i < step; i++) {
        const [dir] = DIR
        const [ny, nx] = WALK[dir](current)

        if (!map[ny] || !map[ny][nx]) {
          const [fy, fx, turns] = FOLD_CUBE[dir](current)

          if (map[fy][fx] === '.') {
            current = [fy, fx]
            turns.forEach((t) => TURN[t]())
          } else {
            break
          }
        } else if (map[ny][nx] === '.') {
          current = [ny, nx]
        } else {
          break
        }
      }
    } else {
      TURN[step]()
    }
  })

  const [y, x] = current

  return 1000 * (y + 1) + 4 * (x + 1) + DIRS.indexOf(DIR[0])
}

read('test.txt').then((list) => {
  assert.deepEqual(solution01(list), 6032)
})

read('input.txt').then((list) => {
  assert.deepEqual(solution01(list), 31568)
  assert.deepEqual(solution02(list), 3555057453229)
})
