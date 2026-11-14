import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import App from '../../src/App'
import { RepoProvider } from '../../src/data/RepoProvider'

export function renderApp(path = '/') {
  localStorage.clear()
  return render(
    <MemoryRouter initialEntries={[path]}>
      <RepoProvider><App /></RepoProvider>
    </MemoryRouter>,
  )
}
