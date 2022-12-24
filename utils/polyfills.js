import assert from 'assert'

const POLYFILLS = {
  sortIntegers() {
    Array.prototype.sortIntegers = function (dir = 1) {
      return this.sort((a, b) => (a - b) * dir)
    }
    const data = [3, 5, -1, 1]
    const result = [-1, 1, 3, 5]
    assert.deepEqual(data.sortIntegers(), result)
  },

  sumAll() {
    Array.prototype.sumAll = function () {
      return this.reduce((prev, val) => prev + parseInt(val, 10), 0)
    }
    assert.deepEqual([1, 2, 3, 4].sumAll(), 10)
  },

  multiplyAll() {
    Array.prototype.multiplyAll = function () {
      return this.reduce((prev, val) => prev * parseInt(val, 10), 1)
    }
    assert.deepEqual([1, 2, 3, 4].multiplyAll(), 24)
  },

  areDistinct() {
    Array.prototype.areDistinct = function () {
      const s = new Set()
      for (let i = 0; i < this.length; i++) {
        s.add(this[i])
      }
      return s.size === this.length
    }
    assert.deepEqual([1, 2, 3, 4].areDistinct(), true)
    assert.deepEqual([1, 2, 3, 3].areDistinct(), false)
  },

  // GCD / LCM block
  initGcdLcm() {
    function gcd2(a, b) {
      // Greatest common divisor of 2 integers
      if (!b) return b === 0 ? a : NaN
      return gcd2(b, a % b)
    }
    Array.prototype.gcd = function () {
      // Greatest common divisor of a list of integers
      let n = 0
      for (let i = 0; i < this.length; ++i) n = gcd2(this[i], n)
      return n
    }

    function lcm2(a, b) {
      // Least common multiple of 2 integers
      return (a * b) / gcd2(a, b)
    }
    Array.prototype.lcm = function () {
      // Least common multiple of a list of integers
      let n = 1
      for (let i = 0; i < this.length; ++i) n = lcm2(this[i], n)
      return n
    }
  },

  reduceBlock() {
    Array.prototype.reduceBlock = function () {
      return this.reduce((prev, block) => {
        if (!prev.length) return [{ block, count: 1 }]
        if (block === '') return [...prev, { block, count: 0 }]
        const last = prev[prev.length - 1]
        // eslint-disable-next-line no-param-reassign
        prev[prev.length - 1] = {
          block: `${last.block}${block}`,
          count: last.count + 1,
        }
        return prev
      }, [])
    }
    const data = ['a', 'b', '', 'b']
    const result = [
      { block: 'ab', count: 2 },
      { block: 'b', count: 1 },
    ]
    assert.deepEqual(data.reduceBlock(), result)
  },

  are2DSame() {
    Array.prototype.are2DSame = function (arr) {
      function transform(o) {
        return o.map((e) => e.join('')).join('')
      }
      return transform(this) === transform(arr)
    }
    const data = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ]
    const result = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ]
    assert.deepEqual(data.are2DSame(result), true)
  },

  radian() {
    Number.prototype.radian = function () {
      return this * (Math.PI / 180)
    }
    assert.deepEqual((90).radian(), Math.PI / 2)
    assert.deepEqual((270).radian(), (3 * Math.PI) / 2)
  },

  toNumber() {
    Array.prototype.toNumber = function () {
      return this.map((item) => parseInt(item, 10))
    }
    assert.deepEqual(['1', '2', '3'].toNumber(), [1, 2, 3])
  },

  flat2DMatrix() {
    Array.prototype.flat2DMatrix = function () {
      // eslint-disable-next-line prefer-spread
      return [].concat.apply([], this)
    }
    const data = [
      [1, 2, 3],
      [4, 5],
      [6, 7],
    ]
    const result = [1, 2, 3, 4, 5, 6, 7]
    assert.deepEqual(data.flat2DMatrix(), result)
  },

  nMatrix() {
    Array.prototype.nMatrix = function (n, fill = 0) {
      return [...Array(n).keys()].fill(fill)
    }
    assert.deepEqual([].nMatrix(2), [0, 0])
    assert.deepEqual([].nMatrix(2, 'n'), ['n', 'n'])
  },

  nm2DMatrix() {
    Array.prototype.nm2DMatrix = function (n, m = n, fill = 0) {
      return Array.from({ length: n }, () => new Array(m).fill(fill))
    }
    assert.deepEqual([].nm2DMatrix(3, 2), [
      [0, 0],
      [0, 0],
      [0, 0],
    ])
    assert.deepEqual([].nm2DMatrix(1, 2, 'n'), [['n', 'n']])
  },

  n2DMatrix() {
    Array.prototype.n2DMatrix = function (n, fill = 0) {
      return this.nm2DMatrix(n, n, fill)
    }
    assert.deepEqual([].n2DMatrix(2), [
      [0, 0],
      [0, 0],
    ])
    assert.deepEqual([].n2DMatrix(2, 'n'), [
      ['n', 'n'],
      ['n', 'n'],
    ])
  },

  sumNMatrix() {
    Array.prototype.sumNMatrix = function (arr) {
      return this.map(function (num, idx) {
        return num + arr[idx]
      })
    }
    assert.deepEqual([1, 2, 3].sumNMatrix([4, 5, 6]), [5, 7, 9])
  },

  range() {
    Array.prototype.range = function (n, m) {
      if (!m) {
        return Array.from(new Array(n), (noop, i) => i)
      }
      return Array.from(new Array(m - n), (noop, i) => i + n)
    }
    assert.deepEqual([].range(5), [0, 1, 2, 3, 4])
    assert.deepEqual([].range(1, 5), [1, 2, 3, 4])
  },

  getNumbers() {
    String.prototype.getNumbers = function () {
      return this.match(/[0-9]+/g).toNumber()
    }
    assert.deepEqual('10R5L5R'.getNumbers(), [10, 5, 5])
  },

  getLetters() {
    String.prototype.getLetters = function () {
      return this.match(/[a-zA-Z]+/g)
    }
    assert.deepEqual('10R5L5R'.getLetters(), ['R', 'L', 'R'])
  },
}

Object.keys(POLYFILLS).forEach((funcName) => POLYFILLS[funcName]())
