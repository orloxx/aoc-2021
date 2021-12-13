import assert from 'assert';
import read from '../../utils/read.js';

function plotVertical(matrix, y1, y2, x) {
  // down
  if (y1 < y2) {
    for (let i = y1; i <= y2; i++) {
      matrix[i][x]++;
    }
  }
  // up
  else {
    for (let i = y2; i <= y1; i++) {
      matrix[i][x]++;
    }
  }
}

function plotHorizontal(matrix, x1, x2, y) {
  // right
  if (x1 < x2) {
    for (let i = x1; i <= x2; i++) {
      matrix[y][i]++;
    }
  }
  // left
  else {
    for (let i = x2; i <= x1; i++) {
      matrix[y][i]++;
    }
  }
}

function plotDiagonal(matrix, p1, p2) {
  let [x1, y1] = p1.split(',');
  let [x2, y2] = p2.split(',');
  const slope = (y2 - y1) / (x2 - x1);
  x1 = parseInt(x1);
  x2 = parseInt(x2);
  y1 = parseInt(y1);

  // upward to the right
  if (slope < 0 && x1 < x2) {
    for (let i = x1; i <= x2; i++) {
      matrix[y1--][x1++]++;
    }
  }
  // downward to the left
  else if (slope < 0 && x1 > x2) {
    for (let i = x1; i >= x2; i--) {
      matrix[y1++][x1--]++;
    }
  }
  // downward to the right
  else if (slope > 0 && x1 < x2) {
    for (let i = x1; i <= x2; i++) {
      matrix[y1++][x1++]++;
    }
  }
  // upward to the left
  else if (slope > 0 && x1 > x2) {
    for (let i = x1; i >= x2; i--) {
      matrix[y1--][x1--]++;
    }
  }
}

function getPlots(list, { size = 1000, d } = {}) {
  return list.reduce((prev, curr) => {
    const [p1, p2] = curr.split(' -> ');
    const [x1, y1] = p1.split(',');
    const [x2, y2] = p2.split(',');

    if (x1 === x2) {
      plotVertical(prev, parseInt(y1), parseInt(y2), parseInt(x1));
    } else if (y1 === y2) {
      plotHorizontal(prev, parseInt(x1), parseInt(x2), parseInt(y1));
    } else if (d) {
      plotDiagonal(prev, p1, p2);
    }

    return prev;
  }, [].n2DMatrix(size));
}

function solution01(list) {
  const plots = getPlots(list);
  return plots.flat2DMatrix().filter((n) => n > 1).length;
}

function solution02(list) {
  const plots = getPlots(list, { d: true });
  return plots.flat2DMatrix().filter((n) => n > 1).length;
}

read('./5/test.txt').then((list) => {
  assert.deepEqual(solution01(list), 5);
  assert.deepEqual(solution02(list), 12);
});

read('./5/input.txt').then((list) => {
  assert.deepEqual(solution01(list), 5690);
  assert.deepEqual(solution02(list), 17741);
});
