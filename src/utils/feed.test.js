import { describe, expect, it } from 'vitest'
import {
  applySignal,
  createInitialWeights,
  getDiversity,
  rankPosts,
  resetInference,
} from './feed.js'

describe('feed profile logic', () => {
  it('starts all topic weights at one', () => {
    expect(createInitialWeights()).toEqual({
      music: 1,
      fitness: 1,
      technology: 1,
      news: 1,
      travel: 1,
      gaming: 1,
    })
  })

  it('applies explicit signal weights and never drops below zero', () => {
    const initial = createInitialWeights()
    expect(applySignal(initial, 'music', 'like').music).toBe(3)
    expect(applySignal(initial, 'music', 'share').music).toBe(4)
    expect(applySignal(initial, 'music', 'dismiss').music).toBe(0)
    expect(applySignal({ ...initial, music: 0 }, 'music', 'dismiss').music).toBe(0)
  })

  it('ranks by weight while preserving original order for ties', () => {
    const sample = [
      { id: 'one', topic: 'music' },
      { id: 'two', topic: 'travel' },
      { id: 'three', topic: 'music' },
    ]
    const weights = { ...createInitialWeights(), music: 4, travel: 2 }

    expect(rankPosts(sample, weights).map((post) => post.id)).toEqual(['one', 'three', 'two'])
    expect(rankPosts(sample, weights, false)).toEqual(sample)
  })

  it('labels broad, narrowing, echo-risk, and disabled feeds', () => {
    expect(getDiversity(createInitialWeights()).label).toBe('Broad mix')
    expect(getDiversity({ music: 7, fitness: 1, technology: 1, news: 1, travel: 1, gaming: 1 }).label).toBe('Narrowing')
    expect(getDiversity({ music: 20, fitness: 1, technology: 1, news: 1, travel: 1, gaming: 1 }).label).toBe('Echo risk')
    expect(getDiversity(createInitialWeights(), false).label).toBe('Personalization off')
  })

  it('corrects one inference without altering other topics', () => {
    const weights = { ...createInitialWeights(), music: 7, travel: 4 }
    expect(resetInference(weights, 'music')).toEqual({ ...weights, music: 1 })
  })
})
