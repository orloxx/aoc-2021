import assert from 'assert';
import read from '../../utils/read.js';

function getPairsCount(pairs, rules) {
  return Object.keys(pairs).reduce((prev, pair) => {
    const count = pairs[pair];
    const pair01 = pair[0] + rules[pair];
    const pair02 = rules[pair] + pair[1];

    prev[pair01] = (prev[pair01] || 0) + count;
    prev[pair02] = (prev[pair02] || 0) + count;

    return prev;
  }, {})
}

function calculateEdgeDelta({ pairs, last }) {
  const letterMap = Object.keys(pairs).reduce((prev, pair) => {
    const [letter] = pair;
    prev[letter] = (prev[letter] || 0) + pairs[pair];
    if (pair === last) {
      const [, lastLetter] = last;
      prev[lastLetter] = (prev[lastLetter] || 0) + 1;
    }
    return prev;
  }, {});

  const sorted = Object.values(letterMap).sortIntegers();
  return sorted[sorted.length - 1] - sorted[0];
}

function getPolymer(list, length = 10) {
  const rules = list.slice(1).reduce((prev, rule) => {
    const [start, end] = rule.split(' -> ');
    return { ...prev, [start]: end };
  }, {});

  return calculateEdgeDelta([].nMatrix(length).reduce((prev) => ({
    pairs: getPairsCount(prev.pairs, rules),
    last: rules[prev.last] + prev.last[1]
  }), {
    pairs: [...list[0]].reduce((prev, c, i, arr) => {
      if (i === arr.length - 1) return prev;
      const pair = `${arr[i]}${arr[i + 1]}`
      return { ...prev, [pair]: (prev[pair] || 0) + 1 };
    }, {}),
    last: list[0].slice(-2)
  }));
}

function solution01(list) {
  return getPolymer(list);
}

function solution02(list) {
  return getPolymer(list, 40);
}

read('./14/test.txt').then((list) => {
  assert.deepEqual(solution01(list), 1588);
  assert.deepEqual(solution02(list), 2188189693529);
});

read('./14/input.txt').then((list) => {
  assert.deepEqual(solution01(list), 3058);
  assert.deepEqual(solution02(list), 3447389044530);
});
