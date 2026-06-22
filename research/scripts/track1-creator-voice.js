/**
 * Track 1 — Голос 16–25 creator
 * Закриває: Г4 (цитата-настрій), Г12 (speed>quality від юзерів), Г10 (E2 суб'єктивне),
 *           Г1 (частота публікацій), Г2 (TikTok vs Reels)
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const OUTPUT = path.resolve(__dirname, '../notes-track1.md');
const lines = [];
const w = (s = '') => { lines.push(s); process.stdout.write(s + '\n'); };

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36';

async function redditSearch(page, sub, query, limit = 6) {
  const url = `https://old.reddit.com/r/${sub}/search?q=${encodeURIComponent(query)}&restrict_sr=on&sort=top&t=year`;
  w(`\n→ Searching r/${sub}: "${query}"`);
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 25000 });
    await page.waitForTimeout(1500);

    return await page.evaluate((limit) => {
      return Array.from(document.querySelectorAll('.search-result-link'))
        .slice(0, limit)
        .map(el => {
          const a = el.querySelector('.search-result-header a');
          const score = el.querySelector('.search-score-count')?.textContent?.trim() || '';
          const snippet = el.querySelector('.search-expando-body')?.textContent?.trim().slice(0, 400) || '';
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
      const title = document.querySelector('.top-matter .title a')?.textContent?.trim()
        || document.querySelector('.title a.title')?.textContent?.trim() || '';
      const selftext = document.querySelector('.usertext-body .md')?.innerText?.trim().slice(0, 600) || '';
      const score = document.querySelector('.score.unvoted, .likes')?.textContent?.trim() || '';

      const comments = Array.from(document.querySelectorAll('.comment'))
        .slice(0, maxComments)
        .map(c => {
          const txt = c.querySelector('.usertext-body .md')?.innerText?.trim();
          const sc = c.querySelector('.score')?.textContent?.trim() || '';
          if (txt && txt.length > 25 && !txt.startsWith('[deleted]')) {
            return `[${sc}] ${txt.slice(0, 550)}`;
          }
          return null;
        })
        .filter(Boolean);

      return { title, selftext, score, comments };
    }, maxComments);
  } catch (e) {
    w(`  ERROR post ${url}: ${e.message}`);
    return null;
  }
}

async function main() {
  w('# Track 1 — Голос 16–25 creator');
  w(`Дата: ${new Date().toISOString().slice(0, 10)}`);
  w('Мета: Г4 (цитати), Г12 (speed>quality), Г10 (E2 urgency), Г1 (частота), Г2 (TikTok vs Reels)\n');
  w('---\n');

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });
  const ctx = await browser.newContext({ userAgent: UA, viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();

  // ── 1. NewTubers — meme/trend/editing ──
  w('## r/NewTubers\n');

  const searches1 = [
    ['NewTubers', 'meme video editing trend'],
    ['NewTubers', 'TikTok editing schedule posting'],
    ['NewTubers', 'first viral video trend timing'],
  ];

  const postUrls = new Set();

  for (const [sub, q] of searches1) {
    const posts = await redditSearch(page, sub, q, 5);
    for (const p of posts) {
      w(`### [${p.score}] ${p.title}`);
      w(`URL: ${p.url}`);
      if (p.snippet) w(`Snippet: ${p.snippet}`);
      postUrls.add(p.url);
    }
  }

  // ── 2. TikTok subreddit ──
  w('\n## r/TikTok\n');

  const searches2 = [
    ['TikTok', 'editing meme video trend'],
    ['TikTok', 'how to make meme video quickly'],
    ['TikTokTips', 'video editing workflow speed'],
  ];

  for (const [sub, q] of searches2) {
    const posts = await redditSearch(page, sub, q, 5);
    for (const p of posts) {
      w(`### [${p.score}] ${p.title}`);
      w(`URL: ${p.url}`);
      if (p.snippet) w(`Snippet: ${p.snippet}`);
      postUrls.add(p.url);
    }
  }

  // ── 3. teenagers/GenZ ──
  w('\n## r/teenagers + r/GenZ\n');

  const searches3 = [
    ['teenagers', 'TikTok video editing'],
    ['teenagers', 'making TikTok meme'],
    ['GenZ', 'content creator TikTok editing'],
  ];

  for (const [sub, q] of searches3) {
    const posts = await redditSearch(page, sub, q, 4);
    for (const p of posts) {
      w(`### [${p.score}] ${p.title}`);
      w(`URL: ${p.url}`);
      if (p.snippet) w(`Snippet: ${p.snippet}`);
      postUrls.add(p.url);
    }
  }

  // ── 4. ContentCreation — posting frequency ──
  w('\n## r/ContentCreation — posting frequency & platform\n');

  const searches4 = [
    ['ContentCreation', 'TikTok vs Reels posting frequency 16 18 young creator'],
    ['ContentCreation', 'meme video trend speed publish'],
    ['SmallYTChannel', 'TikTok posting schedule frequency'],
  ];

  for (const [sub, q] of searches4) {
    const posts = await redditSearch(page, sub, q, 4);
    for (const p of posts) {
      w(`### [${p.score}] ${p.title}`);
      w(`URL: ${p.url}`);
      if (p.snippet) w(`Snippet: ${p.snippet}`);
      postUrls.add(p.url);
    }
  }

  // ── 5. Dive into top posts ──
  w('\n---\n## Дайв у топ-пости (коментарі)\n');

  const topUrls = Array.from(postUrls).slice(0, 10);
  for (const url of topUrls) {
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

  // ── 6. Google — creator age stats ──
  w('\n---\n## Google — creator demographics\n');

  const googleQueries = [
    'TikTok creator age demographics 16 18 2024 survey',
    'Gen Z content creator posting frequency statistics 2024',
    'TikTok vs Instagram Reels creator age split 2024',
    'young creator speed to publish trend urgency survey',
  ];

  for (const q of googleQueries) {
    const gUrl = `https://www.google.com/search?q=${encodeURIComponent(q)}&num=5`;
    w(`\n### Google: "${q}"`);
    try {
      await page.goto(gUrl, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await page.waitForTimeout(1500);

      const results = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('h3')).slice(0, 6).map(h => {
          const a = h.closest('a');
          const snippet = h.closest('.g, [data-sokoban-container]')
            ?.querySelector('span[style*="line"], .VwiC3b, .IsZvec')?.textContent?.trim();
          return { title: h.textContent?.trim(), url: a?.href, snippet: snippet?.slice(0, 300) };
        }).filter(r => r.title);
      });

      for (const r of results) {
        w(`- **${r.title}**`);
        if (r.url) w(`  ${r.url}`);
        if (r.snippet) w(`  ${r.snippet}`);
      }
    } catch (e) {
      w(`  ERROR: ${e.message}`);
    }
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
