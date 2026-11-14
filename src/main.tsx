import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router'
import App from './App'
import { RepoProvider } from './data/RepoProvider'
import './styles/index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <RepoProvider>
        <App />
      </RepoProvider>
    </HashRouter>
  </StrictMode>,
)
