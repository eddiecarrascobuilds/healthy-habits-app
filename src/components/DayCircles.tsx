import type { DayStatus } from '../domain/weekProgress'
import Check from './Check'

const words = { done: 'done', missed: 'not logged', today: 'today, not yet logged', upcoming: 'coming up', before: 'before this habit started' }

// Each state differs by fill AND border style AND icon, so color is never the only signal.
const circle = {
  done: 'bg-primary border-primary text-white',
  missed: 'border-outline',
  today: 'border-dashed border-primary-deep',
  upcoming: 'border-dashed border-dash',
  before: 'border-dash bg-bg',
}

export default function DayCircles({ days }: { days: DayStatus[] }) {
  return (
    <ol className="flex justify-between gap-1" aria-label="This week">
      {days.map((d) => (
        <li key={d.date} className="flex flex-col items-center gap-1.5">
          <span className={`flex size-10 items-center justify-center rounded-full border-2 ${circle[d.state]}`}>
            {d.state === 'done' && <Check />}
          </span>
          <span className={`text-xs ${d.state === 'today' ? 'font-bold text-ink' : 'text-muted'}`}>
            {d.label}
            <span className="sr-only">: {words[d.state]}</span>
          </span>
        </li>
      ))}
    </ol>
  )
}
