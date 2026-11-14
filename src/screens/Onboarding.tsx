import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import ProgressSegments from '../components/ProgressSegments'
import { useRepos } from '../data/repoContext'
import { questions } from './onboardingQuestions'

const USER_ID = 'lesslie' // Demo user; becomes the signed-in user later.

export default function Onboarding() {
  const { repos, mutate } = useRepos()
  const navigate = useNavigate()
  // useState holds values that survive re-renders; calling the setter re-renders.
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})

  const q = questions[step]!
  const value = answers[q.id] ?? ''
  const isLast = step === questions.length - 1
  const set = (v: string) => setAnswers({ ...answers, [q.id]: v })

  function submit(e: FormEvent) {
    e.preventDefault() // Stop the browser's default full-page form submit.
    if (!value.trim()) return
    if (!isLast) return setStep(step + 1)

    const user = repos.users.get(USER_ID)!
    mutate((r) => r.users.save({
      ...user,
      name: answers.name!.trim(),
      healthFocus: answers.watch === 'sodium' ? 'sodium' : 'none',
      onboardingAnswers: answers,
    }))
    navigate('/first-habit')
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col px-4 py-8">
      <p className="label">Question {step + 1} of {questions.length}</p>
      <div className="mt-3"><ProgressSegments current={step} total={questions.length} /></div>

      <form onSubmit={submit} className="mt-10 flex flex-1 flex-col">
        {/* key={q.id} gives each question a fresh fieldset, so focus/scroll reset between steps. */}
        <fieldset key={q.id} aria-describedby={q.hint ? 'q-hint' : undefined}>
          <legend><h1 className="text-2xl font-bold sm:text-3xl">{q.text}</h1></legend>
          {q.hint && <p id="q-hint" className="mt-2 text-muted">{q.hint}</p>}

          {q.kind === 'text' ? (
            <div className="mt-6">
              <label htmlFor="answer" className="sr-only">{q.text}</label>
              <input
                id="answer" autoFocus autoComplete="given-name" value={value}
                onChange={(e) => set(e.target.value)}
                className="min-h-14 w-full rounded-card border-2 border-line bg-surface px-5 text-lg focus:border-primary"
              />
            </div>
          ) : (
            <div className="mt-6 grid gap-3">
              {q.options!.map((o) => (
                // Real radio inputs (keyboard + screen reader support for free), visually hidden.
                // `has-checked:` styles the card when the radio inside it is checked.
                <label
                  key={o.value}
                  className="flex min-h-16 cursor-pointer items-center gap-4 rounded-card border-2 border-line bg-surface px-5 text-lg font-medium has-checked:border-primary has-checked:bg-primary-soft has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-primary"
                >
                  <input type="radio" name={q.id} value={o.value} checked={value === o.value} onChange={() => set(o.value)} className="peer sr-only" />
                  <span aria-hidden="true" className="size-5 shrink-0 rounded-full border-2 border-outline peer-checked:border-6 peer-checked:border-primary" />
                  {o.label}
                </label>
              ))}
            </div>
          )}
        </fieldset>

        <div className="mt-auto flex gap-3 pt-10">
          {step > 0 && (
            <button type="button" onClick={() => setStep(step - 1)} className="min-h-12 flex-1 rounded-pill border-2 border-line bg-surface px-6 font-semibold">
              Back
            </button>
          )}
          <button type="submit" disabled={!value.trim()} className="btn-primary flex-1 disabled:cursor-not-allowed disabled:opacity-50">
            {isLast ? 'See my first habit' : 'Continue'}
          </button>
        </div>
      </form>
    </main>
  )
}
