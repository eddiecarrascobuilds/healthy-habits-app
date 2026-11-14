import type { ISODate } from '../data/types'

const toDate = (d: ISODate) => new Date(`${d}T00:00:00Z`)

export function addDays(d: ISODate, n: number): ISODate {
  const x = toDate(d)
  x.setUTCDate(x.getUTCDate() + n)
  return x.toISOString().slice(0, 10)
}

export function datesBetween(from: ISODate, to: ISODate): ISODate[] {
  const out: ISODate[] = []
  for (let d = from; d <= to; d = addDays(d, 1)) out.push(d)
  return out
}

/** Monday of the week containing `d`. */
export const mondayOf = (d: ISODate) => addDays(d, -((toDate(d).getUTCDay() + 6) % 7))

const fmt = (d: ISODate, opts: Intl.DateTimeFormatOptions) =>
  toDate(d).toLocaleDateString('en-US', { ...opts, timeZone: 'UTC' })

export const weekdayShort = (d: ISODate) => fmt(d, { weekday: 'short' })
export const weekdayLong = (d: ISODate) => fmt(d, { weekday: 'long' })
export const monthDay = (d: ISODate) => fmt(d, { month: 'short', day: 'numeric' })
export const monthYear = (d: ISODate) => fmt(d, { month: 'long', year: 'numeric' })
