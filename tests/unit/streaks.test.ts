import { describe, expect, it } from 'vitest'
import { longestStreak } from '../../src/domain/streaks'

const log = (date: string, completed = true) => ({ habitId: 'h', date, completed })

describe('longestStreak', () => {
  it('is 0 with no completions', () => {
    expect(longestStreak([])).toBe(0)
  })

  it('a miss ends the streak', () => {
    const logs = [log('2026-11-09'), log('2026-11-10'), log('2026-11-11', false), log('2026-11-12')]
    expect(longestStreak(logs)).toBe(2)
  })

  it('counts across month boundaries', () => {
    expect(longestStreak([log('2026-10-31'), log('2026-11-01'), log('2026-11-02')])).toBe(3)
  })
})
