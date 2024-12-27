/* eslint-disable no-bitwise */

class Computer {
  #A

  #B

  #C

  #program

  #pointer = 0

  #output = []

  constructor({ A, B, C, program }) {
    this.#A = BigInt(A)
    this.#B = BigInt(B)
    this.#C = BigInt(C)
    this.#program = program
  }

  get #instruction() {
    return this.#program[this.#pointer]
  }

  #runInstruction(op) {
    if (this.#instruction === 0) this.#adv(op)
    else if (this.#instruction === 1) this.#bxl(op)
    else if (this.#instruction === 2) this.#bst(op)
    else if (this.#instruction === 3) this.#jnz(op)
    else if (this.#instruction === 4) this.#bxc(op)
    else if (this.#instruction === 5) this.#out(op)
    else if (this.#instruction === 6) this.#bdv(op)
    else if (this.#instruction === 7) this.#cdv(op)
    else throw new Error('Invalid instruction')
  }

  #getOperand(op) {
    if (op < 0 || op > 6) throw new Error('Invalid operand')

    if (op === 4) return this.#A
    if (op === 5) return this.#B
    if (op === 6) return this.#C

    return BigInt(op)
  }

  /**
   * 0
   * The adv instruction (opcode 0) performs division. The numerator is the value
   * in the A register. The denominator is found by raising 2 to the power of the
   * instruction's combo operand. (So, an operand of 2 would divide A by 4 (2^2);
   * an operand of 5 would divide A by 2^B.) The result of the division operation
   * is truncated to an integer and then written to the A register.
   */
  #adv(op) {
    this.#A /= 2n ** this.#getOperand(op)
  }

  /**
   * 1
   * The bxl instruction (opcode 1) calculates the bitwise XOR of register B and
   * the instruction's literal operand, then stores the result in register B.
   */
  #bxl(op) {
    this.#B ^= BigInt(op)
  }

  /**
   * 2
   * The bst instruction (opcode 2) calculates the value of its combo operand
   * modulo 8 (thereby keeping only its lowest 3 bits), then writes that value
   * to the B register.
   */
  #bst(op) {
    this.#B = this.#getOperand(op) % 8n
  }

  /**
   * 3
   * The jnz instruction (opcode 3) does nothing if the A register is 0. However,
   * if the A register is not zero, it jumps by setting the instruction pointer to
   * the value of its literal operand; if this instruction jumps, the instruction
   * pointer is not increased by 2 after this instruction.
   */
  #jnz(op) {
    if (this.#A === 0n) return

    this.#pointer = op - 2
  }

  /**
   * 4
   * The bxc instruction (opcode 4) calculates the bitwise XOR of register B and
   * register C, then stores the result in register B. (For legacy reasons, this
   * instruction reads an operand but ignores it.)
   */
  #bxc() {
    this.#B ^= this.#C
  }

  /**
   * 5
   * The out instruction (opcode 5) calculates the value of its combo operand
   * modulo 8, then outputs that value. (If a program outputs multiple values,
   * they are separated by commas.)
   */
  #out(op) {
    this.#output.push(this.#getOperand(op) % 8n)
  }

  /**
   * 6
   * The bdv instruction (opcode 6) works exactly like the adv instruction except
   * that the result is stored in the B register. (The numerator is still read
   * from the A register.)
   */
  #bdv(op) {
    this.#B = this.#A / 2n ** this.#getOperand(op)
  }

  /**
   * 7
   * The cdv instruction (opcode 7) works exactly like the adv instruction except
   * that the result is stored in the C register. (The numerator is still read
   * from the A register.)
   */
  #cdv(op) {
    this.#C = this.#A / 2n ** this.#getOperand(op)
  }

  run() {
    while (this.#pointer < this.#program.length) {
      this.#runInstruction(this.#program[this.#pointer + 1])
      this.#pointer += 2

      if (this.#output.length > 1000) throw new Error('Output limit exceeded')
    }

    return this.#output.join()
  }
}

export default Computer
