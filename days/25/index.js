import assert from 'assert';
import read from '../../utils/read.js';

function * seaCucumbers(matrix) {
  let moving = true;
  let step = 0;

  matrix = matrix.map((row) => [...row]);
  while (moving) {
    moving = false;
    // move east-side
    matrix.forEach((row, i) => {
      row.forEach((n, j) => {
        const J = j === 0 ? row.length - 1 : j - 1;
        if (n === '.' && matrix[i][J] === '>') {
          matrix[i][J] = j === 0 ? 'x' : '.';
          matrix[i][j] = '<';
        }
      });
    });
    // move south-side
    matrix.forEach((row, i) => {
      row.forEach((n, j) => {
        const I = i === 0 ? matrix.length - 1 : i - 1;
        if ((n === '.' || n === 'x') && matrix[I][j] === 'v') {
          matrix[I][j] = i === 0 ? 'y' : '.';
          matrix[i][j] = '^';
        }
      });
    });
    // convert moved
    matrix.forEach((row, i) => {
      row.forEach((n, j) => {
        if (n === '<') {
          moving = true;
          matrix[i][j] = '>';
        } else if (n === '^') {
          moving = true;
          matrix[i][j] = 'v';
        } else if (n === 'x' || n === 'y') {
          moving = true;
          matrix[i][j] = '.';
        }
      });
    });

    yield { matrix, step: ++step };
  }
}

function solution01(list) {
  let state
  for (state of seaCucumbers(list)) {}
  return state.step;
}

function solution02(list) {
}

read('./25/test.txt').then((list) => {
  assert.deepEqual(solution01(list), 58);
  // assert.deepEqual(solution02(list), 3351);
});

read('./25/input.txt').then((list) => {
  assert.deepEqual(solution01(list), 557);
  // assert.deepEqual(solution02(list), 19743);
});
