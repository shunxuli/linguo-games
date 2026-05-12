export interface HanoiState {
  pegs: number[][]
  ringCount: number
  moves: number
  minMoves: number
  history: Array<{ from: number; to: number }>
  isComplete: boolean
}

export interface HanoiMove {
  from: number
  to: number
}

export const hanoiDifficulties: Record<number, { name: string; score: number }> = {
  3: { name: '入门', score: 15 },
  4: { name: '简单', score: 30 },
  5: { name: '困难', score: 60 },
}

export function initHanoi(ringCount: number): HanoiState {
  const pegs: number[][] = [[], [], []]
  for (let i = ringCount; i >= 1; i--) {
    pegs[0].push(i)
  }
  return {
    pegs,
    ringCount,
    moves: 0,
    minMoves: Math.pow(2, ringCount) - 1,
    history: [],
    isComplete: false,
  }
}

export function canMove(pegs: number[][], from: number, to: number): boolean {
  if (from < 0 || from > 2 || to < 0 || to > 2) return false
  if (from === to) return false
  if (pegs[from].length === 0) return false
  const topFrom = pegs[from][pegs[from].length - 1]
  if (pegs[to].length === 0) return true
  const topTo = pegs[to][pegs[to].length - 1]
  return topFrom < topTo
}

export function moveRing(state: HanoiState, from: number, to: number): boolean {
  if (state.isComplete) return false
  if (!canMove(state.pegs, from, to)) return false
  const ring = state.pegs[from].pop()!
  state.pegs[to].push(ring)
  state.moves++
  state.history.push({ from, to })
  state.isComplete = state.pegs[2].length === state.ringCount
  return true
}

export function undoLastMove(state: HanoiState): boolean {
  if (state.history.length === 0) return false
  const last = state.history.pop()!
  const ring = state.pegs[last.to].pop()!
  state.pegs[last.from].push(ring)
  state.moves--
  state.isComplete = false
  return true
}

export function getTopRing(pegs: number[][], pegIndex: number): number | null {
  const peg = pegs[pegIndex]
  return peg.length > 0 ? peg[peg.length - 1] : null
}

export function generateSolution(ringCount: number): HanoiMove[] {
  const moves: HanoiMove[] = []
  function solve(n: number, from: number, to: number, aux: number) {
    if (n === 0) return
    solve(n - 1, from, aux, to)
    moves.push({ from, to })
    solve(n - 1, aux, to, from)
  }
  solve(ringCount, 0, 2, 1)
  return moves
}

export function getScore(baseScore: number, moves: number, minMoves: number): number {
  if (moves <= minMoves) return baseScore
  return Math.max(1, baseScore - (moves - minMoves))
}
