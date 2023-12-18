import assert from 'assert'
import read from '../../utils/read.js'

function solution01(list) {
  return list.reduce((sum, line) => {
    const [springs, groups] = line
      .split(' ')
      .map((s, i) => (i === 0 ? s : s.split(',').toNumber()))
    const brokenDownSprings = springs
      .split('')
      .reduce((set, bit) => {
        if (!set.length && bit === '.') return set
        if (!set.length && bit !== '.') return [[bit]]

        const last = set[set.length - 1]

        if (bit === '.' && !last.length) return set
        if (bit === '.' && last.length) return [...set, []]

        return [...set.slice(0, -1), [...last, bit]]
      }, [])
      .filter((s) => s.length)
      .map((s) => s.join(''))

    return sum
  }, 0)
}

function solution02(list) {}

read('test.txt').then((list) => {
  assert.deepEqual(solution01(list), 21)
  // assert.deepEqual(solution02(list), 2286)
})

read('input.txt').then((list) => {
  // assert.deepEqual(solution01(list), 2545)
  // assert.deepEqual(solution02(list), 0)
})
