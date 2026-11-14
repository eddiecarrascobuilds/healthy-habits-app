import type { HabitLog, ISODate } from '../data/types'
import { addDays, weekdayShort } from './dates'

/** `before` = the habit hadn't started yet; not counted either way. */
export type DayState = 'done' | 'missed' | 'today' | 'upcoming' | 'before'
export interface DayStatus { date: ISODate; label: string; state: DayState }

export function weekDays(logs: HabitLog[], weekStart: ISODate, today: ISODate, startedOn = ''): DayStatus[] {
  const done = new Set(logs.filter((l) => l.completed).map((l) => l.date))
  return Array.from({ length: 7 }, (_, i) => {
    const date = addDays(weekStart, i)
    let state: DayState
    if (date < startedOn) state = 'before'
    else if (done.has(date)) state = 'done'
    else if (date < today) state = 'missed'
    else if (date === today) state = 'today'
    else state = 'upcoming'
    return { date, label: weekdayShort(date), state }
  })
}

/** Encouraging, never-punishing message for the week so far. */
export function weekMessage(days: DayStatus[]): string {
  const done = days.filter((d) => d.state === 'done').length
  const counted = days.filter((d) => d.state === 'done' || d.state === 'missed').length
  if (counted === 0) return 'Your week starts today. One small step is all it takes.'
  const ratio = `${done} of ${counted} ${counted === 1 ? 'day' : 'days'}.`
  if (done === counted) return `${ratio} You're on a roll!`
  if (days.some((d) => d.state === 'today')) return `${ratio} Nice start, today is a great day to pick it back up.`
  return `${ratio} Nice start, pick it back up tomorrow.`
}
