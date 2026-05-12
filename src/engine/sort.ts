export interface SortItem {
  id: string
  value: number
  label: string
  emoji: string
}

export const sortThemes: Record<string, { name: string; icon: string; items: SortItem[] }> = {
  size: {
    name: '大小排序',
    icon: '📏',
    items: [
      { id: 's1', value: 1, label: '樱桃', emoji: '🍒' },
      { id: 's2', value: 2, label: '草莓', emoji: '🍓' },
      { id: 's3', value: 3, label: '苹果', emoji: '🍎' },
      { id: 's4', value: 4, label: '橙子', emoji: '🍊' },
      { id: 's5', value: 5, label: '椰子', emoji: '🥥' },
      { id: 's6', value: 6, label: '菠萝', emoji: '🍍' },
      { id: 's7', value: 7, label: '西瓜', emoji: '🍉' },
      { id: 's8', value: 8, label: '南瓜', emoji: '🎃' },
    ],
  },
  number: {
    name: '数字排序',
    icon: '🔢',
    items: [
      { id: 'n1', value: 1, label: '一', emoji: '1' },
      { id: 'n2', value: 2, label: '二', emoji: '2' },
      { id: 'n3', value: 3, label: '三', emoji: '3' },
      { id: 'n4', value: 4, label: '四', emoji: '4' },
      { id: 'n5', value: 5, label: '五', emoji: '5' },
      { id: 'n6', value: 6, label: '六', emoji: '6' },
      { id: 'n7', value: 7, label: '七', emoji: '7' },
      { id: 'n8', value: 8, label: '八', emoji: '8' },
    ],
  },
  time: {
    name: '时间排序',
    icon: '⏰',
    items: [
      { id: 't1', value: 1, label: '日出', emoji: '🌅' },
      { id: 't2', value: 2, label: '上午', emoji: '☀️' },
      { id: 't3', value: 3, label: '中午', emoji: '🔆' },
      { id: 't4', value: 4, label: '下午', emoji: '🌤️' },
      { id: 't5', value: 5, label: '傍晚', emoji: '🌇' },
      { id: 't6', value: 6, label: '晚上', emoji: '🌙' },
      { id: 't7', value: 7, label: '深夜', emoji: '🌑' },
      { id: 't8', value: 8, label: '凌晨', emoji: '🌟' },
    ],
  },
}

export const sortSizes: Record<number, { name: string; score: number; count: number }> = {
  2: { name: '入门', score: 10, count: 3 },
  4: { name: '简单', score: 20, count: 5 },
  6: { name: '困难', score: 50, count: 8 },
}

export function generateSortItems(
  themeKey: string,
  count: number,
  prng: () => number = Math.random,
): SortItem[] {
  const theme = sortThemes[themeKey]
  if (!theme) return []
  const selected = theme.items.sort((a, b) => a.value - b.value).slice(0, count)
  // Shuffle
  const shuffled = [...selected]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(prng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function isSorted(items: SortItem[]): boolean {
  return items.every((item, i) => i === 0 || item.value >= items[i - 1].value)
}
