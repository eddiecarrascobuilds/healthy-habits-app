import type { Habit, HabitLog, MealLog, StepEntry, User, Workout } from './types'

export interface SeedData {
  users: User[]
  habits: Habit[]
  habitLogs: HabitLog[]
  steps: StepEntry[]
  meals: MealLog[]
  workouts: Workout[]
}

// Masha's week: Mon Nov 2 → Sun Nov 8, 2026.
const week = ['2026-11-02', '2026-11-03', '2026-11-04', '2026-11-05', '2026-11-06', '2026-11-07', '2026-11-08']
const mashaSteps = [7200, 8100, 12000, 6900, 8800, 9400, 7600]
const mashaSodium = [1900, 2100, 2600, 1800, 2200, 2500, 2000]

// Each day's sodium split across meals; lunch is the heaviest (drives the "focus" card).
const mealsFor = (date: string, totalMg: number): MealLog[] => {
  const split = [
    ['breakfast', 'Oatmeal with berries', 350, 0.15],
    ['lunch', 'Deli sandwich', 650, 0.5],
    ['dinner', 'Grilled chicken & rice', 600, 0.35],
  ] as const
  return split.map(([mealType, name, calories, share]) => ({
    userId: 'masha', date, mealType, name, calories, sodiumMg: Math.round(totalMg * share),
  }))
}

// October 2026 for the monthly view: deterministic, realistic-looking variation.
const october = Array.from({ length: 31 }, (_, i) => `2026-10-${String(i + 1).padStart(2, '0')}`)
const octSteps = october.map((_, i) => Math.round((8300 + 1700 * Math.sin(i * 2.1) + 800 * Math.sin(i * 0.45)) / 100) * 100)
const octSodium = october.map((_, i) => Math.round((2180 + 260 * Math.sin(i * 1.7 + 1) + 160 * Math.sin(i * 0.4)) / 50) * 50)
// Strength days: Mon / Thu / Sat. A few skipped (shown neutrally, never as failure).
const octWorkouts: Workout[] = october
  .filter((d) => [1, 4, 6].includes(new Date(`${d}T00:00:00Z`).getUTCDay()))
  .map((d, i) => ({
    userId: 'masha', scheduledDate: d, completed: i % 5 !== 3,
    type: ['Full body', 'Legs', 'Upper body'][i % 3]!,
  }))

export const seed: SeedData = {
  users: [
    { id: 'lesslie', name: 'Lesslie', healthFocus: 'none', onboardingAnswers: {} },
    { id: 'masha', name: 'Masha', healthFocus: 'sodium', onboardingAnswers: {} },
  ],
  habits: [
    {
      id: 'lesslie-walk', userId: 'lesslie', type: 'walk', title: 'A 10-minute walk',
      reason: 'A short walk lifts your energy without needing a gym or extra time. You can bring the baby along in the stroller.',
      status: 'active', startedOn: '2026-11-09',
    },
    {
      id: 'lesslie-veg', userId: 'lesslie', type: 'vegetable', title: 'Add a vegetable to dinner',
      reason: 'One extra vegetable a day is an easy next step.', status: 'upcoming', startedOn: '2026-11-23',
    },
  ],
  // Lesslie's current week: Mon done, Tue done, Wed missed, Thu done (3 of 4 days).
  habitLogs: [
    { habitId: 'lesslie-walk', date: '2026-11-09', completed: true },
    { habitId: 'lesslie-walk', date: '2026-11-10', completed: true },
    { habitId: 'lesslie-walk', date: '2026-11-11', completed: false },
    { habitId: 'lesslie-walk', date: '2026-11-12', completed: true },
  ],
  steps: [
    ...october.map((date, i) => ({ userId: 'masha', date, steps: octSteps[i]! })),
    ...week.map((date, i) => ({ userId: 'masha', date, steps: mashaSteps[i]! })),
  ],
  meals: [
    ...october.flatMap((date, i) => mealsFor(date, octSodium[i]!)),
    ...week.flatMap((date, i) => mealsFor(date, mashaSodium[i]!)),
  ],
  workouts: [
    ...octWorkouts,
    { userId: 'masha', scheduledDate: '2026-11-02', type: 'Full body', completed: true },
    { userId: 'masha', scheduledDate: '2026-11-05', type: 'Legs', completed: true, movedFrom: '2026-11-04' },
    { userId: 'masha', scheduledDate: '2026-11-07', type: 'Upper body', completed: true },
  ],
}
