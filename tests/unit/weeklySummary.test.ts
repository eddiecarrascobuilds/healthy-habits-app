import { expect, it } from 'vitest'
import { seed } from '../../src/data/seed'
import { summarize } from '../../src/domain/weeklySummary'

it("matches Masha's Nov 2–8 numbers", () => {
  const from = '2026-11-02', to = '2026-11-08'
  const inWeek = (d: string) => d >= from && d <= to
  const s = summarize({
    from, to,
    steps: seed.steps.filter((x) => inWeek(x.date)),
    meals: seed.meals.filter((x) => inWeek(x.date)),
    workouts: seed.workouts.filter((x) => inWeek(x.scheduledDate)),
  })
  expect(s.avgSteps).toBe(8571)
  expect(s.avgSodiumMg).toBe(2157)
  expect(s.highlight).toBe('You stayed under your sodium goal 5 of 7 days')
  expect(s.workoutsDone).toBe(3)
  expect(s.mealTip).toMatch(/^Lunches/)
})
