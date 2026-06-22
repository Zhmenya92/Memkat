/**
 * v2d — CapCut pricing posts + 16yo editor post
 * Цільові: Г5 (paywall quotes), Г7 (ToS), В3 (16yo)
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const OUTPUT = path.resolve(__dirname, '../notes-v2d-capcut.md');
const lines = [];
const w = (s = '') => { lines.push(s); process.stdout.write(s + '\n'); };

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36';

function toOldReddit(url) {
  if (!url || /\.(jpg|jpeg|png|gif|mp4)$/i.test(url) || url.includes('i.redd.it')) return null;
  if (url.includes('old.reddit.com')) return url;
  return url.replace('https://www.reddit.com', 'https://old.reddit.com')
            .replace('https://reddit.com', 'https://old.reddit.com');
}

async function subredditListing(page, sub, sort = 'top', time = 'year', limit = 30) {
  const url = `https://old.reddit.com/r/${sub}/${sort}/?t=${time}`;
  w(`\n→ Listing r/${sub} [${sort}/${time}]`);
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 25000 });
    await page.waitForTimeout(1500);
    return await page.evaluate((limit) => {
      return Array.from(document.querySelectorAll('.thing.link'))
        .slice(0, limit)
        .map(el => {
          const title = el.querySelector('.title a.title')?.textContent?.trim() || '';
          const href = el.querySelector('a.title')?.href || '';
          const score = el.querySelector('.score.unvoted')?.textContent?.trim() || '';
          const isImg = href.includes('i.redd.it') || /\.(jpg|jpeg|png|gif|mp4)$/i.test(href);
          return { title, url: href, score, isImg };
        }).filter(p => p.title && p.url);
    }, limit);
  } catch (e) {
    w(`  ERROR: ${e.message.slice(0, 100)}`);
    return [];
  }
}

async function redditPost(page, url, maxComments = 25) {
  const cleanUrl = toOldReddit(url);
  if (!cleanUrl) { w(`  SKIP: ${url}`); return null; }
  w(`\n→ ${cleanUrl}`);
  try {
    await page.goto(cleanUrl, { waitUntil: 'domcontentloaded', timeout: 25000 });
    await page.waitForTimeout(1500);
    return await page.evaluate((max) => {
      const title = document.querySelector('.thing.link .title a.title')?.textContent?.trim()
                 || document.querySelector('.title a.title')?.textContent?.trim() || '';
      const selfEl = document.querySelector('.thing.link .usertext-body .md');
      const selftext = selfEl?.innerText?.trim().slice(0, 1200) || '';
      const score = document.querySelector('.thing.link .score.likes, .thing.link .score.unvoted')?.textContent?.trim() || '';
      const sub = document.querySelector('.subreddit')?.textContent?.trim() || '';

      const comments = Array.from(document.querySelectorAll('.nestedlisting > .comment'))
        .slice(0, max)
        .map(c => {
          const txt = c.querySelector('.usertext-body .md')?.innerText?.trim();
          const sc = c.querySelector('.score')?.textContent?.trim() || '';
          if (txt && txt.length > 40 &&
              !txt.startsWith('[deleted]') && !txt.startsWith('[removed]') &&
              !txt.startsWith('Welcome to r/')) {
            return `[${sc}] ${txt.slice(0, 700)}`;
          }
          return null;
        }).filter(Boolean);

      return { title, selftext, score, sub, comments };
    }, maxComments);
  } catch (e) {
    w(`  ERROR: ${e.message.slice(0, 150)}`);
    return null;
  }
}

async function main() {
  w('# v2d — CapCut pricing + 16yo editor posts');
  w(`Дата: ${new Date().toISOString().slice(0, 10)}`);
  w('---\n');

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });
  const ctx = await browser.newContext({ userAgent: UA, viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();

  // ── Re-list r/CapCut to get URLs for missed posts ──────────────────
  w('## r/CapCut top/year — full list with URLs\n');
  const yearPosts = await subredditListing(page, 'CapCut', 'top', 'year', 30);
  yearPosts.filter(p => !p.isImg).forEach(p => {
    w(`[${p.score}] ${p.title}`);
    w(`  ${p.url}`);
  });

  w('\n## r/CapCut top/month — full list with URLs\n');
  const monthPosts = await subredditListing(page, 'CapCut', 'top', 'month', 25);
  monthPosts.filter(p => !p.isImg).forEach(p => {
    w(`[${p.score}] ${p.title}`);
    w(`  ${p.url}`);
  });

  // ── Select posts to dive ────────────────────────────────────────────
  const priceFilter = /delet|warn|worst|hate|scam|die|done|end|alt|paid|money|term|subscri|price|increas|free/i;
  const yearTarget = yearPosts.filter(p => !p.isImg && priceFilter.test(p.title));
  const monthTarget = monthPosts.filter(p => !p.isImg);

  const targetPosts = [...new Set([...yearTarget, ...monthTarget].map(p => p.url))];

  w('\n---\n## DIVE: Targeted posts\n');
  w(`Posts to read: ${targetPosts.length}`);

  for (const url of targetPosts) {
    const post = await redditPost(page, url);
    if (!post) continue;
    if (!post.selftext && post.comments.length === 0) {
      w(`  (no content for: ${post.title})`);
      continue;
    }
    w(`\n### [${post.score}] ${post.title}`);
    w(`URL: ${url}`);
    if (post.selftext) {
      w('\n**Пост:**');
      w(post.selftext);
    }
    if (post.comments.length > 0) {
      w(`\n**Коментарі (${post.comments.length}):**`);
      post.comments.forEach(c => w(`- ${c}`));
    }
  }

  // ── Also: r/VideoEditing "Social Media Is Really Ruining Video" ─────
  w('\n---\n## r/VideoEditing — Social Media Is Ruining Video\n');
  const vidPosts = await subredditListing(page, 'VideoEditing', 'top', 'year', 25);
  const socialMediaPost = vidPosts.find(p => /social media/i.test(p.title));
  if (socialMediaPost) {
    w(`Found: [${socialMediaPost.score}] ${socialMediaPost.title}`);
    const post = await redditPost(page, socialMediaPost.url);
    if (post) {
      w(`\n### [${post.score}] ${post.title}`);
      if (post.selftext) { w('**Пост:**'); w(post.selftext); }
      if (post.comments.length > 0) {
        w(`\n**Коментарі (${post.comments.length}):**`);
        post.comments.forEach(c => w(`- ${c}`));
      }
    }
  }

  // ── r/teenagers — editing and phone posts ──────────────────────────
  w('\n---\n## r/teenagers — TikTok/CapCut/phone posts\n');
  const teenPosts = await subredditListing(page, 'teenagers', 'top', 'year', 30);
  const teenTarget = teenPosts.filter(p =>
    !p.isImg && /tiktok|capcut|edit|phone|video|app|android|iphone/i.test(p.title)
  );
  w(`Found ${teenTarget.length} relevant posts:`);
  teenTarget.forEach(p => {
    w(`[${p.score}] ${p.title}`);
    w(`  ${p.url}`);
  });

  // Dive into teen posts
  for (const p of teenTarget.slice(0, 5)) {
    const post = await redditPost(page, p.url);
    if (!post || (!post.selftext && post.comments.length === 0)) continue;
    w(`\n### [${post.score}] ${post.title}`);
    if (post.selftext) { w('**Пост:**'); w(post.selftext); }
    if (post.comments.length > 0) {
      w(`\n**Коментарі (${post.comments.length}):**`);
      post.comments.forEach(c => w(`- ${c}`));
    }
  }

  await browser.close();
  fs.writeFileSync(OUTPUT, lines.join('\n'), 'utf8');
  w(`\n✓ Saved: ${OUTPUT}`);
}

main().catch(e => {
  w(`\nFATAL: ${e.message}\n${e.stack}`);
  fs.writeFileSync(OUTPUT, lines.join('\n'), 'utf8');
  process.exit(1);
});
