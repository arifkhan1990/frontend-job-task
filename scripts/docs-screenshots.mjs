import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright-core';

const webBase = process.env.BASE_URL || 'http://127.0.0.1:5173';
const apiBase = process.env.API_URL || 'http://127.0.0.1:5000/api/v1';
const chromePath = process.env.CHROME_PATH || '/usr/bin/google-chrome';
const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
const adminPassword = process.env.ADMIN_PASSWORD || 'AdminPass123!';
const outputDirectory = path.resolve('public/docs/assets');

async function api(pathname, { method = 'GET', token, body } = {}) {
  const response = await fetch(`${apiBase}${pathname}`, {
    method,
    headers: {
      Accept: 'application/json',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const payload = await response.json().catch(() => null);

  return { status: response.status, payload };
}

async function seedDemoData() {
  const login = await api('/auth/login', {
    method: 'POST',
    body: { email: adminEmail, password: adminPassword },
  });

  if (login.status !== 200) {
    throw new Error(`Admin login failed: ${login.status}`);
  }

  const token = login.payload.data.accessToken;
  const users = [
    {
      name: 'Ayesha Rahman',
      email: 'docs.ayesha@example.com',
      password: 'DemoPass123!',
      interests: ['chess', 'reading'],
    },
    {
      name: 'Tanvir Ahmed',
      email: 'docs.tanvir@example.com',
      password: 'DemoPass123!',
      interests: ['running', 'chess'],
    },
    {
      name: 'Nusrat Jahan',
      email: 'docs.nusrat@example.com',
      password: 'DemoPass123!',
      interests: ['reading', 'cooking'],
    },
  ];

  for (const user of users) {
    await api('/users', { method: 'POST', token, body: { ...user, role: 'user' } });
  }

  const notes = [
    {
      title: 'Release checklist',
      content: 'Review indexes, run the migration, verify /ready, then tag the release.',
    },
    {
      title: 'MongoDB index review',
      content: 'Owner list uses the compound index. Admin lists use createdAt + _id.',
    },
    {
      title: 'Interview prep',
      content: 'Explain ESR, why $group is blocking and how $lookup uses posts.author.',
    },
  ];

  for (const note of notes) {
    await api('/notes', { method: 'POST', token, body: note });
  }

  const posts = [
    {
      title: 'Why compound index order matters',
      content: 'Equality fields first, then the sort fields, then a stable tie-breaker.',
    },
    {
      title: 'Shipping the notes API',
      content: 'Transactions, migrations, rotating refresh tokens and query-plan evidence.',
    },
  ];

  for (const post of posts) {
    await api('/posts', { method: 'POST', token, body: post });
  }
}

async function main() {
  await fs.mkdir(outputDirectory, { recursive: true });
  await seedDemoData();

  const browser = await chromium.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox'],
  });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  await page.goto(`${webBase}/login`, { waitUntil: 'networkidle' });
  await page.getByLabel('Email').fill(adminEmail);
  await page.getByLabel('Password').fill(adminPassword);
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.waitForURL(`${webBase}/`);
  await page.getByRole('heading', { name: 'My notes' }).waitFor();
  await page.screenshot({
    path: path.join(outputDirectory, 'notes.png'),
    fullPage: true,
  });

  await page.getByRole('link', { name: 'Users', exact: true }).click();
  await page.getByRole('heading', { name: 'Users' }).waitFor();
  await page.getByText('Ayesha Rahman').waitFor();
  await page.screenshot({
    path: path.join(outputDirectory, 'users.png'),
    fullPage: true,
  });

  await page.getByRole('link', { name: 'All notes' }).click();
  await page.getByRole('heading', { name: 'All notes' }).waitFor();
  await page.screenshot({
    path: path.join(outputDirectory, 'all-notes.png'),
    fullPage: true,
  });

  await page.getByRole('link', { name: 'Users by interest' }).click();
  await page.getByRole('heading', { name: 'Users by interest' }).waitFor();
  await page.getByText('Interest distribution').waitFor();
  await page.screenshot({
    path: path.join(outputDirectory, 'interests.png'),
    fullPage: true,
  });

  await page.getByRole('link', { name: 'My posts' }).click();
  await page.getByRole('heading', { name: /Posts by/ }).waitFor();
  await page.screenshot({
    path: path.join(outputDirectory, 'posts.png'),
    fullPage: true,
  });

  await page.goto(`${webBase}/docs`, { waitUntil: 'networkidle' });
  await page.getByRole('heading', { name: 'Documentation' }).waitFor();
  await page.screenshot({
    path: path.join(outputDirectory, 'docs.png'),
    fullPage: false,
  });

  await browser.close();
  console.log(`Screenshots written to ${outputDirectory}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
