export interface MazeCell {
  x: number
  y: number
  top: boolean
  right: boolean
  bottom: boolean
  left: boolean
  visited: boolean
}

export interface MazePosition {
  x: number
  y: number
}

export const mazeSizes: Record<number, { name: string; score: number }> = {
  4: { name: '入门', score: 10 },
  6: { name: '简单', score: 20 },
  8: { name: '困难', score: 50 },
}

export function generateMaze(
  size: number,
  prng: () => number = Math.random,
): { grid: MazeCell[][]; start: MazePosition; end: MazePosition } {
  // Initialize grid
  const grid: MazeCell[][] = []
  for (let y = 0; y < size; y++) {
    grid[y] = []
    for (let x = 0; x < size; x++) {
      grid[y][x] = {
        x, y,
        top: true, right: true, bottom: true, left: true,
        visited: false,
      }
    }
  }

  // Recursive backtracker with weighted direction
  const stack: MazePosition[] = []
  const startX = 0
  const startY = 0
  grid[startY][startX].visited = true
  stack.push({ x: startX, y: startY })
  let lastDir = ''

  while (stack.length > 0) {
    const current = stack[stack.length - 1]
    const neighbors: Array<MazePosition & { dir: string }> = []

    if (current.y > 0 && !grid[current.y - 1][current.x].visited)
      neighbors.push({ x: current.x, y: current.y - 1, dir: 'top' })
    if (current.x < size - 1 && !grid[current.y][current.x + 1].visited)
      neighbors.push({ x: current.x + 1, y: current.y, dir: 'right' })
    if (current.y < size - 1 && !grid[current.y + 1][current.x].visited)
      neighbors.push({ x: current.x, y: current.y + 1, dir: 'bottom' })
    if (current.x > 0 && !grid[current.y][current.x - 1].visited)
      neighbors.push({ x: current.x - 1, y: current.y, dir: 'left' })

    if (neighbors.length > 0) {
      // Weighted selection: 70% chance to continue same direction (longer corridors)
      let chosen: (typeof neighbors)[0]
      if (lastDir && prng() < 0.7) {
        const same = neighbors.find(n => n.dir === lastDir)
        chosen = same ?? neighbors[Math.floor(prng() * neighbors.length)]
      } else {
        chosen = neighbors[Math.floor(prng() * neighbors.length)]
      }
      lastDir = chosen.dir
      // Remove walls between current and chosen
      if (chosen.dir === 'top') {
        grid[current.y][current.x].top = false
        grid[chosen.y][chosen.x].bottom = false
      } else if (chosen.dir === 'right') {
        grid[current.y][current.x].right = false
        grid[chosen.y][chosen.x].left = false
      } else if (chosen.dir === 'bottom') {
        grid[current.y][current.x].bottom = false
        grid[chosen.y][chosen.x].top = false
      } else if (chosen.dir === 'left') {
        grid[current.y][current.x].left = false
        grid[chosen.y][chosen.x].right = false
      }
      grid[chosen.y][chosen.x].visited = true
      stack.push({ x: chosen.x, y: chosen.y })
    } else {
      stack.pop()
      lastDir = ''
    }
  }

  // Break extra walls to create loops (approach 2 — for complexity)
  const loops = size === 4 ? 0 : size === 6 ? 1 : 2
  for (let i = 0; i < loops * 3; i++) { // Try up to 3x to find breakable walls
    const x = Math.floor(prng() * size)
    const y = Math.floor(prng() * size)
    // Try right wall
    if (x < size - 1 && grid[y][x].right && grid[y][x + 1].visited && grid[y][x].visited) {
      grid[y][x].right = false
      grid[y][x + 1].left = false
    }
    // Try bottom wall
    if (y < size - 1 && grid[y][x].bottom && grid[y + 1][x].visited && grid[y][x].visited) {
      grid[y][x].bottom = false
      grid[y + 1][x].top = false
    }
  }

  // Entry at top-left edge, exit at bottom-right edge
  grid[0][0].top = false
  grid[size - 1][size - 1].bottom = false

  return {
    grid,
    start: { x: 0, y: 0 },
    end: { x: size - 1, y: size - 1 },
  }
}

export function canMove(grid: MazeCell[][], x: number, y: number, dir: string): boolean {
  const cell = grid[y]?.[x]
  if (!cell) return false
  switch (dir) {
    case 'up': return !cell.top
    case 'right': return !cell.right
    case 'down': return !cell.bottom
    case 'left': return !cell.left
  }
  return false
}
