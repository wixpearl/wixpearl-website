import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test('homepage exposes the core proposition and working CTAs', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Software shaped around how your business works'
  )
  await page.getByRole('link', { name: 'Discuss your project' }).click()
  await expect(page).toHaveURL(/\/contact$/)
})

test('shared brand logo renders its mark and accessible wordmark', async ({ page }) => {
  await page.goto('/')

  const logo = page.locator('header').getByRole('link', { name: 'WixPearl home' })
  await expect(logo).toBeVisible()
  await expect(logo).toContainText('WixPearl')
  await expect(logo.locator('[data-slot="logo-mark"]')).toBeVisible()
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

test('cinematic hero keeps its capability nodes visible', async ({ page }) => {
  await page.goto('/')

  const hero = page.locator('[data-slot="hero-system"]')
  await expect(hero).toBeVisible()
  await expect(hero.getByRole('listitem')).toHaveCount(4)
  await expect(hero.getByText('Software', { exact: true })).toBeVisible()
  await expect(hero.getByText('Practical AI', { exact: true })).toBeVisible()
  await expect(hero.getByText('Automation', { exact: true })).toBeVisible()
  await expect(hero.getByText('Consulting', { exact: true })).toBeVisible()
  await expect(hero.locator('[data-slot="hero-pearl-logo"]')).toBeVisible()
})

test('cinematic hero respects reduced-motion preferences', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')

  const orbit = page.locator('.hero-orbit')
  await expect(orbit).toBeVisible()
  await expect(orbit).toHaveCSS('animation-name', 'none')
  await expect(page.locator('.hero-pearl-breathe').first()).toHaveCSS('animation-name', 'none')
  await expect(
    page.locator('.hero-pearl-sheen').first(),
    'Pearl sheen should remain visible'
  ).toBeVisible()
  await expect
    .poll(() =>
      page
        .locator('.hero-pearl-sheen')
        .first()
        .evaluate((element) => getComputedStyle(element, '::before').animationName)
    )
    .toBe('none')
  await expect(page.locator('[data-slot="hero-system"]')).toContainText('One connected system')
})

test('core routes do not create horizontal overflow', async ({ page }) => {
  for (const path of ['/', '/services', '/about', '/contact']) {
    await page.goto(path)
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth
    )
    expect(overflow, `Horizontal overflow on ${path}`).toBe(false)
  }
})

test('theme control switches the visual system to dark mode', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Desktop theme control is hidden behind mobile navigation.')
  await page.emulateMedia({ colorScheme: 'light' })
  await page.goto('/')
  await page.getByRole('button', { name: 'Toggle color theme' }).click()
  await expect(page.locator('html')).toHaveClass(/dark/)
})

test('primary content remains available without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()

  await page.goto('http://127.0.0.1:3002/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Software shaped around how your business works'
  )
  await expect(page.getByRole('link', { name: 'Discuss your project' })).toBeVisible()

  await context.close()
})
