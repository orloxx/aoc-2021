// eslint-disable-next-line max-classes-per-file
import assert from 'assert'
import read from '../../utils/read.js'

class TestReceiver {
  constructor(label) {
    this.label = label
  }
}

class InputType {
  constructor(receivers) {
    this.receivers = receivers.split(',').map((receiver) => receiver.trim())
  }

  updateReceivers(circuit) {
    this.receivers = this.receivers.map(
      (receiver) => circuit[receiver] || new TestReceiver(receiver)
    )
  }
}

class Button extends InputType {}

class Broadcaster extends InputType {}

class FlipFlop extends InputType {}

class Conjunction extends InputType {}

function solution01(list) {
  const circuit = list.reduce(
    (acc, line) => {
      const [input, receivers] = line.split(' -> ')

      if (input === 'broadcaster')
        return { ...acc, [input]: new Broadcaster(receivers) }
      if (input.includes('%'))
        return { ...acc, [input.replace('%', '')]: new FlipFlop(receivers) }
      if (input.includes('&'))
        return {
          ...acc,
          [input.replace('&', '')]: new Conjunction(receivers),
        }

      return acc
    },
    { button: new Button('broadcaster') }
  )

  Object.values(circuit).forEach((value) => value.updateReceivers(circuit))

  return 0
}

function solution02(list) {}

read('test.txt').then((list) => {
  assert.deepEqual(solution01(list), 32000000)
  // assert.deepEqual(solution02(list), 167409079868000)
})

read('input.txt').then((list) => {
  // assert.deepEqual(solution01(list), 434147)
  // assert.deepEqual(solution02(list), 136146366355609)
})
