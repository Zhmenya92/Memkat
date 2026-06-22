/**
 * v2b — direct post dive, fix URL bug
 * Читає конкретні пости + додаткові subreddit listing
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const OUTPUT = path.resolve(__dirname, '../notes-v2b-posts.md');
const lines = [];
const w = (s = '') => { lines.push(s); process.stdout.write(s + '\n'); };

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36';

function toOldReddit(url) {
  if (!url || url.includes('i.redd.it') || url.includes('.jpg') || url.includes('.jpeg') || url.includes('.png')) return null;
  if (url.includes('old.reddit.com')) return url;
  return url.replace('https://www.reddit.com', 'https://old.reddit.com')
            .replace('https://reddit.com', 'https://old.reddit.com');
}

async function redditPost(page, rawUrl, maxComments = 20) {
  const url = toOldReddit(rawUrl);
  if (!url) { w(`  SKIP (image): ${rawUrl}`); return null; }
  w(`\n→ Post: ${url}`);
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 25000 });
    await page.waitForTimeout(1500);
    return await page.evaluate((max) => {
      const title = document.querySelector('.title a.title')?.textContent?.trim() || '';
      const selftext = document.querySelector('.usertext-body .md')?.innerText?.trim().slice(0, 1000) || '';
      const score = document.querySelector('.score.likes, .score.unvoted')?.textContent?.trim() || '';
      const sub = document.querySelector('.subreddit')?.textContent?.trim() || '';
      const comments = Array.from(document.querySelectorAll('.nestedlisting > .comment, .commentarea > .sitetable > .comment'))
        .slice(0, max)
        .map(c => {
          const txt = c.querySelector('.usertext-body .md')?.innerText?.trim();
          const sc = c.querySelector('.score')?.textContent?.trim() || '';
          if (txt && txt.length > 30 && !txt.startsWith('[deleted]') && !txt.startsWith('[removed]')) {
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

async function subredditListing(page, sub, sort = 'top', time = 'year', limit = 30) {
  const url = `https://old.reddit.com/r/${sub}/${sort}/?t=${time}`;
  w(`\n→ r/${sub} listing [${sort}/${time}]`);
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

async function main() {
  w('# v2b — Post dive (URL bug fixed)');
  w(`Дата: ${new Date().toISOString().slice(0, 10)}`);
  w('---\n');

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });
  const ctx = await browser.newContext({ userAgent: UA, viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();

  // ── r/CapCut — кращий огляд ──────────────────────────────────────────
  w('## r/CapCut — топ за рік (розширений)\n');
  const capCut = await subredditListing(page, 'CapCut', 'top', 'year', 30);
  const capCutText = capCut.filter(p => !p.isImg);
  w(`Всього постів: ${capCut.length} (текстових: ${capCutText.length})`);
  capCutText.forEach(p => w(`  [${p.score}] ${p.title}`));

  // ── r/CapCut — топ за місяць (свіжіший sentiment) ─────────────────
  w('\n## r/CapCut — топ за місяць\n');
  const capCutMonth = await subredditListing(page, 'CapCut', 'top', 'month', 20);
  const capCutMonthText = capCutMonth.filter(p => !p.isImg);
  w(`Текстових: ${capCutMonthText.length}`);
  capCutMonthText.forEach(p => w(`  [${p.score}] ${p.title}`));

  // ── r/VideoEditing — top ─────────────────────────────────────────
  w('\n## r/VideoEditing — топ за рік\n');
  const vidEdit = await subredditListing(page, 'VideoEditing', 'top', 'year', 25);
  const vidEditText = vidEdit.filter(p => !p.isImg);
  w(`Текстових: ${vidEditText.length}`);
  vidEditText.forEach(p => w(`  [${p.score}] ${p.title}`));

  // ── r/TikTokTips — топ (all time) ────────────────────────────────
  w('\n## r/TikTokTips — топ за весь час\n');
  const tiktokAll = await subredditListing(page, 'TikTokTips', 'top', 'all', 20);
  const tiktokAllText = tiktokAll.filter(p => !p.isImg);
  w(`Текстових: ${tiktokAllText.length}`);
  tiktokAllText.forEach(p => w(`  [${p.score}] ${p.title}`));

  // ── r/ContentCreation — top ──────────────────────────────────────
  w('\n## r/ContentCreation — топ за рік\n');
  const contentCreation = await subredditListing(page, 'ContentCreation', 'top', 'year', 20);
  const contentCreationText = contentCreation.filter(p => !p.isImg);
  w(`Текстових: ${contentCreationText.length}`);
  contentCreationText.forEach(p => w(`  [${p.score}] ${p.title}`));

  // ── DIVE into specific posts ─────────────────────────────────────
  w('\n---\n## DIVE: конкретні пости\n');

  // Known URLs від listing (manually curated from previous run)
  const knownUrls = [
    // r/CapCut watermark/payment posts
    'https://old.reddit.com/r/CapCut/comments/1rwkdlf/free_cap_cut_pro_on_pc_updated_2026_tutorial/',
    'https://old.reddit.com/r/CapCut/comments/1n1ah6h/i_found_a_way_to_use_and_capcut_pro_effects_for/',
    // r/NewTubers discovery posts
    'https://old.reddit.com/r/NewTubers/comments/1ly3xl1/tools_i_wish_i_knew_about_before_starting_youtube/',
    'https://old.reddit.com/r/NewTubers/comments/1nya1le/you_arent_popular_because_your_videos_arent_good/',
    'https://old.reddit.com/r/NewTubers/comments/1m1m8bx/all_it_took_is_one_video_to_blow_up/',
    'https://old.reddit.com/r/NewTubers/comments/1mmo2v1/posted_my_first_video_an_made_an_instant_600/',
  ];

  // Add top text posts from r/CapCut and r/VideoEditing
  const extraUrls = [
    ...capCutText.filter(p => /watermark|pay|premium|upgrade|free|price|cost|remove|alternative|expensive|worth/i.test(p.title)).map(p => p.url),
    ...capCutText.filter(p => /meme|edit|trend|beginner|tutorial|how.to/i.test(p.title)).map(p => p.url),
    ...vidEditText.filter(p => /capcut|meme|beginner|tool|recommend|TikTok|trend/i.test(p.title)).map(p => p.url),
    ...tiktokAllText.filter(p => /edit|capcut|meme|trend|speed|fast|quick/i.test(p.title)).map(p => p.url),
    ...contentCreationText.filter(p => /edit|tool|capcut|TikTok|discovery|beginner/i.test(p.title)).map(p => p.url),
  ].slice(0, 15);

  const allPostUrls = [...new Set([...knownUrls, ...extraUrls])];
  w(`Total posts to dive: ${allPostUrls.length}`);

  let dived = 0;
  for (const url of allPostUrls) {
    const post = await redditPost(page, url);
    if (!post) continue;
    if (!post.selftext && post.comments.length === 0) { w('  (no content)'); continue; }
    dived++;
    w(`\n### [${post.score}] ${post.title}`);
    w(`Sub: ${post.sub} | URL: ${url}`);
    if (post.selftext) { w('\n**Пост:**'); w(post.selftext); }
    if (post.comments.length) {
      w(`\n**Коментарі (${post.comments.length}):**`);
      post.comments.forEach(c => w(`- ${c}`));
    }
  }

  w(`\n---\nTotal posts read: ${dived}`);

  await browser.close();
  fs.writeFileSync(OUTPUT, lines.join('\n'), 'utf8');
  w(`\n✓ Saved: ${OUTPUT}`);
}

main().catch(e => {
  w(`\nFATAL: ${e.message}\n${e.stack}`);
  fs.writeFileSync(OUTPUT, lines.join('\n'), 'utf8');
  process.exit(1);
});
