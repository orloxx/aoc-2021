import assert from 'assert'
import read from '../../utils/read.js'

const CARDS = {
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  T: 10,
  J: 11,
  Q: 12,
  K: 13,
  A: 14,
}

const TYPES = {
  five: 7,
  four: 6,
  fullHouse: 5,
  three: 4,
  twoPairs: 3,
  pair: 2,
  high: 1,
}

function detectHandType(hand, withJoker = false) {
  const handCards = hand.split('')
  const cardsSet = new Set([...handCards])

  const checkCard = (c1, c2) => {
    if (withJoker) return c1 === c2 || c1 === 'J'

    return c1 === c2
  }
  const isXOfAKind = (x) =>
    handCards.some(
      (card) => handCards.filter((c) => checkCard(c, card)).length === x
    )

  if (isXOfAKind(5)) return TYPES.five
  if (isXOfAKind(4)) return TYPES.four

  if (isXOfAKind(3)) {
    if (cardsSet.size === 2) return TYPES.fullHouse
    if (withJoker && cardsSet.has('J') && cardsSet.size === 3)
      return TYPES.fullHouse

    return TYPES.three
  }

  if (isXOfAKind(2)) {
    if (cardsSet.size === 3) return TYPES.twoPairs
    if (withJoker && cardsSet.has('J') && cardsSet.size === 4)
      return TYPES.twoPairs

    return TYPES.pair
  }

  return TYPES.high
}

function compareSameType(hand1, hand2, withJoker = false) {
  for (let i = 0; i < hand1.length; i++) {
    const [card1, card2] = [hand1[i], hand2[i]]

    if (withJoker) {
      if (card1 === 'J' && card1 !== card2) return 1
      if (card2 === 'J' && card1 !== card2) return -1
      if (CARDS[card1] > CARDS[card2]) return -1
      if (CARDS[card1] < CARDS[card2]) return 1
    } else {
      if (CARDS[card1] > CARDS[card2]) return -1
      if (CARDS[card1] < CARDS[card2]) return 1
    }
  }

  return 0
}

function parseHands(list, withJoker = false) {
  return list.reduce((acc, line) => {
    const [hand, points] = line.split(' ')
    const bid = Number(points)

    return { ...acc, [hand]: { bid, type: detectHandType(hand, withJoker) } }
  }, {})
}

function solution(list, withJoker = false) {
  const camelCards = parseHands(list, withJoker)

  return Object.entries(camelCards)
    .sort(([h1, a], [h2, b]) => {
      return b.type - a.type || compareSameType(h1, h2, withJoker)
    })
    .map(([, { bid }], i, allHands) => bid * (allHands.length - i))
    .sumAll()
}

read('test.txt').then((list) => {
  assert.deepEqual(solution(list), 6440)
  assert.deepEqual(solution(list, true), 5905)
})

read('input.txt').then((list) => {
  assert.deepEqual(solution(list), 251106089)
  assert.deepEqual(solution(list, true), 249620106)
})
