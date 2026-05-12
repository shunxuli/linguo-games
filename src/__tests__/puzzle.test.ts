import { describe, it, expect } from 'vitest'
import {
  createSeededRandom,
  generatePieces,
  isFullyCorrect,
  isPieceCorrect,
  PATTERNS,
} from '../engine/puzzle'

describe('Puzzle Engine', () => {
  describe('createSeededRandom', () => {
    it('produces deterministic sequence', () => {
      const r1 = createSeededRandom(42)
      const r2 = createSeededRandom(42)
      const seq1 = Array.from({ length: 10 }, () => r1())
      const seq2 = Array.from({ length: 10 }, () => r2())
      expect(seq1).toEqual(seq2)
    })

    it('different seeds produce different sequences', () => {
      const r1 = createSeededRandom(1)
      const r2 = createSeededRandom(2)
      expect(r1()).not.toBe(r2())
    })
  })

  describe('generatePieces determinism', () => {
    it('produces identical pieces for same seed and pattern', () => {
      const pattern = PATTERNS[8]
      const prng1 = createSeededRandom(100)
      const prng2 = createSeededRandom(100)

      const pieces1 = generatePieces(400, 3, pattern, prng1)
      const pieces2 = generatePieces(400, 3, pattern, prng2)

      expect(pieces1.length).toBe(9)
      expect(pieces1.length).toBe(pieces2.length)
      for (let i = 0; i < pieces1.length; i++) {
        expect(pieces1[i].image).toBe(pieces2[i].image)
      }
    })

    it('produces identical pieces for gradient star patterns', () => {
      const pattern = PATTERNS[3]
      const prng1 = createSeededRandom(200)
      const prng2 = createSeededRandom(200)

      const pieces1 = generatePieces(400, 4, pattern, prng1)
      const pieces2 = generatePieces(400, 4, pattern, prng2)

      expect(pieces1.length).toBe(16)
      for (let i = 0; i < pieces1.length; i++) {
        expect(pieces1[i].image).toBe(pieces2[i].image)
      }
    })

    it('produces deterministic preview after shuffle', () => {
      const pattern = PATTERNS[0]
      const prng = createSeededRandom(999)

      const pieces1 = generatePieces(400, 3, pattern, prng)
      const prng2 = createSeededRandom(999)
      const pieces2 = generatePieces(400, 3, pattern, prng2)

      expect(pieces1.map(p => p.correctIndex)).toEqual(pieces2.map(p => p.correctIndex))
    })
  })

  describe('generatePieces structure', () => {
    it('creates correct number of pieces', () => {
      const pattern = PATTERNS[0]
      const pieces = generatePieces(400, 3, pattern)
      expect(pieces.length).toBe(9)
    })

    it('creates correct number for 5x5', () => {
      const pattern = PATTERNS[0]
      const pieces = generatePieces(400, 5, pattern)
      expect(pieces.length).toBe(25)
    })

    it('each piece has correctRow and correctCol set', () => {
      const pattern = PATTERNS[0]
      const pieces = generatePieces(400, 2, pattern)
      // Pieces may be shuffled, so just check the set of values
      const rows = pieces.map(p => p.correctRow).sort()
      const cols = pieces.map(p => p.correctCol).sort()
      expect(rows).toEqual([0, 0, 1, 1])
      expect(cols).toEqual([0, 0, 1, 1])
    })

    it('each piece has a data URL image', () => {
      const pattern = PATTERNS[0]
      const pieces = generatePieces(400, 3, pattern)
      for (const piece of pieces) {
        expect(piece.image).toMatch(/^data:image\/png;base64,/)
      }
    })

    it('pieces are not initially locked', () => {
      const pattern = PATTERNS[0]
      const pieces = generatePieces(400, 3, pattern)
      expect(pieces.every(p => !p.locked)).toBe(true)
    })
  })

  describe('isFullyCorrect', () => {
    it('returns true when all pieces in correct positions', () => {
      const pieces = [
        { correctRow: 0, correctCol: 0, correctIndex: 0, currentIndex: 0, image: '', locked: false },
        { correctRow: 0, correctCol: 1, correctIndex: 1, currentIndex: 1, image: '', locked: false },
      ]
      expect(isFullyCorrect(pieces)).toBe(true)
    })

    it('returns false when pieces are out of order', () => {
      // Piece with correctIndex 1 is at array position 0, and vice versa
      const pieces = [
        { correctRow: 0, correctCol: 1, correctIndex: 1, currentIndex: 0, image: '', locked: false },
        { correctRow: 0, correctCol: 0, correctIndex: 0, currentIndex: 1, image: '', locked: false },
      ]
      expect(isFullyCorrect(pieces)).toBe(false)
    })
  })

  describe('isPieceCorrect', () => {
    it('returns true for correctly placed piece', () => {
      const piece = { correctRow: 0, correctCol: 0, correctIndex: 0, currentIndex: 0, image: '', locked: false }
      expect(isPieceCorrect(piece, 0)).toBe(true)
    })

    it('returns false for misplaced piece', () => {
      const piece = { correctRow: 0, correctCol: 1, correctIndex: 1, currentIndex: 1, image: '', locked: false }
      expect(isPieceCorrect(piece, 0)).toBe(false)
    })
  })

  describe('PATTERNS', () => {
    it('has patterns', () => {
      expect(PATTERNS.length).toBeGreaterThanOrEqual(32)
    })

    it('each pattern has required fields', () => {
      for (const p of PATTERNS) {
        expect(p.id).toBeDefined()
        expect(p.name).toBeDefined()
        expect(p.type).toBeDefined()
      }
    })
  })
})
