import { Navigate, useNavigate } from 'react-router'
import DayCircles from '../components/DayCircles'
import Tag from '../components/Tag'
import { useRepos } from '../data/repoContext'
import { recommendHabits, template } from '../domain/catalog'
import { config } from '../domain/config'
import { mondayOf } from '../domain/dates'
import { weekDays } from '../domain/weekProgress'

export default function FirstHabit() {
  const { repos, mutate } = useRepos()
  const navigate = useNavigate()
  const user = repos.users.get('lesslie')
  const answers = user?.onboardingAnswers ?? {}

  // <Navigate> is a redirect you render: no answers yet → back to onboarding.
  if (!user || !answers.name) return <Navigate to="/onboarding" replace />

  const plan = recommendHabits(user.id, answers, config.demoToday)
  const first = plan[0]!
  const t = template(first.type, answers)
  const emptyWeek = weekDays([], mondayOf(config.demoToday), '9999-12-31').map((d) => ({ ...d, state: 'upcoming' as const }))

  const start = () => {
    mutate((r) => r.habits.replaceForUser(user.id, plan))
    navigate('/habits')
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-4 py-8">
      <p className="label">Nice to meet you, {user.name}</p>
      <article className="card mt-4 p-8">
        <h1 className="text-2xl font-bold sm:text-3xl">
          <span className="block text-base font-semibold text-primary">Your first habit:</span>
          {t.title}
        </h1>
        <p className="mt-4 text-muted">{t.reason}</p>
        <ul className="mt-5 flex flex-wrap gap-2">{t.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}</ul>
        <div className="mt-8"><DayCircles days={emptyWeek} /></div>
        <p className="mt-6 text-sm text-muted">That's all for this week. When it starts to feel easy, we'll suggest the next small step.</p>
        <button type="button" onClick={start} className="btn-primary mt-6 w-full">Start my first week</button>
      </article>
    </main>
  )
}
