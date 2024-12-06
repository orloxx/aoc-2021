import assert from 'assert'
import read from '../../utils/read.js'

function getSeparateLists(list) {
  return list.reduce(
    (acc, curr) => {
      const [n1, n2] = curr.split(/\s+/).map(Number)
      const [acc1, acc2] = acc

      return [
        [...acc1, n1],
        [...acc2, n2],
      ]
    },
    [[], []]
  )
}

function solution01(list) {
  const [list1, list2] = getSeparateLists(list)

  list1.sort()
  list2.sort()

  return list1.reduce((acc, curr, i) => {
    return acc + Math.abs(curr - list2[i])
  }, 0)
}

function solution02(list) {
  const [list1, list2] = getSeparateLists(list)

  return list1.reduce((acc, curr1) => {
    const similarity = curr1 * list2.filter((curr2) => curr1 === curr2).length
    return acc + similarity
  }, 0)
}

read('test.txt').then((list) => {
  assert.deepEqual(solution01(list), 11)
  assert.deepEqual(solution02(list), 31)
})

read('input.txt').then((list) => {
  assert.deepEqual(solution01(list), 1603498)
  assert.deepEqual(solution02(list), 25574739)
})
