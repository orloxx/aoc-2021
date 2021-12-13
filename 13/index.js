import assert from 'assert';
import read from '../utils/read.js';

function getPlots(list) {
  return list.filter((line) => line.indexOf('fold') < 0);
}

function getFolds(list) {
  return list.filter((line) => line.indexOf('fold') >= 0);
}

function findN(list) {
  return getPlots(list)
    .reduce((prev, curr) => {
      const [py, px] = prev;
      const [x, y] = curr.split(',');
      return [Math.max(py, parseInt(y, 10) + 1), Math.max(px, parseInt(x, 10) + 1)];
    }, [0, 0]);
}

function plotPaper(list) {
  const [maxX, maxY] = findN(list);
  const matrix = [].nm2DMatrix(maxY, maxX);
  return getPlots(list).reduce((prev, curr) => {
    const [x, y] = curr.split(',');
    prev[y][x] = 1; // #
    return prev;
  }, matrix); // 0
}

function foldHorizontal(plotted, fold) {
  const diff = plotted.length - fold - 1;

  for(let i = 1; i <= diff; i++) {
    plotted[fold - i] = plotted[fold + i].sumNMatrix(plotted[fold - i]);
  }

  return plotted.slice(0, fold);
}

function foldVertical(plotted, fold) {
  const diff = plotted[0].length - fold - 1;

  for (let i = 1; i <= diff; i++) {
    for (let j = 0; j < plotted.length; j++) {
      plotted[j][fold - i] += plotted[j][fold + i]
    }
  }
  return plotted.map((line) => line.slice(0, fold));
}

function foldPaper(plotted, [foldY, foldX]) {
  if (foldY) {
    return foldHorizontal(plotted, parseInt(foldY, 10));
  }

  return foldVertical(plotted, parseInt(foldX, 10));
}

function solution01(list) {
  const plotted = plotPaper(list);
  const [firstFold] = getFolds(list);
  const [, foldY] = firstFold.split('fold along y=');
  const [, foldX] = firstFold.split('fold along x=');

  return foldPaper(plotted, [foldY, foldX])
    .flat2DMatrix()
    .filter((n) => n > 0).length;
}

function solution02(list) {
  return getFolds(list).reduce((prev, curr) => {
    const [, foldY] = curr.split('fold along y=');
    const [, foldX] = curr.split('fold along x=');
    return foldPaper(prev, [foldY, foldX]);
  }, plotPaper(list))
    .map((list) => list.map((n) => n > 0 ? '#' : '.'))
    .map((list) => list.join(''));
}

read('./13/test.txt').then((list) => {
  assert.deepEqual(solution01(list), 17);
  assert.deepEqual(solution02(list), [
      '#####',
      '#...#',
      '#...#',
      '#...#',
      '#####',
      '.....',
      '.....'
    ]
  );
});

read('./13/input.txt').then((list) => {
  assert.deepEqual(solution01(list), 693);
  assert.deepEqual(solution02(list), [
    '#..#..##..#....####.###...##..####.#..#.',
    '#..#.#..#.#.......#.#..#.#..#....#.#..#.',
    '#..#.#....#......#..#..#.#..#...#..#..#.',
    '#..#.#....#.....#...###..####..#...#..#.',
    '#..#.#..#.#....#....#.#..#..#.#....#..#.',
    '.##...##..####.####.#..#.#..#.####..##..'
  ]);
});
