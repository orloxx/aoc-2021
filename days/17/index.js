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
  const ops = BigInt(program.length - 1)

  let computer
  let output
  let bit = 1n
  let A = 8n ** ops - 8n ** (ops - bit)

  do {
    A += 8n ** (ops - bit)
    computer = new Computer({ ...input, A })
    output = computer.run()

    const outputArr = output.split(',').map(Number)

    for (let i = outputArr.length - 1; i >= 0; i--) {
      if (outputArr[i] !== program[i]) {
        bit = BigInt(outputArr.length - i)
        if (bit > ops) bit = ops
        break
      }
    }
  } while (output !== program.join())

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
  assert.deepEqual(solution02(list), 216584205979245)
})
