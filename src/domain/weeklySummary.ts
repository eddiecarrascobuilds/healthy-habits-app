import type { ISODate, MealLog, StepEntry, Workout } from '../data/types'
import { config } from './config'
import { datesBetween } from './dates'

export interface DaySummary { date: ISODate; steps: number; sodiumMg: number }

export interface Summary {
  days: DaySummary[]
  avgSteps: number
  avgSodiumMg: number
  stepGoalDays: number
  sodiumGoalDays: number
  workouts: Workout[]
  workoutsDone: number
  highlight: string
  focus: string
  mealTip?: string
}

const plural: Record<MealLog['mealType'], string> = {
  breakfast: 'Breakfasts', lunch: 'Lunches', dinner: 'Dinners', snack: 'Snacks',
}
const avg = (xs: number[]) => (xs.length ? Math.round(xs.reduce((a, b) => a + b, 0) / xs.length) : 0)
const n = (x: number) => x.toLocaleString('en-US')

/** Works for any range: a week, a month. Highlight = strongest daily metric, focus = weakest. */
export function summarize(input: {
  from: ISODate; to: ISODate; steps: StepEntry[]; meals: MealLog[]; workouts: Workout[]
}): Summary {
  const { stepGoal, sodiumGoal } = { stepGoal: config.steps.dailyGoal, sodiumGoal: config.sodium.dailyGoalMg }
  const days = datesBetween(input.from, input.to).map((date) => ({
    date,
    steps: input.steps.find((s) => s.date === date)?.steps ?? 0,
    sodiumMg: input.meals.filter((m) => m.date === date).reduce((a, m) => a + m.sodiumMg, 0),
  }))
  const total = days.length
  const stepGoalDays = days.filter((d) => d.steps >= stepGoal).length
  const sodiumGoalDays = days.filter((d) => d.sodiumMg < sodiumGoal).length

  const stepsText = `You reached ${n(stepGoal)} steps on ${stepGoalDays} of ${total} days`
  const sodiumText = `You stayed under your sodium goal ${sodiumGoalDays} of ${total} days`
  const sodiumStronger = sodiumGoalDays >= stepGoalDays

  const byMeal = new Map<MealLog['mealType'], number>()
  for (const m of input.meals) byMeal.set(m.mealType, (byMeal.get(m.mealType) ?? 0) + m.sodiumMg)
  const top = [...byMeal.entries()].sort((a, b) => b[1] - a[1])[0]?.[0]

  return {
    days,
    avgSteps: avg(days.map((d) => d.steps)),
    avgSodiumMg: avg(days.map((d) => d.sodiumMg)),
    stepGoalDays,
    sodiumGoalDays,
    workouts: input.workouts,
    workoutsDone: input.workouts.filter((w) => w.completed).length,
    highlight: sodiumStronger ? sodiumText : stepsText,
    focus: sodiumStronger
      ? `${stepsText}. A 10-minute walk after lunch adds about 1,000 steps.`
      : `${sodiumText}. Small swaps at one meal make the biggest difference.`,
    mealTip: top && `${plural[top]} were your highest-sodium meals. Try a lower-salt swap for one ${top}.`,
  }
}
