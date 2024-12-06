import assert from 'assert'
import read from '../../utils/read.js'

// Check if the report is safe with the given set of numbers
function isReportSafe(numbers) {
  const [first, second] = numbers
  const last = { value: first, direction: Math.sign(second - first) }

  // use `some` to exit early
  return !numbers.some((num, i) => {
    if (i === 0) return false

    const diff = num - last.value
    const direction = Math.sign(diff)

    if (Math.abs(diff) > 3 || last.direction !== direction || direction === 0)
      return true

    last.value = num
    last.direction = direction

    return false
  })
}

function solution01(list) {
  return list
    .map((line) => isReportSafe(line.split(' ').map(Number)))
    .filter(Boolean).length
}

function isFlexibleReportSafe(numbers) {
  if (isReportSafe(numbers)) return true

  // If report is unsafe, check if it can be made safe by removing one number
  return numbers.some((_, i) => {
    const newNumbers = [...numbers]

    newNumbers.splice(i, 1)

    return isReportSafe(newNumbers)
  })
}

function solution02(list) {
  return list
    .map((line) => isFlexibleReportSafe(line.split(' ').map(Number)))
    .filter(Boolean).length
}

read('test.txt').then((list) => {
  assert.deepEqual(solution01(list), 2)
  assert.deepEqual(solution02(list), 4)
})

read('input.txt').then((list) => {
  assert.deepEqual(solution01(list), 549)
  assert.deepEqual(solution02(list), 589)
})
