import type { ReactNode } from 'react'

export default function StatCard({ label, value, children }: { label: string; value: string; children?: ReactNode }) {
  return (
    <section className="card">
      <h2 className="label">{label}</h2>
      <p className="mt-2 text-3xl font-bold">{value}</p>
      {children && <div className="mt-1 text-sm text-muted">{children}</div>}
    </section>
  )
}
