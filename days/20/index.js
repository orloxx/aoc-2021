import assert from 'assert';
import read from '../../utils/read.js';

function parseInput(list) {
  return list.reduce((prev, line) => {
    const newLine = line.replaceAll('.', 0)
      .replaceAll('#', 1);
    if (!prev.enhancer) return { ...prev, enhancer: newLine };
    prev.sample.push([...newLine]);
    return prev;
  }, { enhancer: '', sample: [] });
}

// from 5x5 to 7x7
function increase(sample, defaultChar = '0') {
  const size = sample.length;
  return [].n2DMatrix(size + 2, defaultChar)
    .map((row, i) => {
      return row.map((n, j) => {
        const I = i - 1;
        const J = j - 1;
        return sample[I] ? sample[I][J] || defaultChar : defaultChar;
      });
    });
}

function getBinary(sample, i, j, defaultChar = '0') {
  return [].n2DMatrix(3).map((row, x) => {
    return row.map((n, y) => {
      const I = x - 1;
      const J = y - 1;
      return sample[i + I] ? sample[i + I][j + J] || defaultChar : defaultChar;
    }).join('');
  }).join('');
}

function enhance(enhancer, sample, defaultChar = '0') {
  const newSample = increase(sample, defaultChar);
  return newSample.map((row, i) => {
    return row.map((n, j) => {
      const binary = getBinary(newSample, i, j, defaultChar);
      const idx = parseInt(binary, 2);
      return enhancer[idx];
    });
  });
}

function solution01(list) {
  const { enhancer, sample } = parseInput(list);
  const once = enhance(enhancer, sample);
  return enhance(enhancer, once, enhancer[0])
    .map((row) => row.map(Number))
    .flat2DMatrix()
    .sumAll();
}

function solution02(list) {
  const { enhancer, sample } = parseInput(list);
  return [].nMatrix(50).reduce((sol, c, i) => {
    return enhance(enhancer, sol, i % 2 !== 0 ? enhancer[0] : '0');
  }, sample)
    .map((row) => row.map(Number))
    .flat2DMatrix()
    .sumAll();
}

read('./20/test.txt').then((list) => {
  assert.deepEqual(solution01(list), 35);
  assert.deepEqual(solution02(list), 3351);
});

read('./20/input.txt').then((list) => {
  assert.deepEqual(solution01(list), 5563);
  assert.deepEqual(solution02(list), 19743);
});
