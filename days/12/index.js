import assert from 'assert';
import read from '../../utils/read.js';

function getNodes(list) {
  return list.reduce((prev, curr, i) => {
    const [start, end] = curr.split('-');
    if (prev.indexOf(start) < 0 && start !== 'end') prev.push(start);
    if (prev.indexOf(end) < 0 && end !== 'end') prev.push(end);
    if (i === list.length - 1) prev.push('end');
    return prev;
  }, ['start']);
}

function getAdjacent(list, nodes) {
  return list.reduce((matrix, row) => {
    if (!matrix.length) {
      matrix = [].nMatrix(nodes.length).map(() => []);
    }
    const [start, end] = row.split('-');
    const i = nodes.indexOf(start);
    const j = nodes.indexOf(end);

    if (start === 'end' || end === 'start') {
      matrix[j].push(i);
    } else {
      matrix[i].push(j);
      if (end !== 'end' && start !== 'start') {
        matrix[j].push(i);
      }
    }
    return matrix;
  }, []);
}

function getPaths({
  start = 0,
  end,
  nodes,
  adjacent,
  visited = [].nMatrix(adjacent.length),
  path = [0],
  enableTwoCave = false
}, callback = () => {}) {
  if (start === end) {
    callback([...path]);
    return;
  }

  const isUpper = (w) => [...w].every((l) => l === l.toUpperCase());
  visited[start] += isUpper(nodes[start]) ? 0 : 1;

  adjacent[start].forEach((item) => {
    const twoCave = !enableTwoCave || visited.filter(n => n >= 2).length > 0 ? 1 : 2;
    if (visited[item] < twoCave) {
      path.push(item);
      getPaths({
        start: item,
        end,
        nodes,
        adjacent,
        visited,
        path,
        enableTwoCave
      }, callback);

      path.splice(path.indexOf(item), 1);
    }
  });
  if (visited[start]) visited[start]--;
}

function calculatePaths(list, enableTwoCave = false) {
  const nodes = getNodes(list);
  const adjacent = getAdjacent(list, nodes);
  let result = [];
  getPaths({
    end: adjacent.length - 1,
    nodes,
    adjacent,
    enableTwoCave
  }, (path) => {
    result.push(path);
  });
  return result.map(row => row.map(n => nodes[n])).length;
}

function solution01(list) {
  return calculatePaths(list);
}

function solution02(list) {
  return calculatePaths(list, true);
}

read('./12/test01.txt').then((list) => {
  assert.deepEqual(solution01(list), 10);
  assert.deepEqual(solution02(list), 36);
});

read('./12/test02.txt').then((list) => {
  assert.deepEqual(solution01(list), 19);
  assert.deepEqual(solution02(list), 103);
});

read('./12/test03.txt').then((list) => {
  assert.deepEqual(solution01(list), 226);
  assert.deepEqual(solution02(list), 3509);
});

read('./12/input.txt').then((list) => {
  assert.deepEqual(solution01(list), 5756);
  assert.deepEqual(solution02(list), 144603);
});
