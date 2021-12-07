import assert from 'assert';
import read from '../utils/read.js';

function solution01(list) {
  const values = list[0].split(',').toNumber().sortIntegers();
  const middle = values[values.length / 2];
  return values.reduce((prev, n) => prev + Math.abs(n - middle), 0);
}

function distance(n, middle) {
  const delta = Math.abs(n - middle);
  return [].nMatrix(delta).reduce((p, b, i) => p + i + 1, 0);
}

function solution02(list) {
  const values = list[0].split(',').toNumber().sortIntegers();
  const avg = values.sumAll() / values.length;
  const middle = avg < (values.length / 2) - 1 ? Math.floor(avg) : Math.ceil(avg);
  return values.reduce((prev, n) => prev + distance(n, middle), 0);
}

read('./7/test.txt').then((list) => {
  assert.deepEqual(solution01(list), 37);
  assert.deepEqual(solution02(list), 168);
});

read('./7/input.txt').then((list) => {
  assert.deepEqual(solution01(list), 352331);
  assert.deepEqual(solution02(list), 99266250);
});
