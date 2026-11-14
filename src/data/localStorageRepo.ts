import type { Repositories } from './repositories'
import { seed, type SeedData } from './seed'

const KEY = 'small-steps:v2'

function load(): SeedData {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw) as SeedData
  } catch {
    // Corrupt or unavailable storage: fall back to seed.
  }
  return structuredClone(seed)
}

function persist(data: SeedData): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(data))
  } catch {
    // Storage full/blocked: keep working in memory.
  }
}

const inRange = (d: string, from: string, to: string) => d >= from && d <= to

export function createLocalStorageRepositories(): Repositories {
  let data = load()
  const commit = () => persist(data)

  return {
    users: {
      get: (id) => data.users.find((u) => u.id === id),
      save: (user) => {
        data.users = [...data.users.filter((u) => u.id !== user.id), user]
        commit()
      },
    },
    habits: {
      listByUser: (userId) => data.habits.filter((h) => h.userId === userId),
      save: (habit) => {
        data.habits = [...data.habits.filter((h) => h.id !== habit.id), habit]
        commit()
      },
      replaceForUser: (userId, habits) => {
        data.habits = [...data.habits.filter((h) => h.userId !== userId), ...habits]
        commit()
      },
    },
    habitLogs: {
      listByHabit: (habitId) => data.habitLogs.filter((l) => l.habitId === habitId),
      setCompleted: (habitId, date, completed) => {
        data.habitLogs = [
          ...data.habitLogs.filter((l) => !(l.habitId === habitId && l.date === date)),
          { habitId, date, completed },
        ]
        commit()
      },
    },
    steps: {
      listRange: (userId, from, to) => data.steps.filter((s) => s.userId === userId && inRange(s.date, from, to)),
    },
    meals: {
      listRange: (userId, from, to) => data.meals.filter((m) => m.userId === userId && inRange(m.date, from, to)),
    },
    workouts: {
      listRange: (userId, from, to) =>
        data.workouts.filter((w) => w.userId === userId && inRange(w.scheduledDate, from, to)),
      save: (workout) => {
        data.workouts = [
          ...data.workouts.filter((w) => !(w.userId === workout.userId && w.scheduledDate === workout.scheduledDate)),
          workout,
        ]
        commit()
      },
    },
    reset: () => {
      try { localStorage.removeItem(KEY) } catch { /* ignore */ }
      data = structuredClone(seed)
    },
  }
}
