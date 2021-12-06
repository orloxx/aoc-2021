import assert from 'assert';
import read from '../utils/read.js';

function getCoordinates(list, pathMap) {
  return list.reduce((prev, curr) => {
    const [dir, value] = curr.split(' ');
    return pathMap[dir](prev, parseInt(value, 10));
  }, { x: 0, y: 0, aim: 0 });
}

function solution01(list) {
  const coordinates = getCoordinates(list, {
    forward: (obj, value) => ({ ...obj, x: obj.x + value }),
    down: (obj, value) => ({ ...obj, y: obj.y + value }),
    up: (obj, value) => ({ ...obj, y: obj.y - value }),
  })

  return coordinates.x * coordinates.y;
}

function solution02(list) {
  const coordinates = getCoordinates(list, {
    forward: (obj, value) => ({
      ...obj,
      x: obj.x + value,
      y: obj.y + obj.aim * value
    }),
    down: (obj, value) => ({ ...obj, aim: obj.aim + value }),
    up: (obj, value) => ({ ...obj, aim: obj.aim - value }),
  })

  return coordinates.x * coordinates.y;
}

read('./2/test.txt').then((list) => {
  assert.deepEqual(solution01(list), 150);
  assert.deepEqual(solution02(list), 900);
});

read('./2/input.txt').then((list) => {
  assert.deepEqual(solution01(list), 1459206);
  assert.deepEqual(solution02(list), 1320534480);
});
