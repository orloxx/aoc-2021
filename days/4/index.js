import assert from 'assert'
import read from '../../utils/read.js'

function checkWord({ matrix, i, j, word }) {
  const chars = word.split('')

  return {
    right: () => chars.every((c, k) => matrix[i]?.[j + k] === c),
    left: () => chars.every((c, k) => matrix[i]?.[j - k] === c),
    down: () => chars.every((c, k) => matrix[i + k]?.[j] === c),
    up: () => chars.every((c, k) => matrix[i - k]?.[j] === c),
    rightDown: () => chars.every((c, k) => matrix[i + k]?.[j + k] === c),
    rightUp: () => chars.every((c, k) => matrix[i - k]?.[j + k] === c),
    leftUp: () => chars.every((c, k) => matrix[i - k]?.[j - k] === c),
    leftDown: () => chars.every((c, k) => matrix[i + k]?.[j - k] === c),
  }
}

function solution01(list) {
  const matrix = list.map((line) => line.split(''))

  return matrix.reduce((acc, line, i) => {
    return (
      acc +
      line.reduce((acc2, char, j) => {
        if (char !== 'X') return acc2

        const check = checkWord({ matrix, i, j, word: 'XMAS' })

        return (
          acc2 +
          Number(check.right()) +
          Number(check.left()) +
          Number(check.down()) +
          Number(check.up()) +
          Number(check.rightDown()) +
          Number(check.rightUp()) +
          Number(check.leftUp()) +
          Number(check.leftDown())
        )
      }, 0)
    )
  }, 0)
}

function checkClockwise({ matrix, i, j }) {
  return (word) => {
    const [tl, tr, br, bl] = word.split('')

    return (
      matrix[i - 1]?.[j - 1] === tl &&
      matrix[i - 1]?.[j + 1] === tr &&
      matrix[i + 1]?.[j + 1] === br &&
      matrix[i + 1]?.[j - 1] === bl
    )
  }
}

function solution02(list) {
  const matrix = list.map((line) => line.split(''))

  return matrix.reduce((acc, line, i) => {
    return (
      acc +
      line.reduce((acc2, char, j) => {
        if (char !== 'A') return acc2

        const check = checkClockwise({ matrix, i, j })

        if (check('MMSS') || check('SMMS') || check('SSMM') || check('MSSM'))
          return acc2 + 1

        return acc2
      }, 0)
    )
  }, 0)
}

read('test.txt').then((list) => {
  assert.deepEqual(solution01(list), 18)
  assert.deepEqual(solution02(list), 9)
})

read('input.txt').then((list) => {
  assert.deepEqual(solution01(list), 2521)
  assert.deepEqual(solution02(list), 1912)
})
