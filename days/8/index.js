import assert from 'assert';
import read from '../../utils/read.js';

function solution01(list) {
  return list.reduce((prev, curr) => {
    const [, right] = curr.split(' | ');
    const segments = right.split(' ')
      .filter((s) => s.length === 2 || s.length === 3
        || s.length === 4 || s.length === 7)
    return prev + segments.length;
  }, 0);
}

function fillUniques(ls) {
  return ls.reduce((prev, s) => {
    if (s.length === 2) prev[1] = s;
    else if (s.length === 3) prev[7] = s;
    else if (s.length === 4) prev[4] = s;
    else if (s.length === 7) prev[8] = s;
    return prev;
  }, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
}

function fillThree(ls, locked) {
  return ls.reduce((prev, s) => {
    if (s.length === 5 && [...locked[1]].every((letter) => s.indexOf(letter) >= 0)) {
      prev[3] = s;
    }
    return prev;
  }, locked);
}

function fillSix(ls, locked) {
  return ls.reduce((prev, s) => {
    if (s.length === 6 && ![...locked[1]].every((letter) => s.indexOf(letter) >= 0)) {
      prev[6] = s;
    }
    return prev;
  }, locked);
}

function fillFiveAndTwo(ls, locked) {
  return ls.reduce((prev, s) => {
    if (s.length === 5 && s !== prev[3]) {
      if ([...s].every((letter) => locked[6].indexOf(letter) >= 0)) {
        prev[5] = s;
      } else {
        prev[2] = s;
      }
    }
    return prev;
  }, locked);
}

function fillNineAndZero(ls, locked) {
  return ls.reduce((prev, s) => {
    if (s.length === 6 && s !== prev[6]) {
      if ([...locked[3]].every((letter) => s.indexOf(letter) >= 0)) {
        prev[9] = s;
      } else {
        prev[0] = s;
      }
    }
    return prev;
  }, locked);
}

function solution02(list) {
  return list.reduce((prev, line) => {
    const [left, right] = line.split(' | ');
    const ls = left.split(' ');
    const rs = right.split(' ');
    let n = fillUniques(ls);

    n = fillThree(ls, n);
    n = fillSix(ls, n);
    n = fillFiveAndTwo(ls, n);
    n = fillNineAndZero(ls, n);

    const rn = rs.reduce((p, curr) => {
      const index = n.findIndex((s) => s.length === curr.length &&
        [...s].every((letter) => curr.indexOf(letter) >= 0));
      return `${p}${index}`;
    }, '');

    return prev + parseInt(rn, 10);
  }, 0);
}

read('./8/test.txt').then((list) => {
  assert.deepEqual(solution01(list), 26);
  assert.deepEqual(solution02(list), 61229);
});

read('./8/input.txt').then((list) => {
  assert.deepEqual(solution01(list), 416);
  assert.deepEqual(solution02(list), 1043697);
});
