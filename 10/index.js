import assert from 'assert';
import read from '../utils/read.js';

const WRONG_POINTS = { ')': 3, ']': 57, '}': 1197, '>': 25137 };
const CLOSE_POINTS = { '(': 1, '[': 2, '{': 3, '<': 4 };
const OPENED = ['(', '[', '{', '<'];
const CLOSED = [')', ']', '}', '>'];

const isOpened = (letter) => OPENED.indexOf(letter) >= 0;
const isClosed = (letter) => CLOSED.indexOf(letter) >= 0;
const getOpening = (letter) => OPENED[CLOSED.indexOf(letter)];

function parseLine(line) {
  return [...line].reduce((prev, letter) => {
    if (typeof prev === 'string') return prev;
    if (isOpened(letter)) {
      return [...prev, letter];
    } else if (isClosed(letter)) {
      if (prev[prev.length - 1] === getOpening(letter)) {
        prev.splice(-1, 1);
        return prev;
      } else {
        return letter;
      }
    }
  }, []);
}

function solution01(list) {
  return list.reduce((points, line) => {
    const parsed = parseLine(line);
    if (typeof parsed === 'string') {
      return points + WRONG_POINTS[parsed];
    }
    return points;
  }, 0);
}

function solution02(list) {
  const scores = list.map((line) => parseLine(line))
    .filter((line) => typeof line !== 'string')
    .map((line) => {
      return line.reverse().reduce((total, letter) => {
        return total * 5 + CLOSE_POINTS[letter];
      }, 0);
    })
    .sortIntegers();

  return scores[Math.floor(scores.length / 2)];
}

read('./10/test.txt').then((list) => {
  assert.deepEqual(solution01(list), 26397);
  assert.deepEqual(solution02(list), 288957);
});

read('./10/input.txt').then((list) => {
  assert.deepEqual(solution01(list), 265527);
  assert.deepEqual(solution02(list), 3969823589);
});
