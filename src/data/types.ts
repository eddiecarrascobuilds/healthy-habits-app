/** ISO date string, e.g. "2026-11-02". */
export type ISODate = string

export interface User {
  id: string
  name: string
  healthFocus: 'none' | 'sodium'
  onboardingAnswers: Record<string, string>
}

export type HabitType = 'walk' | 'vegetable' | 'water' | 'stretch' | 'low-sodium-lunch' | 'workout'

export interface Habit {
  id: string
  userId: string
  type: HabitType
  title: string
  reason: string
  status: 'active' | 'upcoming' | 'done'
  startedOn: ISODate
}

export interface HabitLog { habitId: string; date: ISODate; completed: boolean }
export interface StepEntry { userId: string; date: ISODate; steps: number }

export interface MealLog {
  userId: string
  date: ISODate
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  name: string
  calories: number
  sodiumMg: number
}

export interface Workout {
  userId: string
  scheduledDate: ISODate
  type: string
  completed: boolean
  movedFrom?: ISODate
}
