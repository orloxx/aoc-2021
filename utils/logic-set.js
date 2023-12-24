import assert from 'assert'

/**
 * takes two ranges `a`, and `b` and returns the range(s) from `b`
 * that are not in `a`.
 *
 * @param a
 * @param b
 * @returns {Array}
 */
function subtractRanges(a, b) {
  const [aStart, aEnd] = a
  const [bStart, bEnd] = b

  if (aStart <= bStart && aEnd >= bEnd) return []
  if (aStart <= bStart && aEnd <= bEnd) return [[aEnd + 1, bEnd]]
  if (aStart >= bStart && aEnd >= bEnd) return [[bStart, aStart - 1]]
  if (aStart >= bStart && aEnd <= bEnd)
    return [
      [bStart, aStart - 1],
      [aEnd + 1, bEnd],
    ]

  return []
}

assert.deepEqual(subtractRanges([1, 10], [4, 6]), [])
assert.deepEqual(subtractRanges([1, 10], [5, 15]), [[11, 15]])
assert.deepEqual(subtractRanges([4, 6], [1, 10]), [
  [1, 3],
  [7, 10],
])

/**
 * Function that takes a list of ranges and returns
 */
