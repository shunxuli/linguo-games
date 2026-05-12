import { describe, it, expect } from 'vitest'
import { SudokuEngine, createSeededRandom } from '../engine/sudoku'

const engine = new SudokuEngine()
const prng = createSeededRandom(42)

describe('SudokuEngine', () => {
  describe('generateSolution', () => {
    it('generates a complete 4x4 board', () => {
      const board = engine.generateSolution(4, prng)
      expect(board.length).toBe(4)
      expect(board.every(row => row.length === 4)).toBe(true)
      expect(board.every(row => row.every(cell => cell >= 1 && cell <= 4))).toBe(true)
    })

    it('generates a complete 6x6 board', () => {
      const board = engine.generateSolution(6, prng)
      expect(board.length).toBe(6)
      expect(board.every(row => row.every(cell => cell >= 1 && cell <= 6))).toBe(true)
    })

    it('generates a complete 9x9 board', () => {
      const board = engine.generateSolution(9, prng)
      expect(board.length).toBe(9)
      expect(board.every(row => row.every(cell => cell >= 1 && cell <= 9))).toBe(true)
    })

    it('has no duplicates in any row', () => {
      const board = engine.generateSolution(9, prng)
      for (const row of board) {
        expect(new Set(row).size).toBe(9)
      }
    })

    it('has no duplicates in any column', () => {
      const board = engine.generateSolution(9, prng)
      for (let c = 0; c < 9; c++) {
        const col = board.map(row => row[c])
        expect(new Set(col).size).toBe(9)
      }
    })

    it('has no duplicates in any 3x3 box', () => {
      const board = engine.generateSolution(9, prng)
      for (let br = 0; br < 3; br++) {
        for (let bc = 0; bc < 3; bc++) {
          const box: number[] = []
          for (let r = br * 3; r < br * 3 + 3; r++) {
            for (let c = bc * 3; c < bc * 3 + 3; c++) {
              box.push(board[r][c])
            }
          }
          expect(new Set(box).size).toBe(9)
        }
      }
    })
  })

  describe('generatePuzzle', () => {
    it('returns puzzle and solution for 4x4', () => {
      const { puzzle, solution } = engine.generatePuzzle(4, 'easy', prng)
      expect(puzzle.length).toBe(4)
      expect(solution.length).toBe(4)
      const emptyCount = puzzle.flat().filter(c => c === 0).length
      expect(emptyCount).toBeGreaterThan(0)
    })

    it('returns puzzle and solution for 9x9', () => {
      const { puzzle, solution } = engine.generatePuzzle(9, 'easy', prng)
      expect(puzzle.length).toBe(9)
      expect(solution.length).toBe(9)
      const emptyCount = puzzle.flat().filter(c => c === 0).length
      expect(emptyCount).toBeGreaterThan(0)
    })

    it('puzzle cells match solution where non-zero', () => {
      const { puzzle, solution } = engine.generatePuzzle(4, 'easy', prng)
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          if (puzzle[r][c] !== 0) {
            expect(puzzle[r][c]).toBe(solution[r][c])
          }
        }
      }
    })
  })

  describe('checkMove', () => {
    it('returns true for correct move', () => {
      const solution = engine.generateSolution(4, prng)
      expect(engine.checkMove([], solution, 0, 0, solution[0][0])).toBe(true)
    })

    it('returns false for incorrect move', () => {
      const solution = engine.generateSolution(4, prng)
      const wrongValue = solution[0][0] === 1 ? 2 : 1
      expect(engine.checkMove([], solution, 0, 0, wrongValue)).toBe(false)
    })
  })

  describe('isComplete', () => {
    it('returns true for full board', () => {
      const board = engine.generateSolution(4, prng)
      expect(engine.isComplete(board)).toBe(true)
    })

    it('returns false for board with zeros', () => {
      const board = engine.generateSolution(4, prng)
      board[0][0] = 0
      expect(engine.isComplete(board)).toBe(false)
    })
  })

  describe('createSeededRandom', () => {
    it('produces deterministic sequence', () => {
      const r1 = createSeededRandom(99)
      const r2 = createSeededRandom(99)
      expect(r1()).toBe(r2())
      expect(r1()).toBe(r2())
      expect(r1()).toBe(r2())
    })

    it('produces values between 0 and 1', () => {
      const r = createSeededRandom(7)
      for (let i = 0; i < 100; i++) {
        const v = r()
        expect(v).toBeGreaterThanOrEqual(0)
        expect(v).toBeLessThan(1)
      }
    })
  })
})
