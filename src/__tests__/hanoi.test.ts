import { describe, it, expect } from 'vitest'
import { initHanoi, canMove, moveRing, undoLastMove, getTopRing, generateSolution, getScore } from '../engine/hanoi'

describe('Hanoi Engine', () => {
  describe('initHanoi', () => {
    it('creates state with rings on peg 0', () => {
      const state = initHanoi(3)
      expect(state.pegs[0]).toEqual([3, 2, 1])
      expect(state.pegs[1]).toEqual([])
      expect(state.pegs[2]).toEqual([])
      expect(state.ringCount).toBe(3)
      expect(state.minMoves).toBe(7)
    })

    it('creates state with 4 rings', () => {
      const state = initHanoi(4)
      expect(state.pegs[0]).toEqual([4, 3, 2, 1])
      expect(state.minMoves).toBe(15)
    })
  })

  describe('canMove', () => {
    it('allows moving to empty peg', () => {
      const state = initHanoi(3)
      expect(canMove(state.pegs, 0, 1)).toBe(true)
    })

    it('allows smaller on larger', () => {
      const pegs: number[][] = [[2, 1], [3], []]
      expect(canMove(pegs, 0, 1)).toBe(true) // ring 1 can go on ring 3
    })

    it('rejects larger on smaller', () => {
      const pegs: number[][] = [[3], [1], []]
      expect(canMove(pegs, 0, 1)).toBe(false) // ring 3 cannot go on ring 1
    })

    it('rejects same peg', () => {
      const state = initHanoi(3)
      expect(canMove(state.pegs, 0, 0)).toBe(false)
    })

    it('rejects empty peg', () => {
      const state = initHanoi(3)
      expect(canMove(state.pegs, 1, 0)).toBe(false)
    })
  })

  describe('moveRing', () => {
    it('moves top ring to empty peg', () => {
      const state = initHanoi(3)
      const result = moveRing(state, 0, 1)
      expect(result).toBe(true)
      expect(state.pegs[0]).toEqual([3, 2])
      expect(state.pegs[1]).toEqual([1])
      expect(state.moves).toBe(1)
    })

    it('records move in history', () => {
      const state = initHanoi(3)
      moveRing(state, 0, 1)
      expect(state.history).toEqual([{ from: 0, to: 1 }])
    })

    it('detects completion', () => {
      const state = initHanoi(1)
      moveRing(state, 0, 2)
      expect(state.isComplete).toBe(true)
    })

    it('rejects invalid moves', () => {
      const state = initHanoi(3)
      expect(moveRing(state, 1, 0)).toBe(false)
      expect(moveRing(state, 0, 0)).toBe(false)
    })
  })

  describe('undoLastMove', () => {
    it('undoes last move', () => {
      const state = initHanoi(3)
      moveRing(state, 0, 1)
      undoLastMove(state)
      expect(state.pegs[0]).toEqual([3, 2, 1])
      expect(state.pegs[1]).toEqual([])
      expect(state.moves).toBe(0)
    })

    it('returns false when no history', () => {
      const state = initHanoi(3)
      expect(undoLastMove(state)).toBe(false)
    })
  })

  describe('getTopRing', () => {
    it('returns top ring of peg', () => {
      const state = initHanoi(3)
      expect(getTopRing(state.pegs, 0)).toBe(1)
    })

    it('returns null for empty peg', () => {
      const state = initHanoi(3)
      expect(getTopRing(state.pegs, 1)).toBeNull()
    })
  })

  describe('generateSolution', () => {
    it('generates correct number of moves for 3 rings', () => {
      const moves = generateSolution(3)
      expect(moves.length).toBe(7)
    })

    it('generates correct number for 4 rings', () => {
      const moves = generateSolution(4)
      expect(moves.length).toBe(15)
    })

    it('first move is from 0 to correct peg', () => {
      const moves = generateSolution(3)
      expect(moves[0].from).toBe(0)
    })
  })

  describe('getScore', () => {
    it('returns full score for optimal moves', () => {
      expect(getScore(15, 7, 7)).toBe(15)
    })

    it('deducts for extra moves', () => {
      expect(getScore(15, 10, 7)).toBe(12)
    })

    it('floors at 1', () => {
      expect(getScore(10, 30, 7)).toBe(1)
    })
  })
})
