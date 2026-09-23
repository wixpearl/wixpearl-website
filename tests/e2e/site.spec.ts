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
  await expect(hero).toHaveCount(1)
  await expect(hero.getByRole('listitem')).toHaveCount(4)
  await expect(hero.getByText('Software', { exact: true })).toBeVisible()
  await expect(hero.getByText('Practical AI', { exact: true })).toBeVisible()
  await expect(hero.getByText('Automation', { exact: true })).toBeVisible()
  await expect(hero.getByText('Consulting', { exact: true })).toBeVisible()
  await expect(hero.locator('[data-slot="hero-pearl-logo"]')).toHaveCount(1)
})

test('hero pearl becomes an interactive decorative particle system', async ({ page }) => {
  await page.goto('/')

  const host = page.locator('[data-particle-host]')
  const logo = page.locator('[data-particles-hero-logo]')
  const canvas = page.locator('canvas[data-particles-target]')

  await expect(host).toHaveAttribute('data-particles-ready', 'true', { timeout: 20_000 })
  await expect(host).toHaveAttribute('data-particles-motion', 'animated')
  await expect(canvas).toHaveCount(1)
  await expect(canvas).toHaveAttribute('aria-hidden', 'true')
  await expect(canvas).toHaveAttribute('tabindex', '-1')
  await expect(canvas).toHaveCSS('pointer-events', 'none')
  await expect(logo).toHaveCSS('visibility', 'hidden')

  const bounds = await logo.boundingBox()
  expect(bounds).not.toBeNull()
  if (!bounds) return

  await page.mouse.move(bounds.x - 12, bounds.y + bounds.height / 2)
  await expect(canvas).toHaveAttribute('data-particles-active', 'false')
  await page.mouse.move(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2)
  await expect(canvas).toHaveAttribute('data-particles-active', 'true')
  await expect(logo).toHaveAttribute('data-particles-active', 'true')
  await page.mouse.move(bounds.x + bounds.width + 12, bounds.y + bounds.height / 2)
  await expect(canvas).toHaveAttribute('data-particles-active', 'false')

  await page.getByRole('link', { name: 'Explore services' }).click()
  await expect(page).toHaveURL(/\/services$/)
  await expect(page.locator('canvas[data-particles-target]')).toHaveCount(0)

  await page.goBack()
  await expect(host).toHaveAttribute('data-particles-ready', 'true', { timeout: 20_000 })
  await expect(page.locator('canvas[data-particles-target]')).toHaveCount(1)
})

test('cinematic hero respects reduced-motion preferences', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')

  const hero = page.locator('[data-slot="hero-system"]')
  await expect(hero).toContainText('One connected system')
  await expect(page.locator('[data-particle-host]')).toHaveAttribute(
    'data-particles-motion',
    'static'
  )
  await expect(page.locator('canvas[data-particles-target]')).toHaveCount(0)
  await expect(page.locator('[data-particles-hero-logo]')).toBeVisible()
  await expect(page.locator('.hero-orbit')).toHaveCSS('animation-name', 'none')
  await expect(page.locator('.hero-pearl-breathe').first()).toHaveCSS('animation-name', 'none')
  await expect(page.locator('.hero-pearl-sheen').first()).toBeVisible()
  await expect
    .poll(() =>
      page
        .locator('.hero-pearl-sheen')
        .first()
        .evaluate((element) => getComputedStyle(element, '::before').animationName)
    )
    .toBe('none')
})

test('hero pearl keeps its original fallback when data saving is enabled', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'connection', {
      configurable: true,
      value: { saveData: true },
    })
  })
  await page.goto('/')

  await expect(page.locator('[data-particle-host]')).toHaveAttribute(
    'data-particles-ready',
    'false'
  )
  await expect(page.locator('canvas[data-particles-target]')).toHaveCount(0)
  await expect(page.locator('[data-particles-hero-logo]')).toBeVisible()
})

test('hero pearl keeps its original fallback when WebGL2 is unavailable', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
      configurable: true,
      value() {
        return null
      },
    })
  })
  await page.goto('/')

  await expect(page.locator('[data-particle-host]')).toHaveAttribute(
    'data-particles-ready',
    'false'
  )
  await expect(page.locator('canvas[data-particles-target]')).toHaveCount(0)
  await expect(page.locator('[data-particles-hero-logo]')).toBeVisible()
})

test('particle illumination follows the active card only', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Pointer illumination is intentionally disabled for coarse pointers.')
  await page.goto('/services')
  await expect(page.locator('html')).toHaveAttribute('data-surface-illumination', 'ready')

  const card = page.locator('[data-particle-surface]').first()
  await card.hover({ position: { x: 36, y: 36 } })
  await expect(card).toHaveAttribute('data-particle-active', 'true')
  await expect(card).toHaveCSS('--particle-local-x', /px/)

  await page.mouse.move(2, 2)
  await expect(card).not.toHaveAttribute('data-particle-active', 'true')
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

test('primary content remains available without JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()

  if (!baseURL) throw new Error('Playwright baseURL must be configured')
  await page.goto(baseURL, { waitUntil: 'domcontentloaded' })
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Software shaped around how your business works'
  )
  await expect(page.getByRole('link', { name: 'Discuss your project' })).toBeVisible()

  await context.close()
})
