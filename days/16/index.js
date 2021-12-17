import assert from 'assert';
import read from '../../utils/read.js';

class Node {
  constructor(binary, id, parent) {
    this.tail = binary;
    this.id = id;
    this.parent = parent;
    this.versionBinary = binary.slice(0, 3);
    this.version = parseInt(this.versionBinary, 2);
    this.typeIDBinary = binary.slice(3, 6);
    this.typeID = parseInt(this.typeIDBinary, 2);
    this.cursor = 6;

    if (this.isLiteral) {
      this.literal = this.getLiteral();
      this.cursor = this.literal.i;
    } else {
      const lengthTypeId = parseInt(this.tail[0], 2);

      if (lengthTypeId === 0) {
        this.totalLength = parseInt(this.tail.slice(1, 16), 2);
        this.cursor = 16;
      } else {
        this.packetLength = parseInt(this.tail.slice(1, 12), 2);
        this.cursor = 12;
      }
    }
  }

  set cursor(cursor) {
    this.tail = this.tail.slice(cursor);
  }

  get isLiteral() {
    return this.typeID === 4;
  }

  get isOperator() {
    return !this.isLiteral;
  }

  getLiteral() {
    let i = 0;
    let binary = '';
    do {
      binary += this.tail.slice(i + 1, i + 5);
      i += 5;
    } while (this.tail[i - 5] !== '0');

    return { binary, i, value: parseInt(binary, 2) };
  }
}

class TreeHandler {
  constructor(binary) {
    this.parsed = '';
    this.tail = binary;
    this.tree = [];

    this.next();
  }

  get zeroTail() {
    return [...this.tail].every(n => n === '0');
  }

  get parent() {
    if (!this.tree.length) return -1;
    return this.tree.filter(n => n.isOperator && this.hasSpace(n))
      .map(n => n.id).pop();
  }

  getSpace(node) {
    if (node.isLiteral) return node.literal.i + 6;
    return this.tree.filter(n => n.parent === node.id)
      .reduce((prev, curr) => {
        let offset = 0;
        if (curr.totalLength) offset = 22;
        else if (curr.packetLength) offset = 18;
        return prev + this.getSpace(curr) + offset;
      }, 0);
  }

  hasSpace(node) {
    const children = this.tree.filter(n => n.parent === node.id);

    return (node.totalLength && node.totalLength > this.getSpace(node))
      || (node.packetLength && node.packetLength > children.length);
  }

  next() {
    if (this.zeroTail) return;

    const node = new Node(this.tail, this.tree.length, this.parent);
    this.tail = node.tail;
    this.tree.push(node);

    this.next();
  }

  sumVersions() {
    return this.tree.reduce((prev, curr) => {
      return prev + curr.version;
    }, 0);
  }

  operate(main = this.tree[0]) {
    const children = this.tree.filter(n => n.parent === main.id);

    switch (main.typeID) {
      // sum
      case 0:
        return children.reduce((prev, curr) => {
          return prev + this.operate(curr);
        }, 0);
      // product
      case 1:
        return children.reduce((prev, curr) => {
          return prev * this.operate(curr);
        }, 1);
      // min
      case 2:
        return children.reduce((prev, curr) => {
          return Math.min(prev, this.operate(curr));
        }, Infinity);
      // max
      case 3:
        return children.reduce((prev, curr) => {
          return Math.max(prev, this.operate(curr));
        }, 0);
      // greater than
      case 5:
        return this.operate(children[0]) > this.operate(children[1]) ? 1 : 0;
      // lower than
      case 6:
        return this.operate(children[0]) < this.operate(children[1]) ? 1 : 0;
      // equal than
      case 7:
        return this.operate(children[0]) === this.operate(children[1]) ? 1 : 0;
      // is literal
      default:
        return main.literal.value;
    }
  }
}

function getBinary(hex) {
  return [...hex].reduce((prev, letter) => {
    const binary = parseInt(letter, 16).toString(2);
    const prefix = [].nMatrix(4 - binary.length).join('');
    return `${prev}${prefix}${binary}`;
  }, '');
}

function solution01(list) {
  const binary = getBinary(list[0]);
  const treeHandler = new TreeHandler(binary);
  return treeHandler.sumVersions();
}

function solution02(list) {
  const binary = getBinary(list[0]);
  const treeHandler = new TreeHandler(binary);
  return treeHandler.operate();
}

assert.deepEqual(solution01(['D2FE28']), 6);
assert.deepEqual(solution01(['38006F45291200']), 9);
assert.deepEqual(solution01(['EE00D40C823060']), 14);
assert.deepEqual(solution01(['8A004A801A8002F478']), 16);
assert.deepEqual(solution01(['620080001611562C8802118E34']), 12);
assert.deepEqual(solution01(['C0015000016115A2E0802F182340']), 23);
assert.deepEqual(solution01(['A0016C880162017C3686B18A3D4780']), 31);

assert.deepEqual(solution02(['C200B40A82']), 3);
assert.deepEqual(solution02(['04005AC33890']), 54);
assert.deepEqual(solution02(['880086C3E88112']), 7);
assert.deepEqual(solution02(['CE00C43D881120']), 9);
assert.deepEqual(solution02(['D8005AC2A8F0']), 1);
assert.deepEqual(solution02(['F600BC2D8F']), 0);
assert.deepEqual(solution02(['9C005AC2F8F0']), 0);
assert.deepEqual(solution02(['9C0141080250320F1802104A08']), 1);

read('./16/input.txt').then((list) => {
  assert.deepEqual(solution01(list), 860);
  assert.deepEqual(solution02(list), 470949537659);
});
