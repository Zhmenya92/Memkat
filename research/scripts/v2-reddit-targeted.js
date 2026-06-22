/**
 * v2 — Reddit targeted: Google site: operator → конкретні пости
 * Закриває: Г4 (голос 16-25), Г5 (watermark), Г3 (discovery), Г9 (E1 barrier),
 *           В1 (trigger Лізи), Г11 (G1 соціальне визнання), Г12 (speed>quality голоси)
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const OUTPUT = path.resolve(__dirname, '../notes-v2-reddit.md');
const lines = [];
const w = (s = '') => { lines.push(s); process.stdout.write(s + '\n'); };

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36';

// Google search → extract Reddit URLs + snippets
async function googleToReddit(page, query) {
  const url = `https://www.google.com/search?q=${encodeURIComponent(query)}&num=10&hl=en`;
  w(`\n→ Google: "${query}"`);
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 25000 });
    await page.waitForTimeout(2500);

    const results = await page.evaluate(() => {
      const out = [];
      // Try multiple selectors for Google search results
      const blocks = document.querySelectorAll('div.g, div[data-sokoban-container]');
      blocks.forEach(block => {
        const titleEl = block.querySelector('h3');
        const linkEl = block.querySelector('a[href]');
        const snippetEl = block.querySelector('.VwiC3b, .s3v9rd, .st, span[style*="-webkit-line-clamp"], .IsZvec');
        if (titleEl && linkEl) {
          const href = linkEl.getAttribute('href') || '';
          const snippet = snippetEl?.innerText?.trim() || '';
          if (href.includes('reddit.com')) {
            out.push({ title: titleEl.innerText?.trim(), url: href, snippet: snippet.slice(0, 400) });
          }
        }
      });
      // Fallback: grab all reddit links
      if (out.length === 0) {
        document.querySelectorAll('a[href*="reddit.com/r/"]').forEach(a => {
          const title = a.querySelector('h3')?.innerText || a.innerText?.trim();
          if (title && title.length > 5) {
            out.push({ title, url: a.href, snippet: '' });
          }
        });
      }
      return out.slice(0, 8);
    });

    results.forEach(r => {
      w(`  [LINK] ${r.title}`);
      w(`  ${r.url}`);
      if (r.snippet) w(`  ${r.snippet}`);
    });

    return results.map(r => r.url).filter(u => u.includes('/r/') && u.includes('/comments/'));
  } catch (e) {
    w(`  ERROR: ${e.message}`);
    return [];
  }
}

// Navigate to subreddit listing, grab titles of top posts
async function subredditTop(page, sub, sort = 'top', time = 'year') {
  const url = `https://old.reddit.com/r/${sub}/${sort}/?t=${time}`;
  w(`\n→ r/${sub} [${sort}/${time}]: ${url}`);
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 25000 });
    await page.waitForTimeout(1500);
    return await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.thing.link'))
        .slice(0, 25)
        .map(el => {
          const title = el.querySelector('.title a.title')?.textContent?.trim() || '';
          const href = el.querySelector('a.title')?.href || '';
          const score = el.querySelector('.score.unvoted')?.textContent?.trim() || '';
          const comments = el.querySelector('a.comments')?.textContent?.trim() || '';
          return { title, url: href, score, comments };
        })
        .filter(p => p.title && p.url);
    });
  } catch (e) {
    w(`  ERROR: ${e.message}`);
    return [];
  }
}

// Extract post content + comments
async function redditPost(page, url, maxComments = 15) {
  try {
    const cleanUrl = url.replace('www.reddit.com', 'old.reddit.com').replace('reddit.com/r/', 'old.reddit.com/r/');
    await page.goto(cleanUrl, { waitUntil: 'domcontentloaded', timeout: 25000 });
    await page.waitForTimeout(1500);
    return await page.evaluate((max) => {
      const title = document.querySelector('.title a.title')?.textContent?.trim() || '';
      const selftext = document.querySelector('.usertext-body .md')?.innerText?.trim().slice(0, 800) || '';
      const score = document.querySelector('.score.likes, .score.unvoted')?.textContent?.trim() || '';
      const comments = Array.from(document.querySelectorAll('.nestedlisting > .comment'))
        .slice(0, max)
        .map(c => {
          const txt = c.querySelector('.usertext-body .md')?.innerText?.trim();
          const sc = c.querySelector('.score')?.textContent?.trim() || '';
          if (txt && txt.length > 30 && !txt.startsWith('[deleted]') && !txt.startsWith('[removed]')) {
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
  w('# v2 — Reddit targeted research');
  w(`Дата: ${new Date().toISOString().slice(0, 10)}`);
  w('Мета: Г4, Г5, Г3, Г9, В1, Г11, Г12\n---\n');

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });
  const ctx = await browser.newContext({ userAgent: UA, viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();

  const allPostUrls = new Set();

  // ─── BLOCK 1: Watermark (Г5) ─────────────────────────────────────
  w('\n## BLOCK 1: Watermark & payment (Г5)');

  const wQueries = [
    'site:reddit.com CapCut watermark remove pay upgrade creator age',
    'site:reddit.com/r/CapCut watermark remove annoying',
    'site:reddit.com TikTok video watermark creator young GenZ pay',
  ];
  for (const q of wQueries) {
    const urls = await googleToReddit(page, q);
    urls.forEach(u => allPostUrls.add(u));
  }

  // Direct r/CapCut top posts
  w('\n### r/CapCut top posts');
  const capCutPosts = await subredditTop(page, 'CapCut', 'top', 'year');
  const watermarkPosts = capCutPosts.filter(p =>
    /watermark|pay|premium|upgrade|free|price|cost|remove/i.test(p.title)
  );
  w(`Found ${watermarkPosts.length} watermark-related posts out of ${capCutPosts.length} total:`);
  watermarkPosts.forEach(p => {
    w(`  [${p.score}] ${p.title}`);
    w(`  ${p.url}`);
    allPostUrls.add(p.url);
  });

  // ─── BLOCK 2: Creator voice & meme editing (Г4, Г12) ──────────────
  w('\n## BLOCK 2: Creator voice — meme editing, speed, trend (Г4, Г12)');

  const cQueries = [
    'site:reddit.com/r/TikTokTips CapCut meme editing workflow',
    'site:reddit.com "TikTok creator" OR "content creator" meme video editing trend 16 OR 17 OR 18',
    'site:reddit.com "editing meme" OR "meme video" CapCut TikTok quick speed',
    'site:reddit.com "how I edit" TikTok meme trend speed',
  ];
  for (const q of cQueries) {
    const urls = await googleToReddit(page, q);
    urls.forEach(u => allPostUrls.add(u));
  }

  // r/TikTokTips top posts
  w('\n### r/TikTokTips top posts');
  const tiktokTips = await subredditTop(page, 'TikTokTips', 'top', 'year');
  const editingPosts = tiktokTips.filter(p =>
    /edit|meme|capcut|speed|trend|quick|fast/i.test(p.title)
  );
  w(`Found ${editingPosts.length} editing-related:`);
  editingPosts.slice(0, 10).forEach(p => {
    w(`  [${p.score}] ${p.title}`);
    w(`  ${p.url}`);
    allPostUrls.add(p.url);
  });

  // r/CapCut — meme/editing posts
  const capCutEditing = capCutPosts.filter(p =>
    /meme|edit|trend|beginner|tutorial|how to/i.test(p.title)
  );
  w(`\nr/CapCut editing-related: ${capCutEditing.length}`);
  capCutEditing.slice(0, 8).forEach(p => {
    w(`  [${p.score}] ${p.title}`);
    w(`  ${p.url}`);
    allPostUrls.add(p.url);
  });

  // ─── BLOCK 3: Discovery / how creators find editor (Г3, В1) ────────
  w('\n## BLOCK 3: Discovery — how creators find editor (Г3, В1)');

  const dQueries = [
    'site:reddit.com "how did you find" OR "started using" OR "switched to" CapCut OR video editor recommendation',
    'site:reddit.com/r/NewTubers "what editor" OR "which editor" recommend CapCut beginner',
    'site:reddit.com "found out about" video editor TikTok OR YouTube OR Instagram creator',
    'site:reddit.com "how to add meme" video editing tutorial',
  ];
  for (const q of dQueries) {
    const urls = await googleToReddit(page, q);
    urls.forEach(u => allPostUrls.add(u));
  }

  // r/NewTubers listing for editor posts
  w('\n### r/NewTubers — editor-related top posts');
  const newTubers = await subredditTop(page, 'NewTubers', 'top', 'year');
  const editorPosts = newTubers.filter(p =>
    /editor|editing|CapCut|premiere|software|tool|app|video/i.test(p.title)
  );
  w(`Found ${editorPosts.length} editor-related:`);
  editorPosts.slice(0, 8).forEach(p => {
    w(`  [${p.score}] ${p.title}`);
    w(`  ${p.url}`);
    allPostUrls.add(p.url);
  });

  // ─── BLOCK 4: Emotional barrier (Г9 — E1) ──────────────────────────
  w('\n## BLOCK 4: Emotional barrier — "editor defeated me" (Г9)');

  const eQueries = [
    'site:reddit.com "gave up" OR "almost quit" OR "overwhelming" video editing beginner first time',
    'site:reddit.com CapCut "too complicated" OR "overwhelming" OR "gave up" beginner',
    'site:reddit.com "first time editing" scary intimidating overwhelming video creator',
    'site:reddit.com creator burnout "editing takes" OR "editing stress" TikTok',
  ];
  for (const q of eQueries) {
    const urls = await googleToReddit(page, q);
    urls.forEach(u => allPostUrls.add(u));
  }

  // ─── BLOCK 5: Social recognition (Г11 — G1) ─────────────────────────
  w('\n## BLOCK 5: Social recognition — "людина в темі" (Г11)');

  const sQueries = [
    'site:reddit.com creator TikTok trend aware "be the first" OR "trending" recognition peers',
    'site:reddit.com "post before" trend dies OR expires TikTok creator urgency',
    'site:reddit.com "my followers" OR "my audience" trend awareness creator identity',
  ];
  for (const q of sQueries) {
    const urls = await googleToReddit(page, q);
    urls.forEach(u => allPostUrls.add(u));
  }

  // ─── BLOCK 6: Ліза's trigger (В1) ──────────────────────────────────
  w('\n## BLOCK 6: Lisa trigger — search-based discovery (В1)');

  const lQueries = [
    'site:reddit.com "how to add meme" video OR TikTok OR Instagram',
    'site:reddit.com beginner "first editor" OR "first time using" CapCut 16 OR teenager',
    '"how to make meme video" tutorial search YouTube TikTok beginner 2024',
  ];
  for (const q of lQueries) {
    const urls = await googleToReddit(page, q);
    urls.forEach(u => allPostUrls.add(u));
  }

  // ─── DIVE INTO POSTS ────────────────────────────────────────────────
  w('\n---\n## DIVE: Post content extraction\n');

  const postList = Array.from(allPostUrls).slice(0, 20);
  w(`Total unique post URLs: ${postList.length}`);

  for (const url of postList) {
    const post = await redditPost(page, url);
    if (!post || (!post.selftext && post.comments.length === 0)) continue;
    w(`\n### ${post.title} [score: ${post.score}]`);
    w(`URL: ${url}`);
    if (post.selftext) { w('**Пост:**'); w(post.selftext); }
    if (post.comments.length) {
      w('**Коментарі:**');
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
