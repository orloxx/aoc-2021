import assert from 'assert';
import read from '../utils/read.js';

function solution01(list) {
  return list.reduce((prev, curr) => {
    const prevNumber = parseInt(curr, 10);
    if (prevNumber > prev.previous) {
      return { count: prev.count + 1, previous: prevNumber };
    }
    return { count: prev.count, previous: prevNumber };
  }, { count: 0, previous: Infinity }).count;
}

function solution02(list) {
  return list.reduce((prev, curr, i) => {
    if (i > list.length - 2) return prev;

    const num1 = parseInt(list[i], 10);
    const num2 = parseInt(list[i + 1], 10);
    const num3 = parseInt(list[i + 2], 10);
    const prevNumber = num1 + num2 + num3;
    if (prevNumber > prev.previous) {
      return { count: prev.count + 1, previous: prevNumber };
    }
    return { count: prev.count, previous: prevNumber };
  }, { count: 0, previous: Infinity }).count;
}

read('./1/test.txt').then((list) => {
  assert.deepEqual(solution01(list), 7);
  assert.deepEqual(solution02(list), 5);
});

read('./1/input.txt').then((list) => {
  assert.deepEqual(solution01(list), 1215);
  assert.deepEqual(solution02(list), 1150);
});
