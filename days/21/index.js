import assert from 'assert'
import read from '../../utils/read.js'

const OPERATIONS = {
  '+': (a, b) => a + b,
  '-': (a, b) => a - b,
  '*': (a, b) => a * b,
  '/': (a, b) => a / b,
}

function solution01(list) {
  const monkeys = list.reduce((acc, monkey) => {
    const [name, opStr] = monkey.split(': ')
    const [other00, op, other01] = opStr.match(/[^\s"']+|"([^"]*)"|'([^']*)'/g)

    return {
      ...acc,
      [name]: { other00, op, other01, yell: () => parseInt(other00, 10) },
    }
  }, {})
  Object.keys(monkeys).forEach((name) => {
    const { other00, op, other01 } = monkeys[name]

    if (op) {
      monkeys[name].yell = () => {
        return OPERATIONS[op](monkeys[other00].yell(), monkeys[other01].yell())
      }
    }
  })

  return monkeys.root.yell()
}

function solution02(list) {}

read('test.txt').then((list) => {
  assert.deepEqual(solution01(list), 152)
  // assert.deepEqual(solution02(list), 1623178306)
})

read('input.txt').then((list) => {
  assert.deepEqual(solution01(list), 31017034894002)
  // assert.deepEqual(solution02(list), 7865110481723)
})
