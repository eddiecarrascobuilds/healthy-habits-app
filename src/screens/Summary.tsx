import { useSearchParams } from 'react-router'
import StatCard from '../components/StatCard'
import TrendChart from '../components/TrendChart'
import { useRepos } from '../data/repoContext'
import { config } from '../domain/config'
import { monthDay, monthYear, weekdayShort } from '../domain/dates'
import { summarize } from '../domain/weeklySummary'

const USER_ID = 'masha' // Demo: the summary shows Masha's data.
const periods = {
  week: { from: '2026-11-02', to: '2026-11-08', title: 'Weekly summary' },
  month: { from: '2026-10-01', to: '2026-10-31', title: 'Monthly summary' },
} as const
type Period = keyof typeof periods

const n = (x: number) => x.toLocaleString('en-US')

export default function Summary() {
  const { repos } = useRepos()
  // The view lives in the URL (#/summary?view=month), so it survives refresh and can be linked.
  const [params, setParams] = useSearchParams()
  const view: Period = params.get('view') === 'month' ? 'month' : 'week'
  const p = periods[view]

  const user = repos.users.get(USER_ID)!
  const s = summarize({
    from: p.from, to: p.to,
    steps: repos.steps.listRange(USER_ID, p.from, p.to),
    meals: repos.meals.listRange(USER_ID, p.from, p.to),
    workouts: repos.workouts.listRange(USER_ID, p.from, p.to),
  })
  const label = (d: string) => (view === 'week' ? weekdayShort(d) : monthDay(d))
  const range = view === 'week' ? `${monthDay(p.from)} – ${monthDay(p.to)}` : monthYear(p.from)

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label">{user.name}'s progress · {range}</p>
          <h1 className="mt-1 text-3xl font-bold">{p.title}</h1>
        </div>
        <div className="no-print flex gap-3">
          <div role="group" aria-label="Summary period" className="flex rounded-pill border border-line bg-surface p-1">
            {(['week', 'month'] as const).map((v) => (
              <button
                key={v} type="button" aria-pressed={view === v}
                onClick={() => setParams(v === 'week' ? {} : { view: v })}
                className="min-h-11 rounded-pill px-5 font-semibold text-muted aria-pressed:bg-primary aria-pressed:text-white"
              >
                {v === 'week' ? 'Week' : 'Month'}
              </button>
            ))}
          </div>
          <button type="button" onClick={() => window.print()} className="btn-primary">Save as report</button>
        </div>
      </div>

      <section className="mt-8 rounded-card bg-primary-darkest p-6 text-white">
        <h2 className="text-xs font-semibold tracking-widest uppercase opacity-80">Highlight</h2>
        <p className="mt-2 text-2xl font-bold">{s.highlight}</p>
      </section>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <StatCard label="Average steps" value={n(s.avgSteps)}>Goal met on {s.stepGoalDays} of {s.days.length} days</StatCard>
        <StatCard label="Average sodium" value={`${n(s.avgSodiumMg)} mg`}>Under goal on {s.sodiumGoalDays} of {s.days.length} days</StatCard>
        <StatCard label="Workouts" value={`${s.workoutsDone} of ${s.workouts.length}`}>completed</StatCard>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <TrendChart
          title="Daily steps" unit="steps" goal={config.steps.dailyGoal} goalLabel={`${n(config.steps.dailyGoal)} steps`}
          data={s.days.map((d) => ({ label: label(d.date), value: d.steps }))}
        />
        <TrendChart
          title="Daily sodium" unit="mg" goal={config.sodium.dailyGoalMg} goalLabel={`under ${n(config.sodium.dailyGoalMg)} mg`}
          data={s.days.map((d) => ({ label: label(d.date), value: d.sodiumMg }))}
          isOverGoal={(v) => v >= config.sodium.dailyGoalMg}
        />
      </div>

      {view === 'week' && (
        <section className="card mt-4">
          <h2 className="label">Workouts</h2>
          <p className="mt-2 text-xl font-bold">{s.workoutsDone} of {s.workouts.length} completed</p>
          <ul className="mt-3 divide-y divide-line">
            {s.workouts.map((w) => (
              <li key={w.scheduledDate} className="flex justify-between py-3">
                <span><span className="font-semibold">{weekdayShort(w.scheduledDate)}</span> · {w.type}</span>
                <span className="text-sm text-muted">
                  {w.movedFrom ? `Moved from ${weekdayShort(w.movedFrom)}` : ''}{w.completed ? '' : ' Not logged'}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="card mt-4">
        <h2 className="label">Focus for next {view}</h2>
        <p className="mt-2 text-lg font-semibold">{s.focus}</p>
        {s.mealTip && <p className="mt-2 text-muted">{s.mealTip}</p>}
      </section>
    </>
  )
}
