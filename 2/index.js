import read from '../utils/read.js';

function getCoordinates(result, pathMap) {
  return result.reduce((prev, curr) => {
    const [dir, value] = curr.split(' ');
    return pathMap[dir](prev, parseInt(value, 10));
  }, { x: 0, y: 0, aim: 0 });
}

function solution01(result) {
  const coordinates = getCoordinates(result, {
    forward: (obj, value) => ({ ...obj, x: obj.x + value }),
    down: (obj, value) => ({ ...obj, y: obj.y + value }),
    up: (obj, value) => ({ ...obj, y: obj.y - value }),
  })

  return coordinates.x * coordinates.y;
}

function solution02(result) {
  const coordinates = getCoordinates(result, {
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

read('./2/input.txt').then((result) => {
  console.log(solution01(result));
  console.log(solution02(result));
});
