import assert from 'assert'
import read from '../../utils/read.js'

function parseInput(list) {
  return list.reduce((acc, line) => {
    const [card, numbers] = line.split(/: +/g)
    const [win, mine] = numbers
      .split(/ +\| +/g)
      .map((x) => x.split(/ +/g).map(Number))
    const intersection = win.filter((x) => mine.includes(x))

    // Originally it has one copy of each card
    return { ...acc, [card]: { win, mine, intersection, copies: 1 } }
  }, {})
}

function solution01(list) {
  return Object.values(parseInput(list)).reduce((sum, { intersection }) => {
    if (!intersection.length) return sum

    const binary = intersection.map((x, i) => (i === 0 ? 1 : 0)).join('')

    return sum + parseInt(binary, 2)
  }, 0)
}

function solution02(list) {
  const cards = Object.values(parseInput(list))

  cards.forEach(({ intersection }, i) => {
    intersection.forEach((x, j) => {
      const idx = i + j + 1

      if (cards[idx]) {
        cards[idx].copies += cards[i].copies
      }
    })
  })

  return cards.reduce((sum, { copies }) => {
    return sum + copies
  }, 0)
}

read('test.txt').then((list) => {
  assert.deepEqual(solution01(list), 13)
  assert.deepEqual(solution02(list), 30)
})

read('input.txt').then((list) => {
  assert.deepEqual(solution01(list), 18653)
  assert.deepEqual(solution02(list), 5921508)
})
