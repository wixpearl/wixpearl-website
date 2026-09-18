import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test('homepage exposes the core proposition and working CTAs', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Software engineered around your business'
  )
  await page.getByRole('link', { name: 'Discuss your project' }).click()
  await expect(page).toHaveURL(/\/contact$/)
})

test('service navigation and detail routes work', async ({ page }) => {
  await page.goto('/services')
  await page
    .getByRole('link', { name: /Custom software/i })
    .first()
    .click()
  await expect(page).toHaveURL(/\/services\/custom-software-development$/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Custom software development')
})

test('contact form returns accessible validation feedback', async ({ page }) => {
  await page.goto('/contact')
  await page.getByRole('button', { name: 'Send project inquiry' }).click()
  await expect(page.getByLabel('Name')).toBeFocused()
})

test('unknown routes use the custom 404', async ({ page }) => {
  const response = await page.goto('/not-a-real-route')
  expect(response?.status()).toBe(404)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('not available')
})

test('mobile navigation opens and routes with the keyboard', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Mobile navigation is only visible in the mobile project.')
  await page.goto('/')
  await page.getByRole('button', { name: 'Open navigation' }).focus()
  await page.keyboard.press('Enter')
  await page
    .getByRole('navigation', { name: 'Mobile navigation' })
    .getByRole('link', { name: 'About' })
    .click()
  await expect(page).toHaveURL(/\/about$/)
})

test('legal and discovery surfaces remain reachable', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'Privacy' }).click()
  await expect(page).toHaveURL(/\/privacy$/)

  const sitemap = await page.request.get('/sitemap.xml')
  expect(sitemap.ok()).toBe(true)
  expect(await sitemap.text()).toContain('/services/custom-software-development')

  const unpublished = await page.goto('/case-studies/unpublished-example')
  expect(unpublished?.status()).toBe(404)
})

test('core pages have no automatically detectable accessibility violations', async ({ page }) => {
  for (const path of ['/', '/services', '/about', '/contact']) {
    await page.goto(path)
    const results = await new AxeBuilder({ page }).analyze()
    expect(results.violations, `Accessibility violations on ${path}`).toEqual([])
  }
})
