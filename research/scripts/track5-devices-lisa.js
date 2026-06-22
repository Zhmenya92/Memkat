/**
 * Track 5 — Пристрої та Ліза
 * Закриває: В3 (слабший пристрій 16-річних), Г8 (job "скопіювати формат"),
 *           В2 (тільки TikTok editor — реальність чи ні),
 *           Г2 (TikTok vs Reels platform split у молодих)
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const OUTPUT = path.resolve(__dirname, '../notes-track5.md');
const lines = [];
const w = (s = '') => { lines.push(s); process.stdout.write(s + '\n'); };

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36';

async function fetchPage(page, url, label) {
  w(`\n→ ${label}: ${url}`);
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000);
    const text = await page.evaluate(() => {
      // Remove scripts/styles/nav
      ['script', 'style', 'nav', 'header', 'footer', 'aside'].forEach(tag => {
        document.querySelectorAll(tag).forEach(el => el.remove());
      });
      return document.body?.innerText?.trim().slice(0, 4000) || '';
    });
    return text;
  } catch (e) {
    w(`  ERROR: ${e.message}`);
    return '';
  }
}

async function redditSearch(page, sub, query, limit = 5) {
  const url = `https://old.reddit.com/r/${sub}/search?q=${encodeURIComponent(query)}&restrict_sr=on&sort=top&t=all`;
  w(`\n→ r/${sub}: "${query}"`);
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 25000 });
    await page.waitForTimeout(1500);
    return await page.evaluate((limit) => {
      return Array.from(document.querySelectorAll('.search-result-link'))
        .slice(0, limit)
        .map(el => {
          const a = el.querySelector('.search-result-header a');
          const score = el.querySelector('.search-score-count')?.textContent?.trim() || '';
          const snippet = el.querySelector('.search-expando-body')?.textContent?.trim().slice(0, 500) || '';
          return { title: a?.textContent?.trim() || '', url: a?.href || '', score, snippet };
        })
        .filter(p => p.title && p.url);
    }, limit);
  } catch (e) {
    w(`  ERROR: ${e.message}`);
    return [];
  }
}

async function redditPost(page, url, maxComments = 12) {
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 25000 });
    await page.waitForTimeout(1500);
    return await page.evaluate((maxComments) => {
      const title = document.querySelector('.title a.title')?.textContent?.trim() || '';
      const selftext = document.querySelector('.usertext-body .md')?.innerText?.trim().slice(0, 700) || '';
      const score = document.querySelector('.score.unvoted, .likes')?.textContent?.trim() || '';
      const comments = Array.from(document.querySelectorAll('.comment'))
        .slice(0, maxComments)
        .map(c => {
          const txt = c.querySelector('.usertext-body .md')?.innerText?.trim();
          const sc = c.querySelector('.score')?.textContent?.trim() || '';
          if (txt && txt.length > 25 && !txt.startsWith('[deleted]')) {
            return `[${sc}] ${txt.slice(0, 600)}`;
          }
          return null;
        })
        .filter(Boolean);
      return { title, selftext, score, comments };
    }, maxComments);
  } catch (e) {
    w(`  ERROR: ${e.message}`);
    return null;
  }
}

async function googleSearch(page, query) {
  const gUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}&num=6`;
  w(`\n→ Google: "${query}"`);
  try {
    await page.goto(gUrl, { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForTimeout(1500);
    return await page.evaluate(() => {
      return Array.from(document.querySelectorAll('h3')).slice(0, 7).map(h => {
        const a = h.closest('a');
        const g = h.closest('.g, [data-sokoban-container]');
        const snippet = g?.querySelector('.VwiC3b, .IsZvec, span[style*="line"]')?.textContent?.trim();
        return { title: h.textContent?.trim(), url: a?.href, snippet: snippet?.slice(0, 400) };
      }).filter(r => r.title && r.url && !r.url.includes('google.com'));
    });
  } catch (e) {
    w(`  ERROR: ${e.message}`);
    return [];
  }
}

async function main() {
  w('# Track 5 — Пристрої та Ліза');
  w(`Дата: ${new Date().toISOString().slice(0, 10)}`);
  w('Мета: В3 (пристрої 16-річних), Г8 (job copy format), В2 (TikTok editor only), Г2 (platform split)\n');
  w('---\n');

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });
  const ctx = await browser.newContext({ userAgent: UA, viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();

  // ── 1. Pew Research — teen tech ──
  w('## Pew Research — teen technology use\n');

  const pewUrls = [
    ['https://www.pewresearch.org/internet/fact-sheet/teens-and-the-internet/', 'Pew — Teens and Internet fact sheet'],
    ['https://www.pewresearch.org/internet/2024/01/31/teens-and-video-games-today/', 'Pew — Teens tech 2024'],
    ['https://www.pewresearch.org/short-reads/2024/08/07/teens-and-smartphones/', 'Pew — Teens smartphones 2024'],
  ];
  for (const [url, label] of pewUrls) {
    const text = await fetchPage(page, url, label);
    if (text) {
      w(`\n### ${label}`);
      w(text.slice(0, 3000));
    }
  }

  // ── 2. Common Sense Media ──
  w('\n---\n## Common Sense Media — teen media use\n');

  const csmUrls = [
    ['https://www.commonsensemedia.org/research/the-common-sense-census-media-use-by-tweens-and-teens-2023', 'CSM Census 2023'],
    ['https://www.commonsensemedia.org/research/teens-and-technology-2024', 'CSM Teens & Tech 2024'],
  ];
  for (const [url, label] of csmUrls) {
    const text = await fetchPage(page, url, label);
    if (text) {
      w(`\n### ${label}`);
      w(text.slice(0, 2500));
    }
  }

  // ── 3. Google — teen device + platform stats ──
  w('\n---\n## Google — device & platform statistics\n');

  const gqs = [
    'teens 16 year old smartphone model type 2024 statistics',
    'Gen Z teenager TikTok vs Instagram Reels usage 2024 age breakdown',
    'percentage teenagers only use TikTok for video creation 2024',
    'teen 16 year old phone Android iPhone breakdown statistics 2024',
    'young creator first video editor used statistics survey 2024',
  ];
  for (const q of gqs) {
    const results = await googleSearch(page, q);
    w(`\n### "${q}"`);
    for (const r of results) {
      w(`- **${r.title}**`);
      if (r.url) w(`  ${r.url}`);
      if (r.snippet) w(`  ${r.snippet}`);
    }
  }

  // ── 4. Statista / reports pages ──
  w('\n---\n## Statista / Reports\n');

  const reportUrls = [
    ['https://www.statista.com/topics/1001/teenagers/', 'Statista — Teenagers overview'],
    ['https://www.statista.com/statistics/1273814/gen-z-smartphone-os/', 'Statista — Gen Z smartphone OS'],
  ];
  for (const [url, label] of reportUrls) {
    const text = await fetchPage(page, url, label);
    if (text) {
      w(`\n### ${label}`);
      w(text.slice(0, 2000));
    }
  }

  // ── 5. Reddit — teen video creator experience ──
  w('\n---\n## Reddit — teen creator device & tool experience\n');

  const postUrls = new Set();
  const rs = [
    ['teenagers', 'making TikTok videos phone editing'],
    ['teenagers', 'CapCut TikTok video edit first time'],
    ['TikTok', 'editing phone android iphone quality'],
    ['NewTubers', 'started creating 16 17 first video phone'],
    ['GenZ', 'creating content phone editor quality first video'],
    ['TikTok', 'copy trend format video tutorial beginner'],
  ];
  for (const [sub, q] of rs) {
    const posts = await redditSearch(page, sub, q, 4);
    for (const p of posts) {
      w(`### [${p.score}] ${p.title}`);
      w(`URL: ${p.url}`);
      if (p.snippet) w(`Snippet: ${p.snippet}`);
      postUrls.add(p.url);
    }
  }

  w('\n---\n## Дайв у топ-пости\n');
  for (const url of Array.from(postUrls).slice(0, 10)) {
    const post = await redditPost(page, url);
    if (!post) continue;
    w(`\n### ${post.title} [score: ${post.score}]`);
    w(`URL: ${url}`);
    if (post.selftext) { w('**Пост:**'); w(post.selftext); }
    if (post.comments.length) {
      w('**Коментарі:**');
      post.comments.forEach(c => w(`- ${c}`));
    }
  }

  // ── 6. App Store TikTok reviews — що кажуть юзери про редактор ──
  w('\n---\n## App Store — TikTok reviews (teen perspective)\n');

  const asUrls = [
    'https://apps.apple.com/us/app/tiktok/id835599320?see-all=reviews',
    'https://apps.apple.com/us/app/capcut-video-editor/id1500855883?see-all=reviews',
  ];
  for (const url of asUrls) {
    const text = await fetchPage(page, url, `App Store: ${url.split('/app/')[1]?.split('/')[0]}`);
    if (text) w(text.slice(0, 2000));
  }

  await browser.close();

  fs.writeFileSync(OUTPUT, lines.join('\n'), 'utf8');
  w(`\n✓ Saved: ${OUTPUT}`);
}

main().catch(e => {
  w(`\nFATAL: ${e.message}`);
  fs.writeFileSync(OUTPUT, lines.join('\n'), 'utf8');
  process.exit(1);
});
