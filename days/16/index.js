import assert from 'assert'
import read from '../../utils/read.js'

class Valves {
  constructor(list) {
    const tree = list.reduce((acc, line) => {
      const [valveInfo, tunnelsInfo] = line.split(';')
      const [valve] = valveInfo.match(/[A-Z]{2}/g)
      const [pressure] = valveInfo.match(/-?\d*\.?\d+/g).toNumber()
      const tunnel = tunnelsInfo.match(/[A-Z]{2}/g)
      return { ...acc, [valve]: { pressure, tunnel, key: valve } }
    }, {})

    this.tree = tree

    Object.keys(tree).forEach((key) => {
      tree[key].distance = this.calculateDistance(key)
    })
  }

  get vertices() {
    return Object.keys(this.tree).map((key) => ({ ...this.tree[key] }))
  }

  get active() {
    return this.vertices.filter(({ pressure }) => pressure > 0)
  }

  get edges() {
    return this.vertices.reduce((acc, curr) => {
      return [
        ...acc,
        ...curr.tunnel.reduce((acc00, vertex) => {
          return [...acc00, [curr.key, vertex]]
        }, []),
      ]
    }, [])
  }

  getTunnel(key) {
    return this.tree[key].tunnel
  }

  calculateDistance(start) {
    const distances = {}

    const step = (name, distance) => {
      if (typeof distances[name] !== 'undefined' && distances[name] <= distance)
        return
      distances[name] = distance
      this.getTunnel(name).forEach((n) => step(n, distance + 1))
    }
    step(start, 0)

    return distances
  }

  static getTime({ current, activeValve }) {
    return current.time - current.distance[activeValve.key] - 1
  }

  openValves(mins = 30, people = 1) {
    const active = this.active
    const initial = () => ({ active, done: false, time: mins, ppm: 0 })
    const states = [{ ...this.tree.AA, ...initial() }]

    // loop through state
    for (let i = 0; i < states.length; i++) {
      const current = states[i]

      if (current.time <= 0) current.done = true

      if (!current.done) {
        // loop through active valves
        const pushed = current.active
          .filter(
            (activeValve) =>
              activeValve.key !== current.key &&
              Valves.getTime({ current, activeValve }) > 1
          )
          .reduce((acc, activeValve) => {
            const time = Valves.getTime({ current, activeValve })

            states.push({
              ...this.tree[activeValve.key],
              ...initial(),
              time,
              active: current.active.filter(
                ({ key }) => key !== activeValve.key
              ),
              ppm: current.ppm + time * this.tree[activeValve.key].pressure,
            })

            return true
          }, false)

        if (!pushed) current.done = true
      }
    }

    return states.filter(({ done }) => done).sort((a, b) => b.ppm - a.ppm)
  }
}

function solution01(list) {
  const valves = new Valves(list)
  const [valve] = valves.openValves()

  return valve.ppm
}

function solution02(list) {
  const valves = new Valves(list)
  const [valve] = valves.openValves(26, 2)

  return valve.ppm
}

read('test.txt').then((list) => {
  assert.deepEqual(solution01(list), 1651)
  // assert.deepEqual(solution02(list), 1707)
})

read('input.txt').then((list) => {
  assert.deepEqual(solution01(list), 1792)
  // assert.deepEqual(solution02(list), 2000)
})
