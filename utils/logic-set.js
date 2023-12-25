import assert from 'assert'

/**
 * takes two ranges `a`, and `b` and returns the range(s) from `b`
 * that are not in `a`.
 *
 * @param a
 * @param b
 * @returns {Array}
 */
export function subtractRanges(a, b) {
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
assert.deepEqual(subtractRanges([1, 2], [2, 3]), [[3, 3]])
assert.deepEqual(subtractRanges([1, 10], [5, 15]), [[11, 15]])
assert.deepEqual(subtractRanges([4, 6], [1, 10]), [
  [1, 3],
  [7, 10],
])

export function intersectRanges(a, b) {
  const [aStart, aEnd] = a
  const [bStart, bEnd] = b

  if (aStart <= bStart && aEnd >= bEnd) return b
  if (aStart <= bStart && aEnd <= bEnd) return [bStart, aEnd]
  if (aStart >= bStart && aEnd >= bEnd) return [aStart, bEnd]
  if (aStart >= bStart && aEnd <= bEnd) return a

  return []
}

assert.deepEqual(intersectRanges([1, 10], [4, 6]), [4, 6])
assert.deepEqual(intersectRanges([1, 2], [2, 3]), [2, 2])
assert.deepEqual(intersectRanges([1, 10], [5, 15]), [5, 10])
assert.deepEqual(intersectRanges([4, 6], [1, 10]), [4, 6])

export function calculateCombinations(ranges) {
  return ranges.map(([min, max]) => max - min + 1).multiplyAll()
}

assert.deepEqual(
  calculateCombinations([
    [1, 65],
    [1, 32],
    [1, 4],
  ]),
  8320
)
