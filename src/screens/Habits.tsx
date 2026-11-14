import { Link } from 'react-router'
import Tag from '../components/Tag'
import { useRepos } from '../data/repoContext'
import type { Habit } from '../data/types'
import { template } from '../domain/catalog'
import { config } from '../domain/config'
import { monthDay } from '../domain/dates'

export default function Habits() {
  const { repos, mutate } = useRepos()
  const user = repos.users.get('lesslie')!
  const habits = repos.habits.listByUser(user.id)
  const active = habits.filter((h) => h.status === 'active')
  const upcoming = habits.filter((h) => h.status === 'upcoming').sort((a, b) => a.startedOn.localeCompare(b.startedOn))

  const startEarly = (h: Habit) =>
    mutate((r) => r.habits.save({ ...h, status: 'active', startedOn: config.demoToday }))

  return (
    <>
      <h1 className="text-3xl font-bold">My habits</h1>
      <p className="mt-2 text-muted">One small step at a time. New habits unlock as the current ones settle in.</p>

      <section className="mt-8" aria-labelledby="now">
        <h2 id="now" className="label">Doing now</h2>
        <ul className="mt-3 grid gap-4">
          {active.map((h) => {
            const t = template(h.type, user.onboardingAnswers)
            return (
              <li key={h.id} className="card">
                <h3 className="text-xl font-bold">{h.title}</h3>
                <p className="mt-2 text-muted">{h.reason}</p>
                <ul className="mt-4 flex flex-wrap gap-2">{t.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}</ul>
              </li>
            )
          })}
        </ul>
        <Link to="/today" className="btn-primary mt-5">Go to today's goals</Link>
      </section>

      {upcoming.length > 0 && (
        <section className="mt-10" aria-labelledby="next">
          <h2 id="next" className="label">Coming up</h2>
          <ul className="mt-3 grid gap-4 sm:grid-cols-2">
            {upcoming.map((h) => (
              <li key={h.id} className="flex flex-col rounded-card border-2 border-dashed border-dash p-6">
                <span className="self-start rounded-full bg-bg px-3 py-1 text-xs font-semibold text-muted">
                  Unlocks {monthDay(h.startedOn)}
                </span>
                <h3 className="mt-3 text-lg font-bold">{h.title}</h3>
                <p className="mt-1 flex-1 text-sm text-muted">{h.reason}</p>
                <button type="button" onClick={() => startEarly(h)} className="mt-4 min-h-11 self-start rounded-pill border-2 border-line bg-surface px-5 text-sm font-semibold">
                  Start early<span className="sr-only">: {h.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  )
}
