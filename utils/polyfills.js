import assert from 'assert';

(function() {
  Array.prototype.sortIntegers = function(dir = 1) {
    return this.sort((a, b) => (a - b) * dir);
  };
  const data = [3, 5, -1, 1];
  const result = [-1, 1, 3, 5];
  assert.deepEqual(data.sortIntegers(), result);
})();

(function() {
  Array.prototype.sumAll = function() {
    return this.reduce((prev, val) => prev + parseInt(val, 10), 0);
  };
  assert.deepEqual([1, 2, 3, 4].sumAll(), 10);
})();

// GCD / LCM block
(function() {
  function gcd2(a, b) {
    // Greatest common divisor of 2 integers
    if(!b) return b===0 ? a : NaN;
    return gcd2(b, a%b);
  }
  Array.prototype.gcd = function () {
    // Greatest common divisor of a list of integers
    let n = 0;
    for(let i=0; i<this.length; ++i)
      n = gcd2(this[i], n);
    return n;
  };

  function lcm2(a, b) {
    // Least common multiple of 2 integers
    return a*b / gcd2(a, b);
  }
  Array.prototype.lcm = function () {
    // Least common multiple of a list of integers
    let n = 1;
    for(let i=0; i<this.length; ++i)
      n = lcm2(this[i], n);
    return n;
  };
})();

(function() {
  Array.prototype.reduceBlock = function () {
    return this.reduce((prev, block) => {
      if (!prev.length) return [{block, count: 1}];
      if (block === '') return [...prev, {block, count: 0}];
      let last = prev[prev.length - 1];
      prev[prev.length - 1] = {block: `${last.block}${block}`, count: last.count + 1};
      return prev;
    }, []);
  };
  const data = ['a', 'b', '', 'b'];
  const result = [{ block: 'ab', count: 2 }, { block: 'b', count: 1 }];
  assert.deepEqual(data.reduceBlock(), result);
})();

(function() {
  Array.prototype.are2DSame = function (arr) {
    function transform(o) {
      return o.map(e => e.join('')).join('');
    }
    return transform(this) === transform(arr);
  };
  const data = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
  const result = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
  assert.deepEqual(data.are2DSame(result), true);
})();

(function() {
  Number.prototype.radian = function () {
    return this * (Math.PI / 180);
  };
  assert.deepEqual((90).radian(), Math.PI / 2);
  assert.deepEqual((270).radian(), 3 * Math.PI / 2);
})();

(function() {
  Array.prototype.toNumber = function () {
    return this.map(item => parseInt(item, 10));
  };
  assert.deepEqual(['1', '2', '3'].toNumber(), [1, 2, 3]);
})();

(function() {
  Array.prototype.flat2DMatrix = function () {
    return [].concat.apply([], this);
  };
  const data = [[1, 2, 3], [4, 5], [6, 7]];
  const result = [1, 2, 3, 4, 5, 6, 7];
  assert.deepEqual(data.flat2DMatrix(), result);
})();

(function() {
  Array.prototype.nMatrix = function (n, fill = 0) {
    return [...Array(n).keys()].fill(fill);
  };
  assert.deepEqual([].nMatrix(2), [0, 0]);
  assert.deepEqual([].nMatrix(2, 'n'), ['n', 'n']);
})();

(function() {
  Array.prototype.n2DMatrix = function (n, fill = 0) {
    return Array.from({
      length: n
    }, () => new Array(n).fill(fill));
  };
  assert.deepEqual([].n2DMatrix(2), [[0, 0], [0, 0]]);
  assert.deepEqual([].n2DMatrix(2, 'n'), [['n', 'n'], ['n', 'n']]);
})();
