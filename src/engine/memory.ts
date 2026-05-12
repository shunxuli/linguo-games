export interface MemoryCard {
  pairId: number
  content: string
}

export interface MemoryTheme {
  name: string
  icon: string
  items: string[]
}

export const memoryThemes: Record<string, MemoryTheme> = {
  emoji: {
    name: '表情包',
    icon: '😊',
    items: ['😀', '😃', '😄', '😅', '😊', '😎', '🥰', '😍', '🤩', '😜', '🤪', '😇', '🤗', '😏', '😌', '😛', '🤑', '🤔'],
  },
  color: {
    name: '色块配对',
    icon: '🎨',
    items: [
      '#FF0000', '#FF6600', '#FFCC00', '#33CC33', '#0099FF', '#6600CC',
      '#FF3399', '#993300', '#00CCCC', '#FFD700', '#C0C0C0', '#FF69B4',
      '#00BFFF', '#7FFF00', '#FF4500', '#8B00FF', '#FF8C42', '#2ECC71',
    ],
  },
  number: {
    name: '数字配对',
    icon: '🔢',
    items: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18'],
  },
}

export const memorySizes: Record<number, { name: string; score: number }> = {
  2: { name: '入门', score: 10 },
  4: { name: '简单', score: 20 },
  6: { name: '困难', score: 50 },
}

export function generateCards(pairCount: number, themeKey: string, prng: () => number = Math.random): MemoryCard[] {
  const theme = memoryThemes[themeKey]
  if (!theme || theme.items.length < pairCount) return []

  const selected = theme.items.slice(0, pairCount)
  const cards: MemoryCard[] = []

  selected.forEach((content, pairId) => {
    cards.push({ pairId, content })
    cards.push({ pairId, content })
  })

  // Fisher-Yates shuffle
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(prng() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]]
  }

  return cards
}

export function getPairCount(size: number): number {
  return (size * size) / 2
}

export function isMatch(card1: MemoryCard, card2: MemoryCard): boolean {
  return card1.pairId === card2.pairId
}
