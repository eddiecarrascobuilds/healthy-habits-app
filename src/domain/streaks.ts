import type { HabitLog } from '../data/types'

/** Longest run of consecutive calendar days marked completed. */
export function longestStreak(logs: HabitLog[]): number {
  const days = [...new Set(logs.filter((l) => l.completed).map((l) => l.date))].sort()
  let best = 0
  let run = 0
  let prev: number | undefined
  for (const d of days) {
    const t = Date.parse(`${d}T00:00:00Z`)
    run = prev !== undefined && t - prev === 86_400_000 ? run + 1 : 1
    best = Math.max(best, run)
    prev = t
  }
  return best
}
