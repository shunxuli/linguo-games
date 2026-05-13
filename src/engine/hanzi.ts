export interface HanziItem {
  char: string
  pinyin: string
  meaning: string
  emoji: string
  oracleSvg: string
  difficulty: number // 1=入门, 2=简单, 3=困难
}

export const hanziData: HanziItem[] = [
  { char: '日', pinyin: 'rì', meaning: '太阳', emoji: '🌞', difficulty: 1,
    oracleSvg: '<circle cx="50" cy="50" r="30" fill="none" stroke="#333" stroke-width="3"/><line x1="50" y1="15" x2="50" y2="30" stroke="#333" stroke-width="2"/>' },
  { char: '月', pinyin: 'yuè', meaning: '月亮', emoji: '🌙', difficulty: 1,
    oracleSvg: '<path d="M30 20 Q50 40 30 80 Q55 60 55 40 Q55 25 30 20Z" fill="none" stroke="#333" stroke-width="3"/>' },
  { char: '山', pinyin: 'shān', meaning: '山', emoji: '⛰️', difficulty: 1,
    oracleSvg: '<polyline points="10,70 30,30 50,55 70,20 90,70" fill="none" stroke="#333" stroke-width="3"/>' },
  { char: '水', pinyin: 'shuǐ', meaning: '水', emoji: '💧', difficulty: 1,
    oracleSvg: '<path d="M50 15 Q55 35 50 50" fill="none" stroke="#333" stroke-width="2"/><path d="M30 30 Q40 50 50 65" fill="none" stroke="#333" stroke-width="2"/><path d="M70 25 Q60 45 50 65" fill="none" stroke="#333" stroke-width="3"/>' },
  { char: '火', pinyin: 'huǒ', meaning: '火', emoji: '🔥', difficulty: 1,
    oracleSvg: '<path d="M50 15 Q55 25 50 35 Q45 25 50 15Z" fill="#333"/><path d="M40 35 Q50 50 50 70" fill="none" stroke="#333" stroke-width="3"/><path d="M60 35 Q50 50 50 70" fill="none" stroke="#333" stroke-width="3"/>' },
  { char: '人', pinyin: 'rén', meaning: '人', emoji: '🧍', difficulty: 1,
    oracleSvg: '<path d="M30 80 Q50 40 50 20 Q50 40 70 80" fill="none" stroke="#333" stroke-width="4"/>' },
  { char: '口', pinyin: 'kǒu', meaning: '嘴巴', emoji: '👄', difficulty: 1,
    oracleSvg: '<rect x="25" y="30" width="50" height="40" rx="5" fill="none" stroke="#333" stroke-width="3"/>' },
  { char: '目', pinyin: 'mù', meaning: '眼睛', emoji: '👁', difficulty: 1,
    oracleSvg: '<rect x="20" y="25" width="60" height="50" rx="10" fill="none" stroke="#333" stroke-width="3"/><circle cx="50" cy="50" r="8" fill="#333"/>' },
  { char: '大', pinyin: 'dà', meaning: '大', emoji: '👐', difficulty: 1,
    oracleSvg: '<path d="M50 15 L50 80" stroke="#333" stroke-width="4"/><path d="M15 50 L85 50" stroke="#333" stroke-width="4"/>' },
  { char: '小', pinyin: 'xiǎo', meaning: '小', emoji: '🤏', difficulty: 1,
    oracleSvg: '<line x1="50" y1="15" x2="50" y2="80" stroke="#333" stroke-width="3"/><line x1="30" y1="50" x2="50" y2="45" stroke="#333" stroke-width="3"/><line x1="70" y1="50" x2="50" y2="45" stroke="#333" stroke-width="3"/>' },
  { char: '上', pinyin: 'shàng', meaning: '上面', emoji: '⬆️', difficulty: 1,
    oracleSvg: '<line x1="20" y1="50" x2="80" y2="50" stroke="#333" stroke-width="3"/><line x1="50" y1="50" x2="50" y2="20" stroke="#333" stroke-width="3"/>' },
  { char: '下', pinyin: 'xià', meaning: '下面', emoji: '⬇️', difficulty: 1,
    oracleSvg: '<line x1="20" y1="30" x2="80" y2="30" stroke="#333" stroke-width="3"/><line x1="50" y1="30" x2="50" y2="75" stroke="#333" stroke-width="3"/>' },
  { char: '天', pinyin: 'tiān', meaning: '天空', emoji: '🌤️', difficulty: 1,
    oracleSvg: '<line x1="20" y1="25" x2="80" y2="25" stroke="#333" stroke-width="3"/><path d="M50 25 L50 80" stroke="#333" stroke-width="4"/><path d="M25 55 L75 55" stroke="#333" stroke-width="3"/>' },
  { char: '木', pinyin: 'mù', meaning: '树木', emoji: '🌳', difficulty: 1,
    oracleSvg: '<line x1="50" y1="15" x2="50" y2="80" stroke="#333" stroke-width="4"/><path d="M20 50 L50 35" stroke="#333" stroke-width="3"/><path d="M80 50 L50 35" stroke="#333" stroke-width="3"/><path d="M20 70 L50 55" stroke="#333" stroke-width="3"/><path d="M80 70 L50 55" stroke="#333" stroke-width="3"/>' },
  { char: '田', pinyin: 'tián', meaning: '田地', emoji: '🌾', difficulty: 1,
    oracleSvg: '<rect x="20" y="25" width="60" height="50" fill="none" stroke="#333" stroke-width="3"/><line x1="50" y1="25" x2="50" y2="75" stroke="#333" stroke-width="2"/><line x1="20" y1="50" x2="80" y2="50" stroke="#333" stroke-width="2"/>' },
  { char: '门', pinyin: 'mén', meaning: '门', emoji: '🚪', difficulty: 2,
    oracleSvg: '<rect x="25" y="20" width="50" height="60" rx="3" fill="none" stroke="#333" stroke-width="3"/><line x1="50" y1="20" x2="50" y2="80" stroke="#333" stroke-width="2"/>' },
  { char: '刀', pinyin: 'dāo', meaning: '刀', emoji: '🔪', difficulty: 2,
    oracleSvg: '<path d="M60 18 Q40 35 50 70" fill="none" stroke="#333" stroke-width="4"/><line x1="30" y1="35" x2="50" y2="70" stroke="#333" stroke-width="2"/>' },
  { char: '弓', pinyin: 'gōng', meaning: '弓', emoji: '🏹', difficulty: 2,
    oracleSvg: '<path d="M30 80 Q30 30 70 80" fill="none" stroke="#333" stroke-width="4"/><line x1="30" y1="20" x2="30" y2="80" stroke="#333" stroke-width="3"/>' },
  { char: '马', pinyin: 'mǎ', meaning: '马', emoji: '🐴', difficulty: 2,
    oracleSvg: '<path d="M25 50 Q30 30 50 25 L70 30 Q75 45 70 60" fill="none" stroke="#333" stroke-width="3"/><line x1="35" y1="65" x2="35" y2="80" stroke="#333" stroke-width="3"/><line x1="55" y1="60" x2="55" y2="80" stroke="#333" stroke-width="3"/>' },
  { char: '牛', pinyin: 'niú', meaning: '牛', emoji: '🐂', difficulty: 2,
    oracleSvg: '<path d="M35 15 Q40 30 50 35 Q60 30 65 15" fill="none" stroke="#333" stroke-width="3"/><line x1="50" y1="35" x2="50" y2="80" stroke="#333" stroke-width="3"/><line x1="35" y1="60" x2="65" y2="60" stroke="#333" stroke-width="3"/>' },
  { char: '羊', pinyin: 'yáng', meaning: '羊', emoji: '🐑', difficulty: 2,
    oracleSvg: '<line x1="50" y1="15" x2="50" y2="30" stroke="#333" stroke-width="3"/><path d="M30 25 L50 30 L70 25" fill="none" stroke="#333" stroke-width="3"/><line x1="50" y1="30" x2="50" y2="70" stroke="#333" stroke-width="3"/><line x1="35" y1="60" x2="65" y2="60" stroke="#333" stroke-width="3"/>' },
  { char: '鱼', pinyin: 'yú', meaning: '鱼', emoji: '🐟', difficulty: 2,
    oracleSvg: '<path d="M20 50 Q40 25 60 30 L80 50 L60 70 Q40 75 20 50Z" fill="none" stroke="#333" stroke-width="3"/><circle cx="35" cy="45" r="4" fill="#333"/><path d="M60 55 L70 55 L65 65Z" fill="none" stroke="#333" stroke-width="2"/>' },
  { char: '鸟', pinyin: 'niǎo', meaning: '鸟', emoji: '🐦', difficulty: 2,
    oracleSvg: '<path d="M40 20 Q30 30 35 50 Q40 60 60 55 L70 60 Q65 45 60 30 Q55 20 50 15" fill="none" stroke="#333" stroke-width="3"/><circle cx="50" cy="30" r="3" fill="#333"/>' },
  { char: '网', pinyin: 'wǎng', meaning: '网', emoji: '🕸️', difficulty: 2,
    oracleSvg: '<rect x="25" y="25" width="50" height="45" fill="none" stroke="#333" stroke-width="2"/><line x1="35" y1="25" x2="35" y2="70" stroke="#333" stroke-width="2"/><line x1="45" y1="25" x2="45" y2="70" stroke="#333" stroke-width="2"/><line x1="55" y1="25" x2="55" y2="70" stroke="#333" stroke-width="2"/>' },
  { char: '石', pinyin: 'shí', meaning: '石头', emoji: '🪨', difficulty: 2,
    oracleSvg: '<path d="M25 35 Q40 25 55 35 Q70 25 75 35" fill="none" stroke="#333" stroke-width="3"/><rect x="30" y="35" width="40" height="30" rx="3" fill="none" stroke="#333" stroke-width="3"/>' },
  { char: '土', pinyin: 'tǔ', meaning: '泥土', emoji: '🟫', difficulty: 2,
    oracleSvg: '<line x1="20" y1="30" x2="80" y2="30" stroke="#333" stroke-width="3"/><line x1="50" y1="30" x2="50" y2="75" stroke="#333" stroke-width="4"/>' },
  { char: '云', pinyin: 'yún', meaning: '云朵', emoji: '☁️', difficulty: 2,
    oracleSvg: '<line x1="20" y1="50" x2="80" y2="50" stroke="#333" stroke-width="3"/><path d="M25 20 Q40 10 55 20 Q70 10 75 25 Q85 35 70 45 Q55 45 40 35 Q25 45 20 35 Q15 25 25 20Z" fill="none" stroke="#333" stroke-width="3"/>' },
  { char: '雨', pinyin: 'yǔ', meaning: '下雨', emoji: '🌧️', difficulty: 2,
    oracleSvg: '<line x1="20" y1="20" x2="80" y2="20" stroke="#333" stroke-width="3"/><line x1="50" y1="20" x2="50" y2="30" stroke="#333" stroke-width="2"/><line x1="35" y1="35" x2="35" y2="50" stroke="#333" stroke-width="2"/><line x1="50" y1="35" x2="50" y2="55" stroke="#333" stroke-width="2"/><line x1="65" y1="35" x2="65" y2="50" stroke="#333" stroke-width="2"/>' },
  { char: '竹', pinyin: 'zhú', meaning: '竹子', emoji: '🎋', difficulty: 2,
    oracleSvg: '<line x1="30" y1="10" x2="30" y2="90" stroke="#333" stroke-width="3"/><line x1="70" y1="10" x2="70" y2="90" stroke="#333" stroke-width="3"/><path d="M25 30 L35 30" stroke="#333" stroke-width="2"/><path d="M25 50 L35 50" stroke="#333" stroke-width="2"/><path d="M65 35 L75 35" stroke="#333" stroke-width="2"/><path d="M65 55 L75 55" stroke="#333" stroke-width="2"/>' },
  { char: '米', pinyin: 'mǐ', meaning: '大米', emoji: '🍚', difficulty: 2,
    oracleSvg: '<line x1="50" y1="10" x2="50" y2="85" stroke="#333" stroke-width="3"/><line x1="40" y1="50" x2="65" y2="50" stroke="#333" stroke-width="2"/><line x1="35" y1="50" x2="50" y2="40" stroke="#333" stroke-width="2"/>' },
  { char: '林', pinyin: 'lín', meaning: '树林', emoji: '🌲🌲', difficulty: 3,
    oracleSvg: '<line x1="30" y1="20" x2="30" y2="80" stroke="#333" stroke-width="3"/><path d="M20 50 L30 35" stroke="#333" stroke-width="2"/><path d="M40 50 L30 35" stroke="#333" stroke-width="2"/><line x1="70" y1="20" x2="70" y2="80" stroke="#333" stroke-width="3"/><path d="M60 50 L70 35" stroke="#333" stroke-width="2"/><path d="M80 50 L70 35" stroke="#333" stroke-width="2"/>' },
  { char: '森', pinyin: 'sēn', meaning: '森林', emoji: '🌲🌲🌲', difficulty: 3,
    oracleSvg: '<line x1="20" y1="30" x2="20" y2="80" stroke="#333" stroke-width="3"/><path d="M15 50 L20 35" stroke="#333" stroke-width="2"/><path d="M28 50 L20 35" stroke="#333" stroke-width="2"/><line x1="50" y1="25" x2="50" y2="80" stroke="#333" stroke-width="3"/><path d="M45 55 L50 40" stroke="#333" stroke-width="2"/><path d="M58 55 L50 40" stroke="#333" stroke-width="2"/><line x1="75" y1="35" x2="75" y2="80" stroke="#333" stroke-width="3"/>' },
  { char: '休', pinyin: 'xiū', meaning: '休息', emoji: '💤', difficulty: 3,
    oracleSvg: '<line x1="40" y1="20" x2="40" y2="75" stroke="#333" stroke-width="3"/><path d="M40 40 L60 40 L60 70 L40 70" fill="none" stroke="#333" stroke-width="3"/>' },
  { char: '从', pinyin: 'cóng', meaning: '跟从', emoji: '👫', difficulty: 3,
    oracleSvg: '<path d="M25 70 Q40 40 40 25 Q40 40 55 70" fill="none" stroke="#333" stroke-width="3"/><path d="M45 70 Q58 45 58 30 Q58 45 70 70" fill="none" stroke="#333" stroke-width="2"/>' },
  { char: '众', pinyin: 'zhòng', meaning: '众人', emoji: '👨‍👩‍👦', difficulty: 3,
    oracleSvg: '<path d="M20 65 Q35 40 35 30 Q35 40 50 65" fill="none" stroke="#333" stroke-width="2"/><path d="M50 60 Q60 40 60 25 Q60 40 70 60" fill="none" stroke="#333" stroke-width="2"/><path d="M35 70 Q50 45 50 35 Q50 45 65 70" fill="none" stroke="#333" stroke-width="3"/>' },
  { char: '明', pinyin: 'míng', meaning: '明亮', emoji: '☀️🌙', difficulty: 3,
    oracleSvg: '<rect x="15" y="20" width="35" height="35" rx="4" fill="none" stroke="#333" stroke-width="2"/><path d="M55 25 Q65 40 55 65 Q60 45 70 25" fill="none" stroke="#333" stroke-width="2"/>' },
  { char: '好', pinyin: 'hǎo', meaning: '美好', emoji: '👍', difficulty: 3,
    oracleSvg: '<path d="M30 75 Q45 45 45 30 Q45 45 55 75" fill="none" stroke="#333" stroke-width="2"/><path d="M55 30 Q60 45 55 60 Q65 50 70 60" fill="none" stroke="#333" stroke-width="3"/>' },
  { char: '安', pinyin: 'ān', meaning: '安全', emoji: '🏠', difficulty: 3,
    oracleSvg: '<path d="M25 50 L50 30 L75 50" fill="none" stroke="#333" stroke-width="3"/><path d="M45 50 Q45 40 50 38 Q55 40 55 50 L55 70" fill="none" stroke="#333" stroke-width="2"/>' },
  { char: '看', pinyin: 'kàn', meaning: '看见', emoji: '👀', difficulty: 3,
    oracleSvg: '<path d="M25 45 Q35 35 45 45" fill="none" stroke="#333" stroke-width="2"/><rect x="15" y="20" width="25" height="25" rx="5" fill="none" stroke="#333" stroke-width="2"/><line x1="60" y1="30" x2="80" y2="30" stroke="#333" stroke-width="2"/><line x1="60" y1="50" x2="80" y2="50" stroke="#333" stroke-width="2"/>' },
  { char: '见', pinyin: 'jiàn', meaning: '见到', emoji: '👁️', difficulty: 3,
    oracleSvg: '<rect x="25" y="20" width="30" height="30" rx="5" fill="none" stroke="#333" stroke-width="2"/><path d="M35 50 Q35 60 45 70 Q55 60 55 50" fill="none" stroke="#333" stroke-width="2"/>' },
  { char: '尖', pinyin: 'jiān', meaning: '尖锐', emoji: '🔺', difficulty: 3,
    oracleSvg: '<path d="M50 15 L30 55 L70 55Z" fill="none" stroke="#333" stroke-width="3"/><path d="M35 55 Q50 65 65 55" fill="none" stroke="#333" stroke-width="2"/>' },
  { char: '心', pinyin: 'xīn', meaning: '心', emoji: '❤️', difficulty: 3,
    oracleSvg: '<path d="M50 80 Q25 60 35 40 Q40 35 50 45 Q60 35 65 40 Q75 60 50 80Z" fill="none" stroke="#333" stroke-width="3"/>' },
  { char: '手', pinyin: 'shǒu', meaning: '手', emoji: '✋', difficulty: 3,
    oracleSvg: '<line x1="50" y1="25" x2="50" y2="65" stroke="#333" stroke-width="3"/><line x1="50" y1="65" x2="35" y2="75" stroke="#333" stroke-width="3"/><line x1="50" y1="65" x2="45" y2="80" stroke="#333" stroke-width="2"/><line x1="50" y1="65" x2="55" y2="80" stroke="#333" stroke-width="2"/>' },
  { char: '足', pinyin: 'zú', meaning: '脚', emoji: '🦶', difficulty: 3,
    oracleSvg: '<circle cx="50" cy="25" r="15" fill="none" stroke="#333" stroke-width="3"/><path d="M35 40 Q50 55 65 40 L60 70 Q50 75 40 70Z" fill="none" stroke="#333" stroke-width="3"/>' },
  { char: '耳', pinyin: 'ěr', meaning: '耳朵', emoji: '👂', difficulty: 3,
    oracleSvg: '<rect x="28" y="20" width="44" height="55" rx="10" fill="none" stroke="#333" stroke-width="3"/><line x1="38" y1="35" x2="62" y2="35" stroke="#333" stroke-width="2"/><line x1="38" y1="50" x2="55" y2="50" stroke="#333" stroke-width="2"/>' },
  { char: '子', pinyin: 'zǐ', meaning: '孩子', emoji: '👶', difficulty: 3,
    oracleSvg: '<path d="M50 15 Q55 25 50 40 Q45 55 40 65" fill="none" stroke="#333" stroke-width="3"/><line x1="50" y1="40" x2="70" y2="50" stroke="#333" stroke-width="2"/>' },
  { char: '女', pinyin: 'nǚ', meaning: '女性', emoji: '👧', difficulty: 3,
    oracleSvg: '<path d="M30 25 Q40 45 50 50 Q60 45 70 25" fill="none" stroke="#333" stroke-width="3"/><line x1="50" y1="50" x2="45" y2="80" stroke="#333" stroke-width="2"/><line x1="50" y1="50" x2="60" y2="80" stroke="#333" stroke-width="2"/>' },
  { char: '禾', pinyin: 'hé', meaning: '禾苗', emoji: '🌿', difficulty: 3,
    oracleSvg: '<line x1="50" y1="15" x2="50" y2="80" stroke="#333" stroke-width="3"/><path d="M40 35 L50 30 L60 35" fill="none" stroke="#333" stroke-width="2"/><path d="M40 50 L50 45 L60 50" fill="none" stroke="#333" stroke-width="2"/>' },
  { char: '瓜', pinyin: 'guā', meaning: '瓜', emoji: '🍈', difficulty: 3,
    oracleSvg: '<ellipse cx="50" cy="50" rx="25" ry="35" fill="none" stroke="#333" stroke-width="3"/><line x1="50" y1="15" x2="50" y2="85" stroke="#333" stroke-width="2"/>' },
  { char: '果', pinyin: 'guǒ', meaning: '水果', emoji: '🍎', difficulty: 3,
    oracleSvg: '<rect x="35" y="25" width="30" height="30" rx="5" fill="none" stroke="#333" stroke-width="3"/><line x1="50" y1="15" x2="50" y2="25" stroke="#333" stroke-width="3"/>' },
]

export const hanziDifficulties: Record<number, { name: string; count: number; score: number }> = {
  1: { name: '入门', count: 15, score: 10 },
  2: { name: '简单', count: 30, score: 20 },
  3: { name: '困难', count: 50, score: 35 },
}

export type HanziMode = 'picture' | 'oracle' | 'audio'

export interface HanziQuestion {
  item: HanziItem
  mode: HanziMode
  options: HanziItem[]
  correctIndex: number
}

export function generateQuestion(difficulty: number, prng: () => number = Math.random): HanziQuestion {
  const pool = hanziData.filter(h => h.difficulty <= difficulty)
  const correct = pool[Math.floor(prng() * pool.length)]
  const others = pool.filter(h => h.char !== correct.char)
  // Shuffle others and pick 2 distractors
  for (let i = others.length - 1; i > 0; i--) {
    const j = Math.floor(prng() * (i + 1));
    [others[i], others[j]] = [others[j], others[i]]
  }
  const options = [correct, ...others.slice(0, 2)]
  // Shuffle options
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(prng() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]]
  }
  const modes: HanziMode[] = ['picture', 'oracle', 'audio']
  const mode = modes[Math.floor(prng() * modes.length)]

  return {
    item: correct,
    mode,
    options,
    correctIndex: options.indexOf(correct),
  }
}
