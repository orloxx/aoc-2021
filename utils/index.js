export function compareArrays(o1, o2) {
  if (typeof o1 === 'number' && typeof o2 === 'number') {
    const rest = o2 - o1
    if (rest === 0) return rest
    return rest / Math.abs(rest)
  }
  const [one, two] = [
    typeof o1 === 'number' ? [o1] : o1,
    typeof o2 === 'number' ? [o2] : o2,
  ]

  for (let i = 0; i < one.length; i++) {
    if (typeof two[i] === 'undefined') return -1

    const valid = compareArrays(one[i], two[i])

    if (valid !== 0) return valid
  }

  if (one.length < two.length) return 1
  return 0
}
