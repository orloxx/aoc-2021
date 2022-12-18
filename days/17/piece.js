class Piece {
  constructor({ name, rel, rock }, height) {
    this.name = name
    this.rel = rel.map(([y, x]) => [y + height, x])
    this.rock = rock
    this.falling = true
  }

  moveSides(direction) {
    this.rel = this.rel.map(([y, x]) => [y, x + direction])
  }

  moveDown() {
    this.rel = this.rel.map(([y, x]) => [y - 1, x])
  }

  stay() {
    this.falling = false
  }
}

export default Piece
