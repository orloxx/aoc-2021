import assert from 'assert';

// delta = [x1, x2] or [y1, y2]
function getState(Vi, [d1, d2]) {
  let V = Vi;
  let t = 0;
  let i = 0;
  let a = -1;
  let max = 0;
  let times = [];
  const vertical = i > d2;

  while (vertical ? i > d1 : V > 0) {
    if (vertical ? i >= d1 && i <= d2 : i >= d1 && i <= d2) {
      times.push(t);
    }

    i += V;
    t++;
    V += a;
    max = Math.max(max, i);
  }

  if (vertical ? i >= d1 && i <= d2 : i >= d1 && i <= d2) {
    times.push(t);
  }

  return { Vi, t, max, times };
}

// target = [[x1, x2], [y1, y2]]
function solution01(target) {
  const [, deltaY] = target;

  let state = {};
  let max = 0;
  for (let i = 0; i < 100; i++) {
    state = getState(i, deltaY);
    if (state.times.length) {
      max = Math.max(max, state.max);
    }
  }

  return max;
}

function isTargetHit(X, Y) {
  if (X.times.some(x => Y.times.some(y => x === y))) return true;
  return X.t === X.times[X.times.length - 1] && X.t <= Y.t;

}

function solution02(target) {
  const [deltaX, deltaY] = target;

  const size = 250;
  const vel = [];
  for (let i = 0; i < size; i++) {
    const stateX = getState(i, deltaX);
    const { times: tx } = stateX;
    if (tx.length) {
      for (let j = deltaY[0]; j < size; j++) {
        const stateY = getState(j, deltaY);
        const { times: ty } = stateY;
        if (ty.length && isTargetHit(stateX, stateY)) {
          vel.push([stateX, stateY]);
        }
      }
    }
  }

  return vel.length;
}

const test = [[20, 30], [-10, -5]];
assert.deepEqual(solution01(test), 45);
assert.deepEqual(solution02(test), 112);

// Input puzzle
const input = [[209, 238], [-86, -59]];
assert.deepEqual(solution01(input), 3655);
assert.deepEqual(solution02(input), 1447);
