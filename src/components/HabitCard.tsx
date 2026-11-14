import type { Habit } from '../data/types'
import { template } from '../domain/catalog'
import type { DayStatus } from '../domain/weekProgress'
import { weekMessage } from '../domain/weekProgress'
import Check from './Check'
import DayCircles from './DayCircles'

interface Props {
  habit: Habit
  days: DayStatus[]
  doneToday: boolean
  onToggle: () => void
}

export default function HabitCard({ habit, days, doneToday, onToggle }: Props) {
  const t = template(habit.type)
  return (
    <article className="card">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="label">Daily goal</p>
          <h3 className="mt-1 text-xl font-bold">{t.goal}</h3>
        </div>
        {/* aria-pressed makes this a toggle button for screen readers. */}
        <button
          type="button"
          aria-pressed={doneToday}
          onClick={onToggle}
          className={doneToday
            ? 'inline-flex min-h-12 items-center gap-2 rounded-pill bg-primary-soft px-6 font-semibold text-primary-darkest'
            : 'btn-primary'}
        >
          {doneToday && <Check />}
          {doneToday ? t.done : t.action}
        </button>
      </div>
      <p className="mt-3 text-muted">{weekMessage(days)}</p>
      <div className="mt-5"><DayCircles days={days} /></div>
    </article>
  )
}
