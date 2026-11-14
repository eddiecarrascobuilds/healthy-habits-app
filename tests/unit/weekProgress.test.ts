import { expect, it } from 'vitest'
import { weekDays, weekMessage } from '../../src/domain/weekProgress'

const log = (date: string, completed = true) => ({ habitId: 'h', date, completed })

it('marks days and never uses failure language', () => {
  const logs = [log('2026-11-09'), log('2026-11-10'), log('2026-11-11', false), log('2026-11-12')]
  const days = weekDays(logs, '2026-11-09', '2026-11-13')
  expect(days.map((d) => d.state)).toEqual(['done', 'done', 'missed', 'done', 'today', 'upcoming', 'upcoming'])
  expect(weekMessage(days)).toMatch(/^3 of 4 days\. Nice start/)
})

it("doesn't count days before a habit started", () => {
  const days = weekDays([], '2026-11-09', '2026-11-13', '2026-11-13')
  expect(days.slice(0, 4).every((d) => d.state === 'before')).toBe(true)
  expect(weekMessage(days)).toMatch(/^Your week starts today/)
})
