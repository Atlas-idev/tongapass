import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { env } from './env';

const SHOTS = '../docs/screenshots';
mkdirSync(SHOTS, { recursive: true });

// Pas de trace pour cet audit : le portail change en continu (horloge, pouls SSE, aurore animée)
// et la trace enregistrait chaque mutation pendant les analyses axe, ce qui faisait passer une page
// de 1 s à plus d'une minute et dépasser le délai du test. La liste des violations suffit au diagnostic.
test.use({ trace: 'off' });

const PAGES = [
  { path: '/', name: 'tableau-de-bord', heading: 'Vue d’ensemble' },
  { path: '/employes', name: 'annuaire', heading: 'Annuaire' },
  { path: '/arrivees/nouvelle', name: 'nouvelle-arrivee', heading: 'Déclarer une arrivée' },
  { path: '/executions', name: 'executions', heading: 'Exécutions' },
  { path: '/profils', name: 'profils', heading: 'Profils d’accès' },
  { path: '/conformite', name: 'conformite', heading: 'Conformité des droits' },
  { path: '/audit', name: 'audit-journal', heading: 'Journal d’audit' },
  { path: '/integrations', name: 'integrations-etat', heading: 'Intégrations' },
];

async function login(page: Page) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Se connecter avec Keycloak' }).click();
  await page.locator('#username').fill('admin.it');
  await page.locator('#password').fill(env.TP_DEMO_PASSWORD);
  await page.locator('#kc-login').click();
  await expect(page.getByRole('navigation', { name: 'Navigation principale' })).toBeVisible();
}

const axe = (page: Page) =>
  new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).exclude('[data-sonner-toaster]');

test('accueil (build de production, CSP active) : aucune violation grave', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.waitForTimeout(2600);
  const results = await axe(page).analyze();
  const serious = results.violations.filter((v) => ['serious', 'critical'].includes(v.impact ?? ''));
  expect(serious.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
  await page.screenshot({ path: `${SHOTS}/accueil.png` });
});

for (const theme of ['light', 'dark'] as const) {
  test(`portail en thème ${theme === 'light' ? 'clair' : 'sombre'} : WCAG 2.2 AA`, async ({ page }) => {
    await page.addInitScript((value) => localStorage.setItem('tp-theme', value), theme);
    await login(page);
    const problems: string[] = [];
    for (const target of PAGES) {
      await page.goto(target.path);
      await expect(page.getByRole('heading', { level: 1, name: target.heading })).toBeVisible();
      // Pas de « networkidle » : le flux SSE temps réel garde une connexion ouverte en permanence
      await expect(page.locator('.skeleton')).toHaveCount(0, { timeout: 20_000 });
      await page.waitForTimeout(target.path === '/' ? 1200 : 500);
      const results = await axe(page).analyze();
      for (const v of results.violations.filter((v) => ['serious', 'critical'].includes(v.impact ?? ''))) {
        problems.push(`${target.path} ${v.id}: ${v.help} → ${v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join(' | ')}`);
      }
      await page.screenshot({ path: `${SHOTS}/${target.name}-${theme}.png`, fullPage: true });
    }
    expect(problems).toEqual([]);
  });
}
