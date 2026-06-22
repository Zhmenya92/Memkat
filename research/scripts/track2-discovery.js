/**
 * Track 2 — Тригер та Discovery
 * Закриває: Г3 (як Аня знаходить МемКат — peer vs ad vs search),
 *           В1 (тригер Лізи — пошук), В4 (що переконує Лізу),
 *           В8 (що переконує Дениса), В9 (що відлякує Дениса)
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const OUTPUT = path.resolve(__dirname, '../notes-track2.md');
const lines = [];
const w = (s = '') => { lines.push(s); process.stdout.write(s + '\n'); };

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36';

async function redditSearch(page, sub, query, limit = 6) {
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

async function redditPost(page, url, maxComments = 15) {
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
    w(`  ERROR post: ${e.message}`);
    return null;
  }
}

async function main() {
  w('# Track 2 — Тригер та Discovery');
  w(`Дата: ${new Date().toISOString().slice(0, 10)}`);
  w('Мета: Г3 (як знаходять editor), В1 (тригер Лізи), В4/В8/В9 (що переконує/відлякує)\n');
  w('---\n');

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });
  const ctx = await browser.newContext({ userAgent: UA, viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();

  const postUrls = new Set();

  // ── 1. NewTubers — як знаходять editor ──
  w('## r/NewTubers — how creators find their editor\n');

  const s1 = [
    ['NewTubers', 'what video editor do you use recommend'],
    ['NewTubers', 'how did you find your editor switch from CapCut'],
    ['NewTubers', 'someone recommended video editor'],
    ['NewTubers', 'started using editor friend showed me'],
  ];
  for (const [sub, q] of s1) {
    const posts = await redditSearch(page, sub, q, 5);
    for (const p of posts) {
      w(`### [${p.score}] ${p.title}`);
      w(`URL: ${p.url}`);
      if (p.snippet) w(`Snippet: ${p.snippet}`);
      postUrls.add(p.url);
    }
  }

  // ── 2. VideoEditing — editor switch & discovery ──
  w('\n## r/VideoEditing — editor discovery & switching\n');

  const s2 = [
    ['VideoEditing', 'how beginners find video editor recommend'],
    ['VideoEditing', 'switched from CapCut why'],
    ['VideoEditing', 'discovered this editor TikTok ad search'],
    ['editors', 'how did you start using this editor recommend'],
  ];
  for (const [sub, q] of s2) {
    const posts = await redditSearch(page, sub, q, 5);
    for (const p of posts) {
      w(`### [${p.score}] ${p.title}`);
      w(`URL: ${p.url}`);
      if (p.snippet) w(`Snippet: ${p.snippet}`);
      postUrls.add(p.url);
    }
  }

  // ── 3. TikTok/Creator — discovery trigger ──
  w('\n## r/TikTok + r/ContentCreation — discovery triggers\n');

  const s3 = [
    ['TikTok', 'how add meme video tutorial editor'],
    ['TikTok', 'search YouTube how to make meme video'],
    ['ContentCreation', 'how did you discover your video editing tool'],
    ['ContentCreation', 'CapCut alternative found recommend'],
  ];
  for (const [sub, q] of s3) {
    const posts = await redditSearch(page, sub, q, 5);
    for (const p of posts) {
      w(`### [${p.score}] ${p.title}`);
      w(`URL: ${p.url}`);
      if (p.snippet) w(`Snippet: ${p.snippet}`);
      postUrls.add(p.url);
    }
  }

  // ── 4. Trust signals — що відлякує/переконує ──
  w('\n## Trust signals — що відлякує і що переконує\n');

  const s4 = [
    ['NewTubers', 'trust unknown app creator tool review'],
    ['VideoEditing', 'why I stopped using trust creator tool'],
    ['NewTubers', 'corporate brand tool vs independent creator tool'],
    ['TikTok', 'CapCut trust ByteDance privacy creator'],
  ];
  for (const [sub, q] of s4) {
    const posts = await redditSearch(page, sub, q, 4);
    for (const p of posts) {
      w(`### [${p.score}] ${p.title}`);
      w(`URL: ${p.url}`);
      if (p.snippet) w(`Snippet: ${p.snippet}`);
      postUrls.add(p.url);
    }
  }

  // ── 5. Дайв у топ-пости ──
  w('\n---\n## Дайв у топ-пости (коментарі)\n');

  const topUrls = Array.from(postUrls).slice(0, 12);
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

  // ── 6. Google — creator tool discovery research ──
  w('\n---\n## Google — creator tool discovery research\n');

  const gqs = [
    'how do content creators discover video editing tools survey 2024',
    'creator tool adoption word of mouth TikTok ad 2024',
    'how to add meme to video tutorial search volume',
    '"how did you find" video editor creator community survey',
  ];
  for (const q of gqs) {
    const gUrl = `https://www.google.com/search?q=${encodeURIComponent(q)}&num=5`;
    w(`\n### Google: "${q}"`);
    try {
      await page.goto(gUrl, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await page.waitForTimeout(1500);
      const results = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('h3')).slice(0, 6).map(h => {
          const a = h.closest('a');
          const g = h.closest('.g, [data-sokoban-container]');
          const snippet = g?.querySelector('.VwiC3b, .IsZvec, span[style*="line"]')?.textContent?.trim();
          return { title: h.textContent?.trim(), url: a?.href, snippet: snippet?.slice(0, 350) };
        }).filter(r => r.title && !r.url?.includes('google.com'));
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
