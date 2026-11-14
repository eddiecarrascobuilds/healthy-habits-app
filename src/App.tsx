import { Navigate, Route, Routes } from 'react-router'
import AppLayout from './components/AppLayout'
import { useRepos } from './data/repoContext'
import FirstHabit from './screens/FirstHabit'
import Habits from './screens/Habits'
import Learn from './screens/Learn'
import Onboarding from './screens/Onboarding'
import Summary from './screens/Summary'
import Today from './screens/Today'

function Home() {
  const { repos } = useRepos()
  const onboarded = Boolean(repos.users.get('lesslie')?.onboardingAnswers.name)
  return <Navigate to={onboarded ? '/today' : '/onboarding'} replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* Full-screen flow, no sidebar. */}
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/first-habit" element={<FirstHabit />} />
      {/* A layout route: these children render inside AppLayout's <Outlet />. */}
      <Route element={<AppLayout />}>
        <Route path="/today" element={<Today />} />
        <Route path="/habits" element={<Habits />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/summary" element={<Summary />} />
      </Route>
      <Route path="*" element={<Home />} />
    </Routes>
  )
}
