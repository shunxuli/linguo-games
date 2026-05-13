export interface MazeCell {
  x: number
  y: number
  top: boolean
  right: boolean
  bottom: boolean
  left: boolean
  visited: boolean
  onPath?: boolean
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

  // Find the solution path and mark it
  const path = findPath(grid, { x: startX, y: startY }, { x: size - 1, y: size - 1 })
  const pathSet = new Set(path.map(p => `${p.x},${p.y}`))

  // Break extra walls only between non-path cells (creates loops in side branches)
  const loops = size === 4 ? 0 : size === 6 ? 1 : 2
  let broken = 0
  for (let attempt = 0; attempt < size * size * 4 && broken < loops; attempt++) {
    const x = Math.floor(prng() * size)
    const y = Math.floor(prng() * size)
    // Try right wall: break if at least one side is NOT on the solution path
    if (x < size - 1 && grid[y][x].right) {
      const key1 = `${x},${y}`
      const key2 = `${x + 1},${y}`
      if (!pathSet.has(key1) || !pathSet.has(key2)) {
        grid[y][x].right = false
        grid[y][x + 1].left = false
        broken++
      }
    }
    // Try bottom wall
    if (broken < loops && y < size - 1 && grid[y][x].bottom) {
      const key1 = `${x},${y}`
      const key2 = `${x},${y + 1}`
      if (!pathSet.has(key1) || !pathSet.has(key2)) {
        grid[y][x].bottom = false
        grid[y + 1][x].top = false
        broken++
      }
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

function findPath(grid: MazeCell[][], start: MazePosition, end: MazePosition): MazePosition[] {
  const visited = new Set<string>()
  const queue: Array<{ pos: MazePosition; prev: string | null }> = []
  const parent = new Map<string, string>()

  queue.push({ pos: start, prev: null })
  visited.add(`${start.x},${start.y}`)

  while (queue.length > 0) {
    const { pos } = queue.shift()!
    if (pos.x === end.x && pos.y === end.y) {
      // Reconstruct path
      const path: MazePosition[] = []
      let key: string | null = `${pos.x},${pos.y}`
      while (key) {
        const [x, y] = key.split(',').map(Number)
        path.unshift({ x, y })
        key = parent.get(key) ?? null
      }
      return path
    }
    // Try each direction
    const dirs: Array<{ dx: number; dy: number }> = [
      { dx: 0, dy: -1 }, { dx: 1, dy: 0 }, { dx: 0, dy: 1 }, { dx: -1, dy: 0 },
    ]
    for (const { dx, dy } of dirs) {
      const nx = pos.x + dx
      const ny = pos.y + dy
      const nkey = `${nx},${ny}`
      if (nx < 0 || ny < 0 || nx >= grid[0].length || ny >= grid.length) continue
      if (visited.has(nkey)) continue
      // Check if move is valid
      const cell = grid[pos.y][pos.x]
      let canGo = false
      if (dx === 0 && dy === -1) canGo = !cell.top
      if (dx === 1 && dy === 0) canGo = !cell.right
      if (dx === 0 && dy === 1) canGo = !cell.bottom
      if (dx === -1 && dy === 0) canGo = !cell.left
      if (!canGo) continue
      visited.add(nkey)
      parent.set(nkey, `${pos.x},${pos.y}`)
      queue.push({ pos: { x: nx, y: ny }, prev: `${pos.x},${pos.y}` })
    }
  }
  return []
}
