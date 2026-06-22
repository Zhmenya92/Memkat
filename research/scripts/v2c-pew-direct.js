/**
 * v2c — Pew Research direct navigation
 * Знайдено на topic index: два звіти про підлітків і TikTok
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const OUTPUT = path.resolve(__dirname, '../notes-v2c-pew.md');
const lines = [];
const w = (s = '') => { lines.push(s); process.stdout.write(s + '\n'); };

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36';

async function fetchPage(page, url, label) {
  w(`\n→ ${label}`);
  w(`URL: ${url}`);
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(3000);
    const text = await page.evaluate(() => {
      ['script', 'style', 'nav', 'header', '.sidebar', 'aside', 'footer', '.wp-block-group__inner-container > :last-child'].forEach(sel => {
        try { document.querySelectorAll(sel).forEach(el => el.remove()); } catch (e) {}
      });
      return document.body?.innerText?.replace(/\n{3,}/g, '\n\n').trim() || '';
    });
    if (text && text.length > 100) {
      w(text.slice(0, 5000));
      return text;
    } else {
      w('(no content or very short)');
      // Try to get the actual URL we landed on (might have been redirected)
      w(`Final URL: ${page.url()}`);
      return '';
    }
  } catch (e) {
    w(`ERROR: ${e.message.slice(0, 200)}`);
    return '';
  }
}

// Navigate to Pew Research topic page and extract article links
async function getPewLinks(page, topicUrl) {
  w(`\n→ Scanning Pew topic: ${topicUrl}`);
  try {
    await page.goto(topicUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2500);
    return await page.evaluate(() => {
      const links = [];
      document.querySelectorAll('a[href*="pewresearch.org"]').forEach(a => {
        const href = a.href;
        const text = a.textContent?.trim();
        if (href.includes('/internet/') || href.includes('/short-reads/')) {
          if (text && text.length > 10 && !links.some(l => l.url === href)) {
            links.push({ url: href, title: text });
          }
        }
      });
      return links.slice(0, 20);
    });
  } catch (e) {
    w(`ERROR: ${e.message.slice(0, 100)}`);
    return [];
  }
}

async function main() {
  w('# v2c — Pew Research direct navigation');
  w(`Дата: ${new Date().toISOString().slice(0, 10)}`);
  w('Мета: В3 (пристрої підлітків), Г2 (TikTok usage teens), Г1 (частота)\n---\n');

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });
  const ctx = await browser.newContext({
    userAgent: UA,
    viewport: { width: 1280, height: 900 },
    locale: 'en-US'
  });
  const page = await ctx.newPage();

  // ── 1. Scan Pew topic pages for relevant links ──────────────────────
  w('## Scan Pew Research for teen/TikTok reports\n');

  const topicUrls = [
    'https://www.pewresearch.org/topic/internet-technology/social-media/',
    'https://www.pewresearch.org/topic/internet-technology/internet-internet-access/teens-and-tech/',
  ];

  const foundLinks = [];
  for (const topicUrl of topicUrls) {
    const links = await getPewLinks(page, topicUrl);
    w(`Found ${links.length} links on ${topicUrl.split('/topic/')[1] || topicUrl}:`);
    links.filter(l =>
      /teen|Gen Z|tiktok|instagram|snapchat|smartphone|device|social media/i.test(l.title)
    ).forEach(l => {
      w(`  - ${l.title}`);
      w(`    ${l.url}`);
      foundLinks.push(l);
    });
  }

  // ── 2. Navigate to specific known reports ───────────────────────────
  w('\n## Known Pew reports (from topic index)\n');

  // URLs found on topic index based on titles seen
  const pewReports = [
    // April 2026 — Teens on TikTok, Instagram, Snapchat
    'https://www.pewresearch.org/internet/2026/04/15/teens-experiences-on-tiktok-instagram-and-snapchat/',
    // Dec 2025 — Teens Social Media and AI
    'https://www.pewresearch.org/internet/2025/12/09/teens-social-media-and-ai-chatbots-2025/',
    // Nov 2025 — Americans Social Media Use
    'https://www.pewresearch.org/internet/2025/11/20/americans-social-media-use-2025/',
    // Alternative URL patterns
    'https://www.pewresearch.org/short-reads/2026/04/15/teens-experiences-on-tiktok-instagram-and-snapchat/',
    // Teens and tech 2023
    'https://www.pewresearch.org/internet/2022/08/10/teens-social-media-and-technology-2022/',
    // 8 facts about TikTok (Mar 2026)
    'https://www.pewresearch.org/short-reads/2026/03/02/8-facts-about-americans-and-tiktok/',
  ];

  // Also add links found via topic scan
  const extraLinks = foundLinks.map(l => l.url).slice(0, 5);
  const allPewUrls = [...new Set([...pewReports, ...extraLinks])];

  for (const url of allPewUrls) {
    const content = await fetchPage(page, url, url.split('/').slice(-2).join('/'));
    if (content && content.length > 200) {
      w('\n[CONTENT ABOVE]');
    }
  }

  // ── 3. Sprout Social — TikTok stats (already partially loaded) ──────
  w('\n---\n## Sprout Social — TikTok stats 2026\n');

  const sproutContent = await fetchPage(
    page,
    'https://sproutsocial.com/insights/tiktok-stats/',
    'Sprout Social TikTok stats'
  );

  // ── 4. Hootsuite / DataReportal — creator age data ──────────────────
  w('\n---\n## DataReportal — Digital 2025 key stats\n');

  await fetchPage(
    page,
    'https://datareportal.com/reports/digital-2025-global-overview-report',
    'DataReportal Digital 2025'
  );

  // ── 5. YouTube/TikTok creator age data via direct pages ─────────────
  w('\n---\n## Statista (partial — without login)\n');

  await fetchPage(
    page,
    'https://www.statista.com/statistics/1293771/tiktok-global-user-age-distribution/',
    'Statista TikTok age distribution'
  );

  await fetchPage(
    page,
    'https://www.statista.com/statistics/1273814/gen-z-smartphone-os/',
    'Statista Gen Z smartphone OS'
  );

  await browser.close();
  fs.writeFileSync(OUTPUT, lines.join('\n'), 'utf8');
  w(`\n✓ Saved: ${OUTPUT}`);
}

main().catch(e => {
  w(`\nFATAL: ${e.message}\n${e.stack}`);
  fs.writeFileSync(OUTPUT, lines.join('\n'), 'utf8');
  process.exit(1);
});
