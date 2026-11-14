/** All domain thresholds in one place. */
export const config = {
  /** The demo runs on a fixed "today" so the seed data always lines up. */
  demoToday: '2026-11-13',
  nextHabit: { afterDays: 14, minCompleted: 10 },
  sodium: { mealFlagMg: 800, dailyGoalMg: 2300 },
  steps: { dailyGoal: 8000 },
  reschedule: { highStepThreshold: 11000 },
} as const
