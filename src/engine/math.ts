export type MathOp = 'add' | 'sub' | 'mix'

export interface MathQuestion {
  num1: number
  num2: number
  answer: number
  operator: string
}

export interface MathGameState {
  op: MathOp
  range: number
  baseScore: number
  num1: number
  num2: number
  answer: number
  operator: string
  userAnswer: string
  streak: number
  correctCount: number
  totalCount: number
  score: number
  hintsUsed: number
}

export class MathEngine {
  generateQuestion(range: number, op: MathOp, prng: () => number = Math.random): MathQuestion {
    for (let attempt = 0; attempt < 10; attempt++) {
      let num1: number, num2: number, answer: number, operator: string

      if (op === 'add' || (op === 'mix' && prng() < 0.5)) {
        operator = '+'
        answer = Math.floor(prng() * (range + 1))
        num1 = Math.floor(prng() * (answer + 1))
        num2 = answer - num1
        if (num2 < 0) { num2 = 0; num1 = answer }
      } else {
        operator = '-'
        num1 = Math.floor(prng() * (range + 1))
        num2 = Math.floor(prng() * (num1 + 1))
        answer = num1 - num2
      }

      if (num1 !== 0 || num2 !== 0) {
        return { num1, num2, answer, operator }
      }
    }
    // Fallback after max attempts
    return { num1: 1, num2: 0, answer: 1, operator: '+' }
  }

  checkAnswer(userAnswer: string, correctAnswer: number): boolean {
    return parseInt(userAnswer, 10) === correctAnswer
  }

  getAnswerLength(answer: number): number {
    return answer.toString().length
  }

  calculateScore(baseScore: number, streak: number, hintsUsed: number): number {
    const bonus = Math.min(streak, 5)
    const points = baseScore + bonus
    return Math.max(0, points - hintsUsed)
  }
}
