export interface MatchPair {
  left: string
  leftLabel: string
  right: string
  rightLabel: string
}

export const matchThemes: Record<string, { name: string; icon: string; pairs: MatchPair[] }> = {
  food: {
    name: '动物食物',
    icon: '🍽️',
    pairs: [
      { left: '🐼', leftLabel: '熊猫', right: '🎋', rightLabel: '竹子' },
      { left: '🐱', leftLabel: '小猫', right: '🐟', rightLabel: '鱼' },
      { left: '🐶', leftLabel: '小狗', right: '🦴', rightLabel: '骨头' },
      { left: '🐰', leftLabel: '兔子', right: '🥕', rightLabel: '胡萝卜' },
      { left: '🐥', leftLabel: '小鸡', right: '🐛', rightLabel: '虫子' },
      { left: '🐮', leftLabel: '奶牛', right: '🌿', rightLabel: '草' },
      { left: '🐵', leftLabel: '猴子', right: '🍌', rightLabel: '香蕉' },
      { left: '🦁', leftLabel: '狮子', right: '🍖', rightLabel: '肉' },
    ],
  },
  shadow: {
    name: '物品影子',
    icon: '👤',
    pairs: [
      { left: '☀️', leftLabel: '太阳', right: '🌞', rightLabel: '太阳影' },
      { left: '🌙', leftLabel: '月亮', right: '🌛', rightLabel: '月亮影' },
      { left: '⭐', leftLabel: '星星', right: '🌟', rightLabel: '星星影' },
      { left: '🏠', leftLabel: '房子', right: '🏡', rightLabel: '房子影' },
      { left: '🌲', leftLabel: '树', right: '🌳', rightLabel: '树影' },
      { left: '🚗', leftLabel: '汽车', right: '🚘', rightLabel: '汽车影' },
      { left: '✈️', leftLabel: '飞机', right: '🛩️', rightLabel: '飞机影' },
      { left: '🐱', leftLabel: '小猫', right: '🐈', rightLabel: '小猫影' },
    ],
  },
  number: {
    name: '数字数量',
    icon: '🔢',
    pairs: [
      { left: '1', leftLabel: '一', right: '●', rightLabel: '1个' },
      { left: '2', leftLabel: '二', right: '●●', rightLabel: '2个' },
      { left: '3', leftLabel: '三', right: '●●●', rightLabel: '3个' },
      { left: '4', leftLabel: '四', right: '●●●●', rightLabel: '4个' },
      { left: '5', leftLabel: '五', right: '●●●●●', rightLabel: '5个' },
      { left: '6', leftLabel: '六', right: '●●●●●●', rightLabel: '6个' },
      { left: '7', leftLabel: '七', right: '●●●●●●●', rightLabel: '7个' },
      { left: '8', leftLabel: '八', right: '●●●●●●●●', rightLabel: '8个' },
    ],
  },
}

export const matchSizes: Record<number, { name: string; score: number; pairs: number }> = {
  2: { name: '入门', score: 10, pairs: 4 },
  4: { name: '简单', score: 20, pairs: 6 },
  6: { name: '困难', score: 50, pairs: 8 },
}

export function generateMatchPairs(themeKey: string, pairCount: number, prng: () => number = Math.random): MatchPair[] {
  const theme = matchThemes[themeKey]
  if (!theme) return []
  const shuffled = [...theme.pairs]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(prng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled.slice(0, pairCount)
}

export interface MatchSide {
  index: number
  item: string
  label: string
  side: 'left' | 'right'
}

export function shuffleSides(pairs: MatchPair[], prng: () => number = Math.random): { lefts: MatchSide[]; rights: MatchSide[] } {
  const lefts: MatchSide[] = pairs.map((p, i) => ({ index: i, item: p.left, label: p.leftLabel, side: 'left' as const }))
  const rights: MatchSide[] = pairs.map((p, i) => ({ index: i, item: p.right, label: p.rightLabel, side: 'right' as const }))
  for (let i = rights.length - 1; i > 0; i--) {
    const j = Math.floor(prng() * (i + 1));
    [rights[i], rights[j]] = [rights[j], rights[i]]
  }
  return { lefts, rights }
}
