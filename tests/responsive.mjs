import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';

const ORIGIN = process.env.GROCERLY_URL || 'http://127.0.0.1:3000';
const viewports = [
  { width: 320, height: 568 }, { width: 390, height: 844 },
  { width: 768, height: 1024 }, { width: 1024, height: 768 },
  { width: 1440, height: 900 }, { width: 1920, height: 1080 },
];
const screens = [
  ['Home', 'dashboard'], ['Meals', 'meals'],
  ['Groceries', 'inventory'], ['Settings', 'profile'],
];
await mkdir('test-artifacts', { recursive: true });
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const errors = [];
try {
  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport, reducedMotion: 'reduce' });
    await context.addInitScript(() => {
      localStorage.setItem('grocerly_logged_in', 'true');
      localStorage.setItem('grocerly_first_launch', 'false');
    });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(viewport.width + 'px: ' + error.message));
    await page.goto(ORIGIN, { waitUntil: 'domcontentloaded' });
    await page.locator('#page-dashboard.active').waitFor({ timeout: 15000 });
    for (const [screen, tab] of screens) {
      await page.locator(`#app-bottom-nav .nav-item[data-tab="${tab}"]`).click();
      await page.locator(`#page-${tab}.active`).waitFor();
      const bounds = await page.evaluate(() => {
        const header = document.querySelector('.grocerly-global-header');
        const nav = document.querySelector('#app-bottom-nav');
        const activePage = document.querySelector('.page.active');
        const inspect = el => {
          const r = el.getBoundingClientRect();
          return { left: r.left, right: r.right, top: r.top, bottom: r.bottom, width: r.width };
        };
        return {
          width: window.innerWidth,
          header: inspect(header), nav: inspect(nav), active: inspect(activePage),
          navItems: [...nav.querySelectorAll('.nav-item')].map(inspect),
          horizontalOverflow: Math.max(0, activePage.scrollWidth - activePage.clientWidth)
        };
      });
      assert(bounds.header.left >= -2 && bounds.header.right <= viewport.width + 2, `${screen} header overflow at ${viewport.width}`);
      assert(bounds.nav.left >= -2 && bounds.nav.right <= viewport.width + 2, `${screen} bottom nav overflow at ${viewport.width}`);
      for (const item of bounds.navItems) assert(item.width >= 40 && item.right <= viewport.width + 2, `${screen} nav item clipped at ${viewport.width}`);
      assert(bounds.horizontalOverflow <= 4, `${screen} page horizontal overflow ${bounds.horizontalOverflow}px at ${viewport.width}`);
      if ([390,768,1440].includes(viewport.width)) {
        await page.screenshot({ path: `test-artifacts/${viewport.width}-${screen.toLowerCase()}.png`, fullPage: false });
      }
      console.log(`${viewport.width}×${viewport.height} ${screen}: OK`);
    }
    await context.close();
  }

  // No onboarding: actual email/password account registration ends on Home.
  const authContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await authContext.newPage();
  page.on('pageerror', error => errors.push('auth: ' + error.message));
  await page.goto(ORIGIN, { waitUntil: 'domcontentloaded' });
  await page.locator('#page-login.active').waitFor({ timeout: 12000 });
  await page.locator('#login-email').fill(`ui-check-${Date.now()}@example.invalid`);
  await page.locator('#login-password').fill('test-only-password-9841');
  await page.locator('#btn-login-signup').click();
  await page.locator('#page-dashboard.active').waitFor({ timeout: 15000 });
  assert.equal(await page.locator('#page-profile-setup.active, #page-goals.active, #page-dynamic-questions.active').count(), 0);
  console.log('Registration redirects directly to Home: OK');
  await authContext.close();
  assert.deepEqual(errors, [], 'Uncaught browser errors: ' + errors.join(' | '));
} finally {
  await browser.close();
}