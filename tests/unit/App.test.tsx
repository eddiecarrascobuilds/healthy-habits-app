import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderApp } from './renderApp'

// Recharts' ResponsiveContainer needs ResizeObserver, which jsdom lacks.
globalThis.ResizeObserver ??= class { observe() {} unobserve() {} disconnect() {} }

it('onboarding → first habit → habits list → today', async () => {
  const user = userEvent.setup()
  renderApp('/')

  expect(screen.getByText('Question 1 of 5')).toBeInTheDocument()
  await user.type(screen.getByRole('textbox'), 'Lesslie')
  await user.click(screen.getByRole('button', { name: 'Continue' }))
  await user.click(screen.getByRole('radio', { name: '10 to 20 minutes' }))
  await user.click(screen.getByRole('button', { name: 'Continue' }))
  await user.click(screen.getByRole('radio', { name: 'More energy' }))
  await user.click(screen.getByRole('button', { name: 'Continue' }))
  await user.click(screen.getByRole('radio', { name: 'Nothing in particular' }))
  await user.click(screen.getByRole('button', { name: 'Continue' }))
  await user.click(screen.getByRole('radio', { name: "I'm just getting started" }))
  await user.click(screen.getByRole('button', { name: 'See my first habit' }))

  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('A 10-minute walk')
  await user.click(screen.getByRole('button', { name: 'Start my first week' }))

  expect(screen.getByRole('heading', { level: 1, name: 'My habits' })).toBeInTheDocument()
  await user.click(screen.getByRole('link', { name: "Go to today's goals" }))

  expect(screen.getByText('0 of 1 done')).toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: "Mark today's walk" }))
  expect(screen.getByRole('button', { name: 'Walked today' })).toHaveAttribute('aria-pressed', 'true')
  expect(screen.getByText('1 of 1 done')).toBeInTheDocument()
})

it('summary switches between week and month', async () => {
  const user = userEvent.setup()
  renderApp('/summary')
  expect(screen.getByRole('heading', { level: 1, name: 'Weekly summary' })).toBeInTheDocument()
  expect(screen.getByText('You stayed under your sodium goal 5 of 7 days')).toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: 'Month' }))
  expect(screen.getByRole('heading', { level: 1, name: 'Monthly summary' })).toBeInTheDocument()
})
