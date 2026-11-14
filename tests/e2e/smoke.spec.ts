import { test, expect } from '@playwright/test'

test('first-run flow reaches today', async ({ page }) => {
  await page.goto('')
  await page.getByRole('textbox').fill('Lesslie')
  await page.getByRole('button', { name: 'Continue' }).click()
  for (const option of ['10 to 20 minutes', 'More energy', 'Nothing in particular']) {
    await page.getByText(option).click()
    await page.getByRole('button', { name: 'Continue' }).click()
  }
  await page.getByText("I'm just getting started").click()
  await page.getByRole('button', { name: 'See my first habit' }).click()
  await page.getByRole('button', { name: 'Start my first week' }).click()
  await page.getByRole('link', { name: "Go to today's goals" }).click()
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Lesslie')
})

test('summary renders both periods', async ({ page }) => {
  await page.goto('#/summary')
  await expect(page.getByRole('heading', { level: 1, name: 'Weekly summary' })).toBeVisible()
  await page.getByRole('button', { name: 'Month' }).click()
  await expect(page.getByRole('heading', { level: 1, name: 'Monthly summary' })).toBeVisible()
})
