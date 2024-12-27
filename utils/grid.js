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

/**
 * Creates a tree of possible paths an object can move in a 2D grid.
 * It doesn't take into account diagonal movements or the object's initial position.
 * @param grid {string<typeof OBJ[string]>[][]} - The 2d grid where the object can move.
 * @returns {{[key: string]: string[]}} - A tree of possible paths.
 */
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
