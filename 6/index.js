import assert from 'assert';
import read from '../utils/read.js';

function generate(list, days) {
  let school = list[0].split(',')
    .map((fish) => parseInt(fish, 10));

  let hash = school
    .reduce((prev, fish) => ({
      ...prev,
      [fish]: prev[fish] ? ++prev[fish] : 1
    }), {});

  for (let i = 0; i < days; i++) {
    for (let day = 0; day <= 9; day++) {
      hash[`${day - 1}`] = hash[`${day}`] || 0;
    }

    if (hash['-1']) {
      hash['6'] = hash['6'] ? hash['6'] + hash['-1'] : hash['-1'];
      hash['8'] = hash['-1'];
      hash['-1'] = 0;
    }
  }

  return Object.keys(hash)
    .filter((h) => h !== '-1')
    .reduce((prev, curr) => {
      return prev + hash[curr];
    }, 0);
}

function solution01(list) {
  return generate(list, 80);
}

function solution02(list) {
  return generate(list, 256);
}

read('./6/test.txt').then((list) => {
  assert.deepEqual(solution01(list), 5934);
  assert.deepEqual(solution02(list), 26984457539);
});

read('./6/input.txt').then((list) => {
  assert.deepEqual(solution01(list), 358214);
  assert.deepEqual(solution02(list), 1622533344325);
});
