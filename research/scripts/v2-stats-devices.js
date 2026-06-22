/**
 * v2 — Stats & Devices
 * Закриває: В3 (пристрій 16-річних), Г2 (TikTok vs Reels), В2 (TikTok editor),
 *           Г1 (частота постів), Г8 (copy format), Г7 (TikTok watermark)
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const OUTPUT = path.resolve(__dirname, '../notes-v2-stats.md');
const lines = [];
const w = (s = '') => { lines.push(s); process.stdout.write(s + '\n'); };

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36';

async function extractText(page, url, label, sliceLen = 3000) {
  w(`\n→ ${label}`);
  w(`  URL: ${url}`);
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2500);
    const text = await page.evaluate(() => {
      ['script', 'style', 'nav', 'header', 'footer', 'aside', '.cookie-banner', '[role="banner"]'].forEach(sel => {
        document.querySelectorAll(sel).forEach(el => el.remove());
      });
      return document.body?.innerText?.replace(/\n{3,}/g, '\n\n').trim().slice(0, 6000) || '';
    });
    if (text && text.length > 100) {
      w(text.slice(0, sliceLen));
      return text;
    } else {
      w('  (no content)');
      return '';
    }
  } catch (e) {
    w(`  ERROR: ${e.message}`);
    return '';
  }
}

async function googleSearch(page, query, num = 8) {
  const url = `https://www.google.com/search?q=${encodeURIComponent(query)}&num=${num}&hl=en`;
  w(`\n→ Google: "${query}"`);
  await page.waitForTimeout(1500); // rate limiting buffer
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 25000 });
    await page.waitForTimeout(3000);
    return await page.evaluate(() => {
      const results = [];
      // Primary: structured search results
      document.querySelectorAll('div.g, [data-sokoban-container]').forEach(el => {
        const h3 = el.querySelector('h3');
        const a = el.querySelector('a[href]');
        const snippetEl = el.querySelector('.VwiC3b, .IsZvec, [style*="-webkit-line-clamp"]');
        if (h3 && a) {
          results.push({
            title: h3.innerText?.trim(),
            url: a.getAttribute('href'),
            snippet: snippetEl?.innerText?.trim()?.slice(0, 400) || ''
          });
        }
      });
      // Fallback: h3 elements
      if (results.length === 0) {
        document.querySelectorAll('h3').forEach(h3 => {
          const a = h3.closest('a');
          if (a && a.href && !a.href.includes('google.com')) {
            results.push({ title: h3.innerText?.trim(), url: a.href, snippet: '' });
          }
        });
      }
      return results.slice(0, 8).filter(r => r.title && r.url);
    });
  } catch (e) {
    w(`  ERROR: ${e.message}`);
    return [];
  }
}

async function main() {
  w('# v2 — Stats & Devices research');
  w(`Дата: ${new Date().toISOString().slice(0, 10)}`);
  w('Мета: В3 (пристрій 16-річних), Г2 (TikTok vs Reels), В2, Г1, Г8, Г7\n---\n');

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });
  const ctx = await browser.newContext({ userAgent: UA, viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();

  // ── 1. Pew Research — знаходимо правильні URL ──────────────────────
  w('\n## Pew Research — Social Media Topics\n');

  // Navigate to topic index first to find actual report URLs
  const pewIndex = await extractText(
    page,
    'https://www.pewresearch.org/topic/internet-technology/social-media/',
    'Pew — Social Media topic index',
    2000
  );

  // Try specific known reports
  const pewPages = [
    ['https://www.pewresearch.org/internet/2023/12/11/what-teens-watch-and-listen-to/', 'Pew — Teen media 2023'],
    ['https://www.pewresearch.org/internet/fact-sheet/social-media/', 'Pew — Social Media fact sheet'],
    ['https://www.pewresearch.org/short-reads/2023/04/24/teens-and-video-games-today/', 'Pew — Teens tech'],
  ];
  for (const [url, label] of pewPages) {
    await extractText(page, url, label, 2500);
  }

  // ── 2. Pew via Google (find correct URLs) ───────────────────────────
  w('\n## Google → Pew Research correct URLs\n');

  const pewGoogleQueries = [
    'site:pewresearch.org teens smartphones 2024 statistics',
    'site:pewresearch.org Gen Z TikTok Instagram usage 2024',
    'site:pewresearch.org teens technology devices 2023 2024',
  ];
  const pewUrlsFound = [];
  for (const q of pewGoogleQueries) {
    const results = await googleSearch(page, q);
    w(`\n### "${q}"`);
    for (const r of results) {
      w(`- **${r.title}**`);
      w(`  ${r.url}`);
      if (r.snippet) w(`  ${r.snippet}`);
      if (r.url?.includes('pewresearch.org')) pewUrlsFound.push(r.url);
    }
  }

  // Navigate to Pew pages found via Google
  for (const url of pewUrlsFound.slice(0, 4)) {
    await extractText(page, url, `Pew report: ${url.split('/').slice(-2).join('/')}`, 3000);
  }

  // ── 3. Common Sense Media ──────────────────────────────────────────
  w('\n---\n## Common Sense Media\n');

  // Find research list page
  await extractText(page, 'https://www.commonsensemedia.org/research', 'CSM Research index', 1500);

  // Find correct CSM URL via Google
  const csmResults = await googleSearch(page, 'site:commonsensemedia.org teens media census 2023 2024 hours screen');
  w('\n### CSM Google results:');
  const csmUrls = [];
  for (const r of csmResults) {
    w(`- ${r.title}`);
    w(`  ${r.url}`);
    if (r.snippet) w(`  ${r.snippet}`);
    if (r.url?.includes('commonsensemedia.org')) csmUrls.push(r.url);
  }
  for (const url of csmUrls.slice(0, 2)) {
    await extractText(page, url, 'CSM report', 2500);
  }

  // ── 4. TikTok vs Reels platform stats (Г2) ──────────────────────────
  w('\n---\n## TikTok vs Reels — platform split (Г2)\n');

  const platformQueries = [
    'Gen Z TikTok vs Instagram Reels which platform 2024 creator preference age',
    'site:socialpilot.co OR site:sproutsocial.com TikTok Reels Gen Z creator statistics 2024',
    'TikTok creators age demographics 16-24 percentage 2024',
    'percentage Gen Z content creators use TikTok vs Reels vs YouTube Shorts 2024',
  ];
  for (const q of platformQueries) {
    const res = await googleSearch(page, q);
    w(`\n### "${q}"`);
    for (const r of res) {
      w(`- **${r.title}**`);
      w(`  ${r.url}`);
      if (r.snippet) w(`  ${r.snippet}`);
    }
  }

  // Navigate to top results
  const platformUrls = [
    'https://www.socialinsider.io/blog/tiktok-vs-reels-vs-youtube-shorts',
    'https://sproutsocial.com/insights/tiktok-stats/',
  ];
  for (const url of platformUrls) {
    await extractText(page, url, url.split('/').slice(-2).join('/'), 2000);
  }

  // ── 5. Teen device ownership (В3) ──────────────────────────────────
  w('\n---\n## Teen device ownership (В3)\n');

  const deviceQueries = [
    'teenagers smartphone type Android iPhone percentage 2024 age 16',
    'teen 16 17 year old phone type statistics survey 2024',
    'Gen Z smartphone model low end budget phone percentage 2024',
  ];
  for (const q of deviceQueries) {
    const res = await googleSearch(page, q);
    w(`\n### "${q}"`);
    for (const r of res) {
      w(`- **${r.title}**`);
      w(`  ${r.url}`);
      if (r.snippet) w(`  ${r.snippet}`);
    }
  }

  // ── 6. CapCut watermark & TikTok built-in editor (В2, Г7) ──────────
  w('\n---\n## CapCut / TikTok built-in editor stats (В2, Г7)\n');

  const editorQueries = [
    'percentage TikTok creators use CapCut vs built-in TikTok editor 2024',
    'most popular video editing app TikTok creators 2024 survey',
    'CapCut market share video editing app statistics 2024',
    'TikTok built-in editor vs third party editing 2024 usage',
  ];
  for (const q of editorQueries) {
    const res = await googleSearch(page, q);
    w(`\n### "${q}"`);
    for (const r of res) {
      w(`- **${r.title}**`);
      w(`  ${r.url}`);
      if (r.snippet) w(`  ${r.snippet}`);
    }
  }

  // ── 7. Creator posting frequency (Г1) ──────────────────────────────
  w('\n---\n## Creator posting frequency (Г1)\n');

  const freqResults = await googleSearch(page, 'TikTok creator posting frequency 16-24 age how often per week statistics 2024');
  w('\n### Posting frequency:');
  for (const r of freqResults) {
    w(`- **${r.title}**  ${r.url}`);
    if (r.snippet) w(`  ${r.snippet}`);
  }

  // Navigate to Social Insider or similar for data
  await extractText(
    page,
    'https://www.socialinsider.io/blog/tiktok-statistics/',
    'Social Insider TikTok stats',
    2500
  );

  // ── 8. Creator Economy reports ───────────────────────────────────────
  w('\n---\n## Creator Economy reports\n');

  const econResults = await googleSearch(page, 'creator economy report 2024 age demographics young creator 16 24 TikTok first editor');
  w('\n### Creator economy search:');
  for (const r of econResults) {
    w(`- **${r.title}**  ${r.url}`);
    if (r.snippet) w(`  ${r.snippet}`);
  }

  // Linktree Creator Report 2023
  await extractText(
    page,
    'https://linktr.ee/en/features/creator-report',
    'Linktree Creator Report',
    2000
  );

  // Adobe 2023 Future of Creativity
  await extractText(
    page,
    'https://www.adobe.com/express/learn/blog/creator-economy',
    'Adobe Creator Economy',
    2000
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
