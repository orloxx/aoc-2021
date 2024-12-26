import assert from 'assert'
import read from '../../utils/read.js'
import Computer from './computer.js'

function parseInput(list) {
  const [a, b, c, , program] = list

  return {
    A: Number(a.replace('Register A: ', '')),
    B: Number(b.replace('Register B: ', '')),
    C: Number(c.replace('Register C: ', '')),
    program: program.replace('Program: ', '').split(',').map(Number),
  }
}

function solution01(list) {
  const computer = new Computer(parseInput(list))

  return computer.run()
}

function solution02(list) {
  const input = parseInput(list)
  const { program } = input

  let computer
  let A = 100000

  do {
    A++
    computer = new Computer({ ...input, A })
  } while (computer.run() !== program.join())

  return A
}

read('test01.txt').then((list) => {
  assert.deepEqual(solution01(list), '4,6,3,5,6,3,5,2,1,0')
})

read('test02.txt').then((list) => {
  assert.deepEqual(solution02(list), 117440)
})

read('input.txt').then((list) => {
  assert.deepEqual(solution01(list), '5,1,3,4,3,7,2,1,7')
  // assert.deepEqual(solution02(list), 7083)
})
