import assert from 'assert'
import read from '../../utils/read.js'

const OPERATIONS = {
  '+': (a, b) => a + b,
  '-': (a, b) => a - b,
  '*': (a, b) => a * b,
  '/': (a, b) => a / b,
}

const INV = {
  '+': OPERATIONS['-'],
  '-': OPERATIONS['+'],
  '*': OPERATIONS['/'],
  '/': OPERATIONS['*'],
}

const NON_COMM = ['-', '/']

function buildMonkeyTree(list) {
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

  return monkeys
}

function solution01(list) {
  const monkeys = buildMonkeyTree(list)

  return monkeys.root.yell()
}

function getChain(monkeys, start = 'humn', path = []) {
  if (start === 'root') return path.reverse()

  const parent = Object.keys(monkeys).find((name) => {
    const { other00, other01 } = monkeys[name]
    return other00 === start || other01 === start
  })
  const { other00, op, other01 } = monkeys[parent]
  const next =
    start === other00 ? { next: other01, p: 1 } : { next: other00, p: 0 }

  return getChain(monkeys, parent, [
    ...path,
    { ...next, parent, op, other00, other01 },
  ])
}

function solution02(list) {
  const monkeys = buildMonkeyTree(list)
  const chain = getChain(monkeys)
  const humanValue = chain.reduce((acc, curr) => {
    if (curr.parent === 'root') return monkeys[curr.next].yell()

    const op = OPERATIONS[curr.op]
    const inv = INV[curr.op]

    if (curr.p === 0 && NON_COMM.includes(curr.op)) {
      return op(monkeys[curr.next].yell(), acc)
    }

    return inv(acc, monkeys[curr.next].yell())
  }, 0)

  monkeys.humn.yell = () => humanValue

  monkeys.root.yell = () => {
    const { other00, other01 } = monkeys.root
    return monkeys[other00].yell() === monkeys[other01].yell()
  }

  return monkeys.humn.yell()
}

read('test.txt').then((list) => {
  assert.deepEqual(solution01(list), 152)
  assert.deepEqual(solution02(list), 301)
})

read('input.txt').then((list) => {
  assert.deepEqual(solution01(list), 31017034894002)
  assert.deepEqual(solution02(list), 3555057453229)
})
