import { describe, it, expect } from 'vitest'
import { MathEngine } from '../engine/math'
import { createSeededRandom } from '../engine/sudoku'

const engine = new MathEngine()
const prng = createSeededRandom(123)

describe('MathEngine', () => {
  describe('generateQuestion', () => {
    it('generates addition question within range', () => {
      const q = engine.generateQuestion(10, 'add', prng)
      expect(q.operator).toBe('+')
      expect(q.num1 + q.num2).toBe(q.answer)
      expect(q.num1).toBeGreaterThanOrEqual(0)
      expect(q.num2).toBeGreaterThanOrEqual(0)
    })

    it('generates subtraction question within range', () => {
      const q = engine.generateQuestion(20, 'sub', prng)
      expect(q.operator).toBe('-')
      expect(q.num1 - q.num2).toBe(q.answer)
      expect(q.num1).toBeGreaterThanOrEqual(q.num2)
    })

    it('generates mix questions', () => {
      const ops: string[] = []
      for (let i = 0; i < 20; i++) {
        const q = engine.generateQuestion(10, 'mix', prng)
        ops.push(q.operator)
      }
      expect(ops.some(o => o === '+')).toBe(true)
      expect(ops.some(o => o === '-')).toBe(true)
    })

    it('does not generate 0+0', () => {
      for (let i = 0; i < 100; i++) {
        const q = engine.generateQuestion(10, 'add', prng)
        expect(q.num1 === 0 && q.num2 === 0).toBe(false)
      }
    })

    it('answers are within range for addition', () => {
      for (let i = 0; i < 20; i++) {
        const q = engine.generateQuestion(10, 'add', prng)
        expect(q.answer).toBeGreaterThanOrEqual(0)
        expect(q.answer).toBeLessThanOrEqual(10)
      }
    })
  })

  describe('checkAnswer', () => {
    it('returns true for correct answer', () => {
      expect(engine.checkAnswer('15', 15)).toBe(true)
    })

    it('returns false for wrong answer', () => {
      expect(engine.checkAnswer('14', 15)).toBe(false)
    })

    it('returns false for empty answer', () => {
      expect(engine.checkAnswer('', 0)).toBe(false)
    })
  })

  describe('getAnswerLength', () => {
    it('returns correct digit count', () => {
      expect(engine.getAnswerLength(5)).toBe(1)
      expect(engine.getAnswerLength(42)).toBe(2)
      expect(engine.getAnswerLength(100)).toBe(3)
    })
  })

  describe('calculateScore', () => {
    it('returns baseScore with no streak', () => {
      expect(engine.calculateScore(10, 0, 0)).toBe(10)
    })

    it('adds streak bonus (max 5)', () => {
      expect(engine.calculateScore(10, 3, 0)).toBe(13)
      expect(engine.calculateScore(10, 10, 0)).toBe(15) // bonus capped at 5
    })

    it('deducts hint penalty', () => {
      expect(engine.calculateScore(10, 0, 1)).toBe(9)
      expect(engine.calculateScore(10, 0, 10)).toBe(0) // floor at 0
    })
  })
})
