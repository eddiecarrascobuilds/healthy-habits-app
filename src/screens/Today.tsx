import { Link, Navigate } from 'react-router'
import HabitCard from '../components/HabitCard'
import StatCard from '../components/StatCard'
import { useRepos } from '../data/repoContext'
import { config } from '../domain/config'
import { mondayOf, monthDay, weekdayLong } from '../domain/dates'
import { longestStreak } from '../domain/streaks'
import { weekDays } from '../domain/weekProgress'

const greeting = (hour: number) => (hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening')

export default function Today() {
  const { repos, mutate } = useRepos()
  const user = repos.users.get('lesslie')
  if (!user?.onboardingAnswers.name) return <Navigate to="/onboarding" replace />

  const today = config.demoToday
  const habits = repos.habits.listByUser(user.id)
  const active = habits.filter((h) => h.status === 'active')
  const next = habits.filter((h) => h.status === 'upcoming').sort((a, b) => a.startedOn.localeCompare(b.startedOn))[0]

  // Derive everything during render from the repos — no copies in state to keep in sync.
  const goals = active.map((habit) => {
    const logs = repos.habitLogs.listByHabit(habit.id)
    return {
      habit,
      logs,
      days: weekDays(logs, mondayOf(today), today, habit.startedOn),
      doneToday: logs.some((l) => l.date === today && l.completed),
    }
  })
  const doneCount = goals.filter((g) => g.doneToday).length
  const best = Math.max(0, ...goals.map((g) => longestStreak(g.logs)))

  return (
    <>
      <p className="label">{weekdayLong(today)}, {monthDay(today)}</p>
      <h1 className="mt-1 text-3xl font-bold">{greeting(new Date().getHours())}, {user.name}</h1>

      <section aria-labelledby="goals" className="mt-8">
        <div className="flex items-baseline justify-between">
          <h2 id="goals" className="text-lg font-bold">Today's goals</h2>
          {/* aria-live announces the count change after a toggle. */}
          <p className="text-sm text-muted" aria-live="polite">{doneCount} of {goals.length} done</p>
        </div>
        {goals.length === 0 ? (
          <p className="card mt-3 text-muted">No habits yet. <Link to="/habits" className="font-semibold text-primary underline">Pick one to start</Link>.</p>
        ) : (
          <div className="mt-3 grid gap-4">
            {goals.map((g) => (
              <HabitCard
                key={g.habit.id} habit={g.habit} days={g.days} doneToday={g.doneToday}
                onToggle={() => mutate((r) => r.habitLogs.setCompleted(g.habit.id, today, !g.doneToday))}
              />
            ))}
          </div>
        )}
      </section>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <StatCard label="Longest streak" value={`${best} ${best === 1 ? 'day' : 'days'}`}>
          Every day you show up counts, streak or not.
        </StatCard>
        {next && (
          <section className="rounded-card border-2 border-dashed border-dash p-6">
            <h2 className="label">Coming up</h2>
            <p className="mt-2 text-lg font-bold">{next.title}</p>
            <span className="mt-3 inline-block rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary-darkest">
              Unlocks {monthDay(next.startedOn)}
            </span>
          </section>
        )}
      </div>
    </>
  )
}
