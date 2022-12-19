import Piece from './piece.js'

class Tetris {
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

  static getCeiling(rocks) {
    return rocks.reduce((max, rock) => {
      return Math.max(max, Math.max(...rock.rel.map(([y]) => y)))
    }, 0)
  }

  static getFloor(rocks) {
    return rocks.reduce((min, rock) => {
      return Math.min(min, Math.min(...rock.rel.map(([y]) => y)))
    }, Infinity)
  }

  static getBlockInfo(rocks) {
    const floor = this.getFloor(rocks)
    const newRocks = rocks.map((rock) => new Piece(rock, 1 - floor))
    return {
      signature: newRocks.map(({ rel }) => JSON.stringify(rel)).join(''),
      height: this.getCeiling(newRocks),
    }
  }

  constructor(list, max) {
    this.max = max
    this.rocks = []
    this.occupied = new Set()
    this.shapes = [
      { name: 'horizontal-bar', ...Tetris.getRocksSpecs(['####']) },
      { name: 'plus', ...Tetris.getRocksSpecs(['.#.', '###', '.#.']) },
      { name: 'el-shape', ...Tetris.getRocksSpecs(['###', '..#', '..#']) },
      { name: 'vertical-bar', ...Tetris.getRocksSpecs(['#', '#', '#', '#']) },
      { name: 'square', ...Tetris.getRocksSpecs(['##', '##']) },
    ]
    this.windPattern = list[0].split('').map((dir) => (dir === '>' ? 1 : -1))
    // To calculate 3 items: [start shape, shape repeat, block height]
    this.blockInfo = []
  }

  get height() {
    if (this.blockInfo.length) {
      const [start, repeat, height] = this.blockInfo
      const piecesPerBlock = repeat - start
      const numBlocks = Math.floor((this.max - start) / piecesPerBlock)
      const rest = this.max - numBlocks * piecesPerBlock
      const calcH = height * numBlocks

      return calcH + Tetris.getCeiling(this.rocks.slice(0, rest))
    }
    return Tetris.getCeiling(this.rocks)
  }

  // a new rock has been summoned from the tetris gods
  get nextShape() {
    const current = this.shapes.shift()
    const piece = new Piece(current, this.height)
    this.shapes.push(current)
    return piece
  }

  get nextWindDirection() {
    const current = this.windPattern.shift()
    this.windPattern.push(current)
    return current
  }

  get isDone() {
    return this.blockInfo.length === 3 || this.rocks.length >= this.max
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

  detectPlacedPatterns() {
    const area = 2100

    if (this.rocks.length === area) {
      const block = 40
      const rocks = [...this.rocks]

      for (let start = 0; start < area - block; start += 5) {
        const { signature: sig1 } = Tetris.getBlockInfo(
          rocks.slice(start, start + block)
        )

        for (let repeat = start + 5; repeat < area - block; repeat += 5) {
          const { signature: sig2 } = Tetris.getBlockInfo(
            rocks.slice(repeat, repeat + block)
          )

          if (sig1 === sig2) {
            const { height } = Tetris.getBlockInfo(rocks.slice(start, repeat))
            this.blockInfo = [start, repeat, height]
            break
          }
        }

        if (this.blockInfo.length) break
      }
    }
  }

  put(rock) {
    rock.stay()
    rock.rel.forEach(([y, x]) => {
      this.occupied.add(`${y}-${x}`)
    })
    this.rocks.push(rock)
    this.detectPlacedPatterns()
  }
}

export default Tetris
