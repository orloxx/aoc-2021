import assert from 'assert';
import read from '../utils/read.js';

function isLowest(n, list, i, j) {
  // check up
  return (!list[i - 1] || n < list[i - 1][j]) &&
    // check right
    (!list[i][j + 1] || n < list[i][j + 1]) &&
    // check down
    (!list[i + 1] || n < list[i + 1][j]) &&
    // check left
    (!list[i][j - 1] || n < list[i][j - 1]);
}

function getLowestCoordinates(list) {
  return list.reduce((prev, curr, i) => {
    const row = [...curr].toNumber()
      .reduce((prevRow, n, j) => {
        if (isLowest(n, list, i, j)) {
          return [...prevRow, [i, j]];
        }
        return prevRow;
      }, []);
    return [...prev, ...row];
  }, []);
}

function solution01(list) {
  return getLowestCoordinates(list)
    .map(([i, j]) => parseInt(list[i][j], 10) + 1)
    .sumAll();
}

function getBasins(list, start, prev = []) {
  const [i, j] = start;

  const alreadyChecked = (x, y) =>
    prev.length && prev.findIndex((p) => p[0] === x && p[1] === y) >= 0;

  if (alreadyChecked(i, j)) return prev;

  let basins = [...prev, start];

  // check up
  if (list[i - 1] && list[i - 1][j] !== '9' && !alreadyChecked(i - 1, j))
    basins = getBasins(list, [i - 1, j], basins);
  // check right
  if (list[i][j + 1] && list[i][j + 1] !== '9' && !alreadyChecked(i, j + 1))
    basins = getBasins(list, [i, j + 1], basins);
  // check down
  if (list[i + 1] && list[i + 1][j] !== '9' && !alreadyChecked(i + 1, j))
    basins = getBasins(list, [i + 1, j], basins);
  // check left
  if (list[i][j - 1] && list[i][j - 1] !== '9' && !alreadyChecked(i, j - 1))
    basins = getBasins(list, [i, j - 1], basins);

  return basins;
}

function solution02(list) {
  return getLowestCoordinates(list)
    .map((p) => getBasins(list, p).length)
    .sortIntegers(-1)
    .reduce((prev, curr, i) => {
      if (i < 3) return prev * curr;
      return prev;
    }, 1);
}

read('./9/test.txt').then((list) => {
  assert.deepEqual(solution01(list), 15);
  assert.deepEqual(solution02(list), 1134);
});

read('./9/input.txt').then((list) => {
  assert.deepEqual(solution01(list), 502);
  assert.deepEqual(solution02(list), 1330560);
});
