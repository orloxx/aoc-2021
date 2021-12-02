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

read('./1/input.txt').then((result) => {
  console.log(solution01(result));
  console.log(solution02(result));
});
