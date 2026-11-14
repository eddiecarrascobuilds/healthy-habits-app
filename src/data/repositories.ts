import type { Habit, HabitLog, ISODate, MealLog, StepEntry, User, Workout } from './types'

/** Storage-agnostic contracts. Swap localStorage for an API later without touching UI/domain. */
export interface UserRepository {
  get(id: string): User | undefined
  save(user: User): void
}

export interface HabitRepository {
  listByUser(userId: string): Habit[]
  save(habit: Habit): void
  /** Replaces all of a user's habits (used when starting a new plan). */
  replaceForUser(userId: string, habits: Habit[]): void
}

export interface HabitLogRepository {
  listByHabit(habitId: string): HabitLog[]
  setCompleted(habitId: string, date: ISODate, completed: boolean): void
}

export interface StepRepository {
  listRange(userId: string, from: ISODate, to: ISODate): StepEntry[]
}

export interface MealRepository {
  listRange(userId: string, from: ISODate, to: ISODate): MealLog[]
}

export interface WorkoutRepository {
  listRange(userId: string, from: ISODate, to: ISODate): Workout[]
  save(workout: Workout): void
}

export interface Repositories {
  users: UserRepository
  habits: HabitRepository
  habitLogs: HabitLogRepository
  steps: StepRepository
  meals: MealRepository
  workouts: WorkoutRepository
  /** Clears stored data and restores the seed ("Reset demo"). */
  reset(): void
}
