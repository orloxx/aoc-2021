import Piece from './piece.js'

const MAX_COL = 7

class Tetris {
  constructor(list, max) {
    this.max = max
    this.rocks = []
    this.occupied = new Set()
    this.order = [
      { name: 'horizontal-bar', ...Tetris.getRocksSpecs(['####']) },
      { name: 'plus', ...Tetris.getRocksSpecs(['.#.', '###', '.#.']) },
      { name: 'el-shape', ...Tetris.getRocksSpecs(['###', '..#', '..#']) },
      { name: 'vertical-bar', ...Tetris.getRocksSpecs(['#', '#', '#', '#']) },
      { name: 'square', ...Tetris.getRocksSpecs(['##', '##']) },
    ]
    this.pattern = list[0].split('').map((dir) => (dir === '>' ? 1 : -1))
  }

  get height() {
    return this.rocks.reduce((height, rock) => {
      const tallest = rock.rel.reduce((max, [y]) => {
        return Math.max(max, y)
      }, 0)
      return Math.max(height, tallest)
    }, 0)
  }

  // a new rock has been summoned from the tetris gods
  get next() {
    const current = this.order.shift()
    const piece = new Piece(current, this.height)
    this.order.push(current)
    return piece
  }

  get nextDirection() {
    const current = this.pattern.shift()
    this.pattern.push(current)
    return current
  }

  get isDone() {
    return this.rocks.length >= this.max
  }

  /**
   *
   * getEmptyBlock(4) will return this in an M x N matrix
   * with 4 units height
   *
   * ....... -> 3
   * ....... -> 2
   * ....... -> 1
   * ....... -> 0
   *
   * @param height
   * @returns {*|(Array | any[])[]}
   */
  static getEmptyBlock(height = 1) {
    return [].nm2DMatrix(height, MAX_COL, '.')
  }

  static getRocksSpecs(rock) {
    // relative coordinates (rel) in [y, x] notation
    const rel = rock.reduce((acc, line, y) => {
      return [
        ...acc,
        ...line.split('').reduce((acc01, item, x) => {
          if (item === '#') return [...acc01, [y + 4, x + 2]]
          return acc01
        }, []),
      ]
    }, [])

    return { rel, rock }
  }

  collidesWithRocks(newPosition) {
    return newPosition.some(([y, x]) => {
      return this.occupied.has(`${y}-${x}`)
    })
  }

  canMoveSide(piece, direction) {
    const sidePosition = piece.rel.map(([y, x]) => [y, x + direction])
    const wallCollision = sidePosition.some(([, x]) => x > 6 || x < 0)

    if (wallCollision) return false

    return !this.collidesWithRocks(sidePosition)
  }

  canMoveDown(piece) {
    const downPosition = piece.rel.map(([y, x]) => [y - 1, x])
    const floorCollision = downPosition.some(([y]) => y < 1)

    if (floorCollision) return false

    return !this.collidesWithRocks(downPosition)
  }

  put(rock) {
    rock.stay()
    rock.rel.forEach(([y, x]) => {
      this.occupied.add(`${y}-${x}`)
    })
    this.rocks.push(rock)
  }
}

export default Tetris
