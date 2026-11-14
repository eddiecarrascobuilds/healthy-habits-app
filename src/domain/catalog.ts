import type { Habit, HabitType, ISODate } from '../data/types'
import { config } from './config'
import { addDays } from './dates'

export type Answers = Record<string, string>

interface Template {
  title: string
  reason: string
  tags: string[]
  /** Today screen copy. */
  goal: string
  action: string
  done: string
}

const walkMinutes: Record<string, number> = { lt10: 5, '10-20': 10, '20-40': 15, '40plus': 20 }

export function template(type: HabitType, answers: Answers = {}): Template {
  const m = walkMinutes[answers.freeTime ?? ''] ?? 10
  switch (type) {
    case 'walk':
      return {
        title: `A ${m}-minute walk`,
        reason: 'A short walk lifts your energy and needs no gym or gear. Doing it at the same time each day helps it stick.',
        tags: [`${m} minutes a day`, answers.goal === 'calm' ? 'Leave your phone behind' : 'No equipment needed'],
        goal: `Take a ${m}-minute walk`, action: "Mark today's walk", done: 'Walked today',
      }
    case 'vegetable':
      return {
        title: 'Add a vegetable to dinner',
        reason: 'One extra vegetable a day adds fiber and vitamins. Frozen ones count too.',
        tags: ['Once a day', 'Any vegetable counts'],
        goal: 'Add a vegetable to dinner', action: "Mark today's vegetable", done: 'Added a vegetable',
      }
    case 'water':
      return {
        title: 'A glass of water with each meal',
        reason: 'Pairing water with meals makes it easy to remember. Many people feel more awake within a week.',
        tags: ['3 glasses a day', 'Pairs with meals'],
        goal: 'Drink a glass of water with each meal', action: "Mark today's water", done: 'Had my water',
      }
    case 'stretch':
      return {
        title: 'Stretch for 5 minutes before bed',
        reason: 'Gentle stretching helps your body wind down. It can make falling asleep a little easier.',
        tags: ['5 minutes', 'Before bed'],
        goal: 'Stretch for 5 minutes before bed', action: "Mark today's stretch", done: 'Stretched today',
      }
    case 'low-sodium-lunch':
      return {
        title: 'Pick a lower-salt lunch',
        reason: 'Lunch is often the saltiest meal of the day. Swapping deli meat or canned soup for a homemade option adds up.',
        tags: ['Once a day', 'Under 800 mg'],
        goal: 'Pick a lower-salt lunch', action: "Mark today's lunch", done: 'Lower-salt lunch',
      }
    case 'workout':
      return {
        title: 'A short strength workout',
        reason: 'Two or three short sessions a week build strength. Start light and focus on form.',
        tags: ['20 minutes', '3 times a week'],
        goal: "Do today's workout", action: "Mark today's workout", done: 'Workout done',
      }
  }
}

/** One active habit now, the rest unlock later (the user may start them early). */
export function recommendHabits(userId: string, answers: Answers, today: ISODate): Habit[] {
  const upcoming: HabitType[] = ['vegetable', 'water', 'stretch']
  if (answers.watch === 'sodium') upcoming.unshift('low-sodium-lunch')
  if (answers.activity === 'most') upcoming.push('workout')
  const unlockOn = addDays(today, config.nextHabit.afterDays)

  return (['walk', ...upcoming] as HabitType[]).map((type, i) => {
    const t = template(type, answers)
    return {
      id: `${userId}-${type}`, userId, type, title: t.title, reason: t.reason,
      status: i === 0 ? 'active' : 'upcoming',
      startedOn: i === 0 ? today : unlockOn,
    }
  })
}
