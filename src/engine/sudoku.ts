export class SudokuEngine {
  private size = 9
  private boxRows = 3
  private boxCols = 3

  generateSolution(size: number, prng: () => number): number[][] {
    this.size = size
    if (size === 4) { this.boxRows = 2; this.boxCols = 2 }
    else if (size === 6) { this.boxRows = 2; this.boxCols = 3 }
    else { this.boxRows = 3; this.boxCols = 3 }

    const board: number[][] = Array.from({ length: size }, () => Array(size).fill(0))
    this._fillBoard(board, 0, 0, prng)
    this._shuffleBoard(board, prng)
    return board
  }

  generatePuzzle(size: number, difficulty?: string, prng?: () => number): { puzzle: number[][]; solution: number[][] } {
    const rng = prng || Math.random
    const solution = this.generateSolution(size, rng)
    const puzzle = solution.map(row => [...row])

    let cellsToRemove: number
    const totalCells = size * size
    if (size === 4) cellsToRemove = 6
    else if (size === 6) cellsToRemove = difficulty === 'hard' ? 24 : 18
    else cellsToRemove = difficulty === 'hard' ? 55 : 45

    const positions = this._shuffleArray(
      Array.from({ length: totalCells }, (_, i) => ({ row: Math.floor(i / size), col: i % size })),
      rng,
    )

    let removed = 0
    for (const pos of positions) {
      if (removed >= cellsToRemove) break
      const original = puzzle[pos.row][pos.col]
      puzzle[pos.row][pos.col] = 0
      if (size <= 6) {
        if (!this._hasUniqueSolution(puzzle)) {
          puzzle[pos.row][pos.col] = original
        } else {
          removed++
        }
      } else {
        removed++
      }
    }
    return { puzzle, solution }
  }

  checkMove(_board: number[][], solution: number[][], row: number, col: number, value: number): boolean {
    return solution[row][col] === value
  }

  isComplete(board: number[][]): boolean {
    return board.every(row => row.every(cell => cell !== 0))
  }

  private _fillBoard(board: number[][], row: number, col: number, prng: () => number): boolean {
    if (row === this.size) return true
    const nextRow = col === this.size - 1 ? row + 1 : row
    const nextCol = col === this.size - 1 ? 0 : col + 1
    const nums = this._shuffleArray(Array.from({ length: this.size }, (_, i) => i + 1), prng)
    for (const num of nums) {
      if (this._isValid(board, row, col, num)) {
        board[row][col] = num
        if (this._fillBoard(board, nextRow, nextCol, prng)) return true
        board[row][col] = 0
      }
    }
    return false
  }

  private _isValid(board: number[][], row: number, col: number, num: number): boolean {
    for (let c = 0; c < this.size; c++) {
      if (board[row][c] === num) return false
    }
    for (let r = 0; r < this.size; r++) {
      if (board[r][col] === num) return false
    }
    const boxRowStart = Math.floor(row / this.boxRows) * this.boxRows
    const boxColStart = Math.floor(col / this.boxCols) * this.boxCols
    for (let r = boxRowStart; r < boxRowStart + this.boxRows; r++) {
      for (let c = boxColStart; c < boxColStart + this.boxCols; c++) {
        if (board[r][c] === num) return false
      }
    }
    return true
  }

  private _shuffleBoard(board: number[][], prng: () => number): void {
    const nums = this._shuffleArray(Array.from({ length: this.size }, (_, i) => i + 1), prng)
    const numMap: Record<number, number> = {}
    for (let i = 0; i < this.size; i++) numMap[i + 1] = nums[i]
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        board[r][c] = numMap[board[r][c]]
      }
    }
    for (let boxRow = 0; boxRow < this.size / this.boxRows; boxRow++) {
      const rowsInBox = Array.from({ length: this.boxRows }, (_, i) => boxRow * this.boxRows + i)
      const shuffled = this._shuffleArray([...rowsInBox], prng)
      if (shuffled[0] !== rowsInBox[0]) {
        const temp = board[rowsInBox[0]]
        board[rowsInBox[0]] = board[shuffled[0]]
        board[shuffled[0]] = temp
      }
    }
    for (let boxCol = 0; boxCol < this.size / this.boxCols; boxCol++) {
      const colsInBox = Array.from({ length: this.boxCols }, (_, i) => boxCol * this.boxCols + i)
      const shuffled = this._shuffleArray([...colsInBox], prng)
      if (shuffled[0] !== colsInBox[0]) {
        for (let r = 0; r < this.size; r++) {
          const temp = board[r][colsInBox[0]]
          board[r][colsInBox[0]] = board[r][shuffled[0]]
          board[r][shuffled[0]] = temp
        }
      }
    }
  }

  private _shuffleArray<T>(arr: T[], prng: () => number): T[] {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(prng() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  }

  private _hasUniqueSolution(board: number[][]): boolean {
    let count = 0
    const size = board.length
    const copy = board.map(row => [...row])
    this.size = size
    if (size === 4) { this.boxRows = 2; this.boxCols = 2 }
    else if (size === 6) { this.boxRows = 2; this.boxCols = 3 }
    else { this.boxRows = 3; this.boxCols = 3 }
    const solve = (r: number, c: number) => {
      if (count > 1) return
      if (r === size) { count++; return }
      const nextR = c === size - 1 ? r + 1 : r
      const nextC = c === size - 1 ? 0 : c + 1
      if (copy[r][c] !== 0) { solve(nextR, nextC); return }
      for (let num = 1; num <= size; num++) {
        if (this._isValidInBoard(copy, r, c, num)) {
          copy[r][c] = num
          solve(nextR, nextC)
          copy[r][c] = 0
          if (count > 1) return
        }
      }
    }
    solve(0, 0)
    return count === 1
  }

  private _isValidInBoard(board: number[][], row: number, col: number, num: number): boolean {
    const size = board.length
    let boxRows: number, boxCols: number
    if (size === 4) { boxRows = 2; boxCols = 2 }
    else if (size === 6) { boxRows = 2; boxCols = 3 }
    else { boxRows = 3; boxCols = 3 }
    for (let c = 0; c < size; c++) { if (board[row][c] === num) return false }
    for (let r = 0; r < size; r++) { if (board[r][col] === num) return false }
    const bsRow = Math.floor(row / boxRows) * boxRows
    const bsCol = Math.floor(col / boxCols) * boxCols
    for (let r = bsRow; r < bsRow + boxRows; r++) {
      for (let c = bsCol; c < bsCol + boxCols; c++) {
        if (board[r][c] === num) return false
      }
    }
    return true
  }
}

