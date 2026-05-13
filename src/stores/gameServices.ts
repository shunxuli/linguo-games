import { GameStorage } from '../engine/storage'
import { SpeechManager } from '../engine/speech'
import { SoundManager } from '../engine/audio'

const storage = new GameStorage()
const speech = new SpeechManager()
const sound = new SoundManager()

export function useGameServices() {
  function init() {
    speech.initFromStorage()
    sound.initFromStorage()
  }

  function addScore(points: number) {
    const current = storage.getTotalScore()
    storage.setTotalScore(current + points)
  }

  function getTotalScore(): number {
    return storage.getTotalScore()
  }

  /** Call once on first user gesture to unlock audio on mobile */
  function initAudio() {
    sound.initOnUserGesture()
    speech.initOnUserGesture()
  }

  return { storage, speech, sound, init, initAudio, addScore, getTotalScore }
}

export const gameModes = {
  fruit: {
    name: '水果乐园', icon: '🍎',
    items: ['🍎', '🍊', '🍌', '🥝', '🫐', '🍇', '🍋', '🍓', '🍑'],
    names: {
      zh: ['苹果', '橘子', '香蕉', '猕猴桃', '蓝莓', '葡萄', '柠檬', '草莓', '桃子'],
      en: ['Apple', 'Orange', 'Banana', 'Kiwi', 'Blueberry', 'Grape', 'Lemon', 'Strawberry', 'Peach'],
    },
  },
  animal: {
    name: '动物世界', icon: '🐼',
    items: ['🐼', '🦁', '🐸', '🦀', '🐥', '🐳', '🐙', '🐞', '🦋'],
    names: {
      zh: ['熊猫', '狮子', '青蛙', '螃蟹', '小鸡', '鲸鱼', '章鱼', '瓢虫', '蝴蝶'],
      en: ['Panda', 'Lion', 'Frog', 'Crab', 'Chick', 'Whale', 'Octopus', 'Ladybug', 'Butterfly'],
    },
  },
  number: {
    name: '数字王国', icon: '🔢',
    items: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
    names: {
      zh: ['一', '二', '三', '四', '五', '六', '七', '八', '九'],
      en: ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'],
    },
  },
} as const

export type GameMode = keyof typeof gameModes

export const sudokuDifficulties = {
  4: { name: '入门', score: 10 },
  6: { name: '简单', score: 20 },
  9: { name: '困难', score: 50 },
} as const

export const mathRanges: Record<number, number> = { 10: 5, 20: 8, 100: 12, 1000: 20 }

export const puzzleSizes = {
  2: { name: '入门', score: 10 },
  3: { name: '简单', score: 20 },
  4: { name: '中等', score: 35 },
  5: { name: '困难', score: 50 },
} as const
