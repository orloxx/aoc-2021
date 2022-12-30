import assert from 'assert'
import read from '../../utils/read.js'

function execute(list, initialState = {}, check = () => {}) {
  return list.reduce(
    (acc, curr) => {
      if (curr === 'noop') {
        acc.steps++
        check(acc)
        return acc
      }

      const [, n] = curr.split(' ')
      const num = parseInt(n, 10)

      for (let i = 0; i < 2; i++) {
        acc.steps++
        check(acc)
      }

      return { ...acc, register: acc.register + num }
    },
    { steps: 0, register: 1, ...initialState }
  )
}

function solution01(list) {
  const REC = [20, 60, 100, 140, 180, 220]
  return execute(list, { res: [] }, (acc) =>
    REC.forEach((rec, i) => {
      if (acc.res.length === i && acc.steps === rec) {
        acc.res.push(acc.register * rec)
      }
    })
  ).res.sumAll()
}

function solution02(list) {
  const COLS = 40
  const ROWS = 6

  return execute(list, { screen: [].nm2DMatrix(ROWS, COLS, ' ') }, (acc) => {
    const col = (acc.steps - 1) % COLS
    const row = Math.floor((acc.steps - 1) / COLS)

    if (col >= acc.register - 1 && col <= acc.register + 1) {
      acc.screen[row][col] = '█'
    }
  }).screen.map((line) => line.join(''))
}

read('test.txt').then((list) => {
  assert.deepEqual(solution01(list), 13140)

  const sol02 = [
    '██  ██  ██  ██  ██  ██  ██  ██  ██  ██  ',
    '███   ███   ███   ███   ███   ███   ███ ',
    '████    ████    ████    ████    ████    ',
    '█████     █████     █████     █████     ',
    '██████      ██████      ██████      ████',
    '███████       ███████       ███████     ',
  ]
  assert.deepEqual(solution02(list), sol02)
})

read('input.txt').then((list) => {
  assert.deepEqual(solution01(list), 14820)

  const sol02 = [
    '███  ████ ████ █  █ ████ ████ █  █  ██  ',
    '█  █    █ █    █ █  █    █    █  █ █  █ ',
    '█  █   █  ███  ██   ███  ███  ████ █  █ ',
    '███   █   █    █ █  █    █    █  █ ████ ',
    '█ █  █    █    █ █  █    █    █  █ █  █ ',
    '█  █ ████ ████ █  █ ████ █    █  █ █  █ ',
  ]
  assert.deepEqual(solution02(list), sol02)
})
