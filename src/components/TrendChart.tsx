import { CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { colors } from '../styles/tokens'

interface Point { label: string; value: number }
interface Props {
  title: string
  data: Point[]
  goal: number
  goalLabel: string
  unit: string
  /** Points for which this returns true get a hollow orange dot. */
  isOverGoal?: (value: number) => boolean
}
interface DotArgs { cx?: number; cy?: number; index?: number; payload?: Point }

const fmt = (v: number) => v.toLocaleString('en-US')

export default function TrendChart({ title, data, goal, goalLabel, unit, isOverGoal }: Props) {
  const over = data.filter((d) => isOverGoal?.(d.value))
  const summary =
    `${title}. ${data.map((d) => `${d.label} ${fmt(d.value)}`).join(', ')}. Goal: ${goalLabel}.` +
    (over.length ? ` Over goal on ${over.map((d) => d.label).join(', ')}.` : '')

  return (
    <section className="card">
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="text-sm text-muted">Goal: {goalLabel}</p>
      {/* role="img" + aria-label: screen readers get the numbers instead of SVG noise. */}
      <div role="img" aria-label={summary} className="mt-4 h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
            <CartesianGrid stroke={colors.line} vertical={false} />
            <XAxis dataKey="label" tick={{ fill: colors.muted, fontSize: 12 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
            <YAxis tick={{ fill: colors.muted, fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={fmt} width={56} />
            <Tooltip formatter={(v) => [`${fmt(Number(v))} ${unit}`, title]} />
            <ReferenceLine y={goal} stroke={colors.muted} strokeDasharray="6 4" />
            <Line
              type="monotone" dataKey="value" stroke={colors.primary} strokeWidth={2.5} isAnimationActive={false}
              dot={(raw: unknown) => {
                const p = raw as DotArgs
                const hot = p.payload ? isOverGoal?.(p.payload.value) : false
                return hot
                  ? <circle key={p.index} cx={p.cx} cy={p.cy} r={6} fill="#fff" stroke={colors.warm} strokeWidth={2.5} />
                  : <circle key={p.index} cx={p.cx} cy={p.cy} r={data.length > 10 ? 2.5 : 4} fill={colors.primary} />
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted" aria-hidden="true">
        <span><span className="mr-1.5 inline-block w-5 border-t-2 border-dashed border-muted align-middle" />Goal</span>
        {isOverGoal && (
          <span><span className="mr-1.5 inline-block size-3 rounded-full border-2 border-warm align-middle" />Over goal</span>
        )}
      </p>
    </section>
  )
}
