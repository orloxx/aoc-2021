export const OBJ = {
  wall: '█',
  empty: '.',
}

export const DIR = {
  up: [-1, 0],
  right: [0, 1],
  down: [1, 0],
  left: [0, -1],
}

export function printGrid(grid) {
  console.log(grid.map((row) => row.join('')).join('\n'))
}

export function treeFromGrid(grid) {
  return grid.reduce((acc, row, y) => {
    row.forEach((cell, x) => {
      if (cell === OBJ.wall) return

      acc[[y, x]] = Object.values(DIR)
        .map(([dy, dx]) => {
          const [ny, nx] = [y + dy, x + dx]

          const neighbor = grid[ny]?.[nx]

          return neighbor === OBJ.empty ? [ny, nx].join() : null
        })
        .filter(Boolean)
    })

    return acc
  }, {})
}
