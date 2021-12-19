import assert from 'assert';
import read from '../../utils/read.js';

class SnailNumber{
  constructor([l, r], parent = null) {
    this.parent = parent;

    if (typeof l === 'object') {
      this.l = new SnailNumber(l, this);
    } else {
      this.l = l;
    }

    if (typeof r === 'object') {
      this.r = new SnailNumber(r, this);
    } else {
      this.r = r;
    }
  }

  get magnitude() {
    if (this.l instanceof SnailNumber && this.r instanceof SnailNumber) {
      return 3 * this.l.magnitude + 2 * this.r.magnitude;
    } else if (this.l instanceof SnailNumber) {
      return 3 * this.l.magnitude + 2 * this.r;
    } else if (this.r instanceof SnailNumber) {
      return 3 * this.l + 2 * this.r.magnitude;
    }
    return 3 * this.l + 2 * this.r;
  }


  get arrayify() {
    return [
      this.l instanceof SnailNumber ? this.l.arrayify : this.l,
      this.r instanceof SnailNumber ? this.r.arrayify : this.r
    ];
  }

  set innerLeft(n) {
    if (this.l instanceof SnailNumber) this.l.innerLeft = n;
    else this.l += n;
  }

  set innerRight(n) {
    if (this.r instanceof SnailNumber) this.r.innerRight = n;
    else this.r += n;
  }

  set outerLeft(n) {
    if (!this.parent) return;
    if (this.parent.l === this) this.parent.outerLeft = n;
    else if (this.parent.r === this) {
      if (this.parent.l instanceof SnailNumber) this.parent.l.innerRight = n;
      else this.parent.l += n;
    }
  }

  set outerRight(n) {
    if (!this.parent) return;
    if (this.parent.r === this) this.parent.outerRight = n;
    else if (this.parent.l === this) {
      if (this.parent.r instanceof SnailNumber) this.parent.r.innerLeft = n;
      else this.parent.r += n;
    }
  }

  get main() {
    if (this.parent) return this.parent.main;
    return this;
  }

  explode(level = 0) {
    if (level === 0 && this.parent) {
      this.parent.explode();
      return;
    }

    if (level === 4) {
      this.outerLeft = this.l;
      this.outerRight = this.r;

      if (this.parent.l === this) this.parent.l = 0;
      else if (this.parent.r === this) this.parent.r = 0;

      return;
    }

    if (this.l instanceof SnailNumber) {
      this.l.explode(level + 1);
    }

    if (this.r instanceof SnailNumber) {
      this.r.explode(level + 1);
    }
  }

  split() {
    if (this.l instanceof SnailNumber) {
      this.l.split();
    } else if (this.l > 9) {
      const l = this.l / 2;
      this.l = new SnailNumber([Math.floor(l), Math.ceil(l)], this);
      this.main.reduce();
    }

    if (this.r instanceof SnailNumber) {
      this.r.split();
    } else if (this.r > 9) {
      const r = this.r / 2;
      this.r = new SnailNumber([Math.floor(r), Math.ceil(r)], this);
      this.main.reduce();
    }
  }

  needsLeftExplode(level = 0) {
    if (this.l instanceof SnailNumber)
      return this.l.needsExplode(level + 1);
    return level === 4;
  }

  needsRightExplode(level = 0) {
    if (this.r instanceof SnailNumber)
      return this.r.needsExplode(level + 1);
    return level === 4;
  }

  needsExplode(level = 0) {
    return this.needsLeftExplode(level) || this.needsRightExplode(level);
  }

  needsLeftSplit() {
    if (this.l instanceof SnailNumber)
      return this.l.needsSplit();
    return this.l > 9;
  }

  needsRightSplit() {
    if (this.r instanceof SnailNumber)
      return this.r.needsSplit();
    return this.r > 9;
  }

  needsSplit() {
    return this.needsLeftSplit() || this.needsRightSplit();
  }

  reduce() {
    if (this.parent) return;
    while (this.needsExplode() || this.needsSplit()) {
      this.explode();
      this.split();
    }
  }
}

function reduce(num) {
  const tree = new SnailNumber(num);
  tree.reduce();
  return tree.arrayify;
}

function sumAll(list) {
  return list.map((e) => JSON.parse(e))
    .reduce((prev, curr) => {
      if (!prev) return reduce(curr);
      // Snailfish sum
      return reduce([prev, curr]);
    }, null);
}

function solution01(list) {
  const sum = sumAll(list);
  const tree = new SnailNumber(sum);
  return tree.magnitude;
}

function solution02(list) {
  return list.reduce((prev, curr, i) => {
    return Math.max(prev, list.reduce((p, c, j) => {
      const sum = sumAll([list[i], list[j]]);
      const tree = new SnailNumber(sum);
      return Math.max(p, tree.magnitude);
    }, 0));
  }, 0);
}

assert.deepEqual(sumAll(['[[3,[2,[1,[7,3]]]],[6,[5,[4,[3,2]]]]]']), [[3,[2,[8,0]]],[9,[5,[7,0]]]]);
assert.deepEqual(sumAll(['[[[[4,3],4],4],[7,[[8,4],9]]]', '[1,1]']), [[[[0,7],4],[[7,8],[6,0]]],[8,1]]);

assert.deepEqual(solution01(['[[9,1],[1,9]]']), 129);
assert.deepEqual(solution01(['[[1,2],[[3,4],5]]']), 143);
assert.deepEqual(solution01(['[[[[0,7],4],[[7,8],[6,0]]],[8,1]]']), 1384);
assert.deepEqual(solution01(['[[[[1,1],[2,2]],[3,3]],[4,4]]']), 445);
assert.deepEqual(solution01(['[[[[3,0],[5,3]],[4,4]],[5,5]]']), 791);
assert.deepEqual(solution01(['[[[[5,0],[7,4]],[5,5]],[6,6]]']), 1137);
assert.deepEqual(solution01(['[[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]]']), 3488);

read('./18/test01.txt').then((list) => {
  assert.deepEqual(sumAll(list), [[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]]);
  assert.deepEqual(solution01(list), 3488);
  assert.deepEqual(solution02(list), 3946);
});

read('./18/test02.txt').then((list) => {
  assert.deepEqual(sumAll(list), [[[[6,6],[7,6]],[[7,7],[7,0]]],[[[7,7],[7,7]],[[7,8],[9,9]]]]);
  assert.deepEqual(solution01(list), 4140);
  assert.deepEqual(solution02(list), 3993);
});

read('./18/input.txt').then((list) => {
  assert.deepEqual(sumAll(list),  [[[[6,6],[7,7]],[[7,7],[7,0]]],[[[7,7],[7,7]],[[8,7],[7,8]]]]);
  assert.deepEqual(solution01(list), 4124);
  assert.deepEqual(solution02(list), 4673);
});
