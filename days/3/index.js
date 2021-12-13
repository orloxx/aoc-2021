import assert from 'assert';
import read from '../../utils/read.js';

function getZeroesAndOnes(list) {
  return list.reduce((prev, curr) => {
    [...curr].forEach((digit, i) => {
      if (!prev.zeroes[i]) prev.zeroes[i] = 0;
      if (!prev.ones[i]) prev.ones[i] = 0;

      if (digit === '0') prev.zeroes[i]++;
      else prev.ones[i]++;
    });
    return prev;
  }, { ones: [], zeroes: [] });
}

function solution01(list) {
  const prepare = getZeroesAndOnes(list);

  const calc = prepare.ones.reduce((prev, oneDigits, i) => {
    const zeroDigits = prepare.zeroes[i];
    if (oneDigits > zeroDigits) {
      return { gamma: `${prev.gamma}1`, epsilon: `${prev.epsilon}0` };
    }
    return { gamma: `${prev.gamma}0`, epsilon: `${prev.epsilon}1` };
  }, { gamma: '', epsilon: '' });

  return parseInt(calc.gamma, 2) * parseInt(calc.epsilon, 2);
}

function getParticles(list, check = ['1', '0'], i = 0) {
  if (list.length === 1) return list[0];

  const [first, second] = check;
  const prepare = getZeroesAndOnes(list);

  if (prepare.ones[i] >= prepare.zeroes[i]) {
    return getParticles(list.filter((value) => [...value][i] === first), check, ++i);
  }
  return getParticles(list.filter((value) => [...value][i] === second), check, ++i);
}

function solution02(list) {
  const oxygen = getParticles(list);
  const co2 = getParticles(list, ['0', '1']);

  return parseInt(oxygen, 2) * parseInt(co2, 2);
}

read('./3/test.txt').then((list) => {
  assert.deepEqual(solution01(list), 198);
  assert.deepEqual(solution02(list), 230);
});

read('./3/input.txt').then((list) => {
  assert.deepEqual(solution01(list), 3882564);
  assert.deepEqual(solution02(list), 3385170);
});
