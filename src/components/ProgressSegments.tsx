export default function ProgressSegments({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex gap-1.5" aria-hidden="true">
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={`h-1.5 flex-1 rounded-full ${i <= current ? 'bg-primary' : 'bg-line'}`} />
      ))}
    </div>
  )
}
