import { createContext, useContext } from 'react'
import type { Repositories } from './repositories'

export interface RepoContextValue {
  repos: Repositories
  /** Run a write, then re-render everything that reads from `repos`. */
  mutate: (fn: (repos: Repositories) => void) => void
}

export const RepoContext = createContext<RepoContextValue | null>(null)

export function useRepos(): RepoContextValue {
  const ctx = useContext(RepoContext)
  if (!ctx) throw new Error('useRepos must be used inside <RepoProvider>')
  return ctx
}
