export type PatternRule = 'AB' | 'AAB' | 'ABB' | 'ABC' | 'ABCD'

export interface PatternQuestion {
  sequence: string[]
  options: string[]
  correctIndex: number
  rule: PatternRule
}

const emojis = ['🍎', '🍊', '🍌', '🥝', '🫐', '🍇', '🍋', '🍓', '🍑', '🥭', '🍒', '🍉', '🥥', '🍍', '🥑', '🌽', '🥕', '🧅']
const animals = ['🐼', '🐱', '🐶', '🐰', '🐸', '🐥', '🐮', '🐷', '🐵', '🐔', '🦊', '🐻', '🐨', '🐯', '🦁', '🐙', '🐬', '🐢']
const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18']
const shapes = ['●', '▲', '■', '◆', '★', '♥', '⬟', '⬢', '✚', '✦', '◐', '⬠', '⬡', '▣', '⬒', '⬔', '⬕', '⬖']

export const patternThemes: Record<string, { name: string; icon: string; items: string[] }> = {
  fruit: { name: '水果乐园', icon: '🍎', items: emojis },
  animal: { name: '动物世界', icon: '🐼', items: animals },
  number: { name: '数字王国', icon: '🔢', items: numbers },
  shape: { name: '图形世界', icon: '⬠', items: shapes },
}

export const patternRules: Record<string, PatternRule[]> = {
  '2': ['AB'],
  '4': ['AB', 'AAB', 'ABB'],
  '6': ['AB', 'AAB', 'ABB', 'ABC', 'ABCD'],
}

const generators: Record<PatternRule, (items: string[]) => string[]> = {
  AB: (items) => [items[0], items[1], items[0], items[1], items[0], items[1], items[0]],
  AAB: (items) => [items[0], items[0], items[1], items[0], items[0], items[1], items[0], items[0]],
  ABB: (items) => [items[0], items[1], items[1], items[0], items[1], items[1], items[0], items[1]],
  ABC: (items) => [items[0], items[1], items[2], items[0], items[1], items[2], items[0], items[1]],
  ABCD: (items) => [items[0], items[1], items[2], items[3], items[0], items[1], items[2], items[3], items[0]],
}

export function generatePatternQuestion(
  themeKey: string,
  rule: PatternRule,
  prng: () => number = Math.random,
): PatternQuestion {
  const theme = patternThemes[themeKey]
  if (!theme) throw new Error('Unknown theme: ' + themeKey)
  const items = [...theme.items]
  // Shuffle items for variety
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(prng() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]]
  }
  const seq = generators[rule](items)
  const correctItem = seq[seq.length - 1]
  // Generate options (1 correct + distractors)
  const distractors = items.filter(it => it !== correctItem).slice(0, 3)
  const options = [correctItem, ...distractors]
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(prng() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]]
  }
  return {
    sequence: seq.slice(0, -1),
    options: options.slice(0, 4),
    correctIndex: options.indexOf(correctItem),
    rule,
  }
}

export const patternSizes: Record<number, { name: string; score: number }> = {
  2: { name: '入门', score: 10 },
  4: { name: '简单', score: 20 },
  6: { name: '困难', score: 50 },
}

export function getPatternRulesForSize(size: number): PatternRule[] {
  return patternRules[String(size)] || ['AB']
}
