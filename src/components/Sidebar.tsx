import { NavLink, useNavigate } from 'react-router'
import { useRepos } from '../data/repoContext'

const items = [
  ['/today', 'Today'],
  ['/habits', 'My habits'],
  ['/learn', 'Learn'],
  ['/summary', 'Progress'],
] as const

export default function Sidebar() {
  const { mutate } = useRepos()
  const navigate = useNavigate()

  const reset = () => {
    mutate((r) => r.reset())
    navigate('/onboarding')
  }

  return (
    <aside className="no-print border-b border-line bg-surface px-4 py-4 md:sticky md:top-0 md:flex md:h-screen md:w-60 md:shrink-0 md:flex-col md:border-r md:border-b-0 md:px-5 md:py-8">
      <p className="text-lg font-bold text-primary-darkest">Small Steps</p>
      <nav aria-label="Main" className="mt-3 md:mt-8">
        <ul className="flex gap-1 overflow-x-auto md:flex-col">
          {items.map(([to, label]) => (
            <li key={to}>
              {/* NavLink sets aria-current="page" on the active link; we style off that. */}
              <NavLink
                to={to}
                className="flex min-h-11 items-center rounded-pill px-4 font-medium whitespace-nowrap text-muted hover:bg-bg aria-[current=page]:bg-primary-soft aria-[current=page]:text-primary-darkest"
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <button type="button" onClick={reset} className="mt-3 min-h-11 text-sm text-muted underline md:mt-auto md:text-left">
        Reset demo
      </button>
    </aside>
  )
}
