import assert from 'assert'
import read from '../../utils/read.js'

const START_PREFIX = '  Starting items:'
const OP_PREFIX = '  Operation: new = '
const TEST_PREFIX = '  Test: divisible by '
const TRUE_PREFIX = '    If true: throw to monkey '
const FALSE_PREFIX = '    If false: throw to monkey '

const OPERATIONS = {
  '+': (x, y) => x + y,
  '*': (x, y) => x * y,
}

function parseMonkeyBusiness(list) {
  let monkeyIdx
  return list.reduce((acc, line) => {
    if (line.startsWith('Monkey')) {
      // Define Monkey object
      monkeyIdx = line.match(/[0-9]+/g).pop()
      acc[monkeyIdx] = { seen: 0 }
    } else if (line.startsWith(START_PREFIX)) {
      // parse items it has
      acc[monkeyIdx].items = line.match(/[0-9]+/g).toNumber()
    } else if (line.startsWith(OP_PREFIX)) {
      // define operation function
      const opStr = line.replace(OP_PREFIX, '')
      const [x, op, y] = opStr.match(/[^\s"']+|"([^"]*)"|'([^']*)'/g)
      const param = (p, old) => (p === 'old' ? old : parseInt(p, 10))

      acc[monkeyIdx].operation = (old) =>
        OPERATIONS[op](param(x, old), param(y, old))
    } else if (line.startsWith(TEST_PREFIX)) {
      // Save test condition
      const divisibleBy = line.replace(TEST_PREFIX, '')

      acc[monkeyIdx].divisibleBy = divisibleBy
      acc[monkeyIdx].test = (worry) => worry % parseInt(divisibleBy, 10) === 0
    } else if (line.startsWith(TRUE_PREFIX)) {
      // Throw-to-monkey index when condition is true
      acc[monkeyIdx].trueMonkey = line.replace(TRUE_PREFIX, '')
    } else if (line.startsWith(FALSE_PREFIX)) {
      // Throw-to-monkey index when condition is false
      acc[monkeyIdx].falseMonkey = line.replace(FALSE_PREFIX, '')
    }
    return acc
  }, [])
}

function doMonkeyBusiness({ monkeyData, rounds, naivety }) {
  const superModulo = monkeyData.map((m) => m.divisibleBy).multiplyAll()

  return rounds
    .reduce(
      (group) => {
        // run each round
        return group.map((monkey, i) => {
          const newSeen = monkey.items.reduce((seen, worry) => {
            // worry operation can go big
            const newWorry = naivety(monkey.operation(worry))
            const noWorry = newWorry % superModulo
            const monkeyIdx =
              noWorry % monkey.divisibleBy === 0
                ? monkey.trueMonkey
                : monkey.falseMonkey
            group[monkeyIdx].items.push(noWorry)
            return seen + 1
          }, 0)
          // monkey has seen and thrown all items
          group[i].items = []
          return {
            ...monkey,
            // Run each turn
            seen: monkey.seen + newSeen,
          }
        })
      },
      [...monkeyData]
    )
    .map((monkey) => monkey.seen)
    .sortIntegers(-1)
    .filter((n, i) => i < 2)
    .multiplyAll()
}

function solution01(list) {
  const monkeyData = parseMonkeyBusiness(list)
  return doMonkeyBusiness({
    monkeyData,
    rounds: [].nMatrix(20),
    naivety: (worry) => Math.floor(worry / 3),
  })
}

function solution02(list) {
  const monkeyData = parseMonkeyBusiness(list)
  return doMonkeyBusiness({
    monkeyData,
    rounds: [].nMatrix(10000),
    naivety: (worry) => worry,
  })
}

read('test.txt').then((list) => {
  assert.deepEqual(solution01(list), 10605)
  assert.deepEqual(solution02(list), 2713310158)
})

read('input.txt').then((list) => {
  assert.deepEqual(solution01(list), 55216)
  assert.deepEqual(solution02(list), 12848882750)
})
