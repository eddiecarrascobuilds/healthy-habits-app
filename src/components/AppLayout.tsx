import { Outlet } from 'react-router'
import Sidebar from './Sidebar'

/** Sidebar + content. <Outlet /> renders whichever child route matched. */
export default function AppLayout() {
  return (
    <div className="min-h-screen md:flex">
      <Sidebar />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 md:px-10">
        <Outlet />
      </main>
    </div>
  )
}
