import assert from 'assert';
import read from '../../utils/read.js';

function getAdjacent([i, j], size) {
  const adjacent = [];
  if(i > 0) adjacent.push([i - 1, j]);
  if(j > 0) adjacent.push([i, j - 1]);
  if(i + 1 < size) adjacent.push([i + 1, j]);
  if(j + 1 < size) adjacent.push([i, j + 1]);
  return adjacent;
}

function findShortest(matrix) {
  const size = matrix.length;
  const start = [0,0];
  const end = [size - 1, size -1];
  const prevPath = [];

  const { weight, visited } = matrix.reduce((prev, row, i) => {
    return row.reduce((rowPrev, n, j) => {
      rowPrev.weight[[i, j]] = Infinity;
      rowPrev.visited[[i, j]] = false;
      return rowPrev;
    }, { weight: prev.weight, visited: prev.visited });
  }, { weight: [], visited: [] });

  weight[start] = 0;
  visited[start] = true;

  let buffer = [start];
  while (buffer.length > 0) {
    let current = buffer[0];

    for(let i = 0; i < buffer.length; i++) {
      if (weight[buffer[i]] < weight[current]) {
        current = buffer[i];
      }
    }

    if(current[0] === end[0] && current[1] === end[1]) {
      let lowestRisk = 0;
      let direction = current;
      while (prevPath[direction]){
        lowestRisk += matrix[direction[0]][direction[1]];
        direction = prevPath[direction];
      }
      return lowestRisk;
    }

    buffer = buffer.filter(([i, j]) => i !== current[0] || j !== current[1]);

    getAdjacent(current, size).forEach(([i, j]) => {
      if(visited[[i, j]] === false) {
        const possibleCost = matrix[i][j] + weight[current];
        if (possibleCost < weight[[i, j]]) {
          weight[[i, j]] = possibleCost;
          prevPath[[i, j]] = current;
        }
        visited[[i, j]] = true;
        buffer.push([i, j]);
      }
    });
  }
}

function solution01(list) {
  const matrix = list.map((row) => [...row].map(Number));
  return findShortest(matrix);
}

function getNextInt(weight, idx) {
  return weight + idx > 9 ? (weight + idx) % 9 : weight + idx;
}

function getGrownMatrix(list) {
  const original = list.map((row) => [...row].map(Number));
  const size = original.length;
  const MULTIPLIER = 5;
  return original.reduce((result, row, i) => {
    const newRow = row.reduce((prev, n, j) => {
      [].nMatrix(MULTIPLIER).forEach((nada, z) => {
        prev[j + size * z] = getNextInt(n, z);
      });
      return prev;
    }, [].nMatrix(size * MULTIPLIER));

    [].nMatrix(MULTIPLIER).forEach((nada, z) => {
      result[i + size * z] = newRow.map((n) => getNextInt(n, z));
    });

    return result;
  }, [].n2DMatrix(size * MULTIPLIER));
}

function solution02(list) {
  const matrix = getGrownMatrix(list);
  return findShortest(matrix);
}

read('./15/test.txt').then((list) => {
  assert.deepEqual(solution01(list), 40);
  assert.deepEqual(solution02(list), 315);
});

read('./15/input.txt').then((list) => {
  assert.deepEqual(solution01(list), 390);
  console.time('a2');
  assert.deepEqual(solution02(list), 2814);
  console.timeEnd('a2');
});
