import assert from 'assert';
import read from '../utils/read.js';

function flashAdjacent(list, start, counter) {
  const [i, j] = start;

  if (typeof list[i] === 'undefined' || typeof list[i][j] === 'undefined') {
    return;
  }

  list[i][j] += 1;

  if (list[i][j] === 10) {
    const DIRECTION = [
      [-1, 0], [-1, 1], [0, 1], [1, 1],
      [1, 0], [1, -1], [0, -1], [-1, -1]
    ];

    DIRECTION.forEach(([k, l]) => {
      flashAdjacent(list, [i + k, j + l], counter);
    });

    counter.count += 1;
  }
}

function flashAll(list, stop = 100) {
  let numberList = list.map((line) => [...line].toNumber());
  const counter = { count: 0, allFlashing: -1 };

  for (let x = 0; x < stop; x++) {
    numberList.forEach((row, i) => {
      row.forEach((n, j) => {
        flashAdjacent(numberList, [i, j], counter);
      });
    });
    numberList = numberList.map((row) => row.map((n) => n > 9 ? 0 : n));

    if (counter.allFlashing === -1 && numberList.every((row) => row.every((n) => n === 0))) {
      counter.allFlashing = x + 1;
    }
  }

  return counter;
}

function solution01(list) {
  return flashAll(list).count;
}

function solution02(list) {
  return flashAll(list, 300).allFlashing;
}

read('./11/test.txt').then((list) => {
  assert.deepEqual(solution01(list), 1656);
  assert.deepEqual(solution02(list), 195);
});

read('./11/input.txt').then((list) => {
  assert.deepEqual(solution01(list), 1625);
  assert.deepEqual(solution02(list), 244);
});
