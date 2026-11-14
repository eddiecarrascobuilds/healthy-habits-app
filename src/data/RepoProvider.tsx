import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { RepoContext } from './repoContext'
import type { Repositories } from './repositories'
import { createLocalStorageRepositories } from './localStorageRepo'

export function RepoProvider({ children, repos: given }: { children: ReactNode; repos?: Repositories }) {
  // useState(() => ...) runs the factory once, on first render only.
  const [repos] = useState(() => given ?? createLocalStorageRepositories())
  const [version, setVersion] = useState(0)

  const mutate = useCallback((fn: (r: Repositories) => void) => {
    fn(repos)
    setVersion((v) => v + 1)
  }, [repos])

  // A new value object on each write tells React that every consumer must re-render.
  const value = useMemo(() => ({ repos, mutate, version }), [repos, mutate, version])
  return <RepoContext.Provider value={value}>{children}</RepoContext.Provider>
}
