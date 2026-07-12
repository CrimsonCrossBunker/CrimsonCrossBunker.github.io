#!/usr/bin/env node
/**
 * 从 CCB 主分支的 first-parent 历史增量生成开发动态。
 *
 * 用法：
 *   node scripts/generate-all-blogs.js [仓库路径]
 *   node scripts/generate-all-blogs.js [仓库路径] --dry-run
 *   node scripts/generate-all-blogs.js [仓库路径] --force [--since=2026-07-01]
 *   node scripts/generate-all-blogs.js [仓库路径] --fill-gaps
 *   node scripts/generate-all-blogs.js [仓库路径] --ref=origin/master --prune
 *
 * 默认从最新文章之后继续生成。--fill-gaps 补历史空档；--force 覆盖目标范围；
 * --prune 删除目标 ref 最新活动日期之后残留的自动文章。
 */

const {execFileSync} = require('child_process');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const option = (name) => args.find((arg) => arg.startsWith(`--${name}=`))?.slice(name.length + 3);
const REPO_PATH = args.find((arg) => !arg.startsWith('--')) || '../Cataclysm-Cleanwater-Bomb';
const BLOG_DIR = path.join(__dirname, '..', 'blog');
const REPO_SLUG = option('repo') || 'LYHGLYTX/Cataclysm-Cleanwater-Bomb';
// CCB 在当前 GitHub 仓库建立独立 first-parent 主线的日期。
// 此前的对象属于 fork 的上游祖先或临时 refs，不是 CCB 项目动态。
const PROJECT_START = option('project-start') || '2026-06-02';
const PR_START = option('pr-start') || '2026-06-02';
const DRY_RUN = args.includes('--dry-run');
const FORCE = args.includes('--force');
const FILL_GAPS = args.includes('--fill-gaps');
const PRUNE = args.includes('--prune');
const SINCE = option('since') || null;

function git(...gitArgs) {
  return execFileSync('git', ['-C', REPO_PATH, ...gitArgs], {
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  });
}

function refExists(ref) {
  try {
    git('rev-parse', '--verify', '--quiet', ref);
    return true;
  } catch {
    return false;
  }
}

if (!fs.existsSync(path.join(REPO_PATH, '.git'))) {
  console.error(`[error] 找不到 git 仓库：${REPO_PATH}`);
  process.exit(1);
}
if (!fs.existsSync(BLOG_DIR)) {
  console.error(`[error] 找不到博客目录：${BLOG_DIR}`);
  process.exit(1);
}
if (SINCE && !/^\d{4}-\d{2}-\d{2}$/.test(SINCE)) {
  console.error(`[error] --since 必须使用 YYYY-MM-DD：${SINCE}`);
  process.exit(1);
}

const requestedRef = option('ref');
const TARGET_REF = requestedRef
  || (refExists('refs/remotes/origin/master') ? 'refs/remotes/origin/master' : null)
  || (refExists('refs/heads/master') ? 'refs/heads/master' : 'HEAD');
if (!refExists(TARGET_REF)) {
  console.error(`[error] 找不到目标 ref：${TARGET_REF}`);
  process.exit(1);
}

function escapeMDX(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\{/g, '&#123;')
    .replace(/\}/g, '&#125;');
}

function escapeTable(value, maxLength = 120) {
  return escapeMDX(String(value).replace(/\|/g, '\\|').slice(0, maxLength));
}

function formatDate(isoDate) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date(isoDate));
  const get = (type) => parts.find((part) => part.type === type)?.value;
  return `${get('year')}-${get('month')}-${get('day')}`;
}

function cleanName(name) {
  const clean = String(name || '').replace(/\s*git config\b.*$/i, '').trim();
  return clean || '未知贡献者';
}

function noreplyLogin(email) {
  const match = String(email || '').match(/^(?:\d+\+)?([^@]+)@users\.noreply\.github\.com$/i);
  return match?.[1] || null;
}

const identityByEmail = new Map();
const verifiedByName = new Map();
const identityLines = git(
  'log', TARGET_REF, `--since=${PROJECT_START}T00:00:00+08:00`, '--format=%an%x1f%ae',
).split('\n').filter(Boolean);

for (const line of identityLines) {
  const [rawName, email = ''] = line.split('\x1f');
  const verified = noreplyLogin(email);
  if (verified) verifiedByName.set(cleanName(rawName).toLowerCase(), verified);
}

for (const line of identityLines) {
  if (!line) continue;
  const [rawName, email = ''] = line.split('\x1f');
  const verified = noreplyLogin(email) || verifiedByName.get(cleanName(rawName).toLowerCase());
  const name = verified || cleanName(rawName);
  if (!identityByEmail.has(email) || verified) {
    identityByEmail.set(email, {name, verified: Boolean(verified)});
  }
}

function resolveUser(name, email = '') {
  const verified = noreplyLogin(email) || verifiedByName.get(cleanName(name).toLowerCase());
  if (verified) return {name: verified, verified: true};
  return identityByEmail.get(email) || {name: cleanName(name), verified: false};
}

function githubUser(name) {
  return {name: cleanName(name), verified: true};
}

function parseRecords(output) {
  return output.split('\x1e').map((record) => record.replace(/^\n+|\n+$/g, '')).filter(Boolean);
}

function buildPRMap() {
  const output = git(
    'log', TARGET_REF, '--first-parent', '--merges', '--reverse',
    `--since=${PR_START}T00:00:00+08:00`,
    '--format=%H%x1f%P%x1f%cI%x1f%an%x1f%ae%x1f%B%x1e',
  );
  const map = new Map();

  for (const record of parseRecords(output)) {
    const [hash, parentsText, dateIso, mergerName, mergerEmail, ...bodyParts] = record.split('\x1f');
    const body = bodyParts.join('\x1f').trim();
    const lines = body.split('\n').map((line) => line.trim()).filter(Boolean);
    const mergeLine = lines[0] || '';
    const match = mergeLine.match(/^Merge pull request #(\d+) from (\S+)/);
    if (!match) continue;

    const parents = parentsText.trim().split(/\s+/);
    if (parents.length < 2) continue;
    const [firstParent, secondParent] = parents;
    const number = Number(match[1]);
    const branchOwner = githubUser(match[2].split('/')[0]);
    const tipLine = git('log', '-1', '--format=%an%x1f%ae%x1f%s', secondParent).trim();
    const [tipName = '', tipEmail = '', tipSubject = ''] = tipLine.split('\x1f');
    const tipUser = resolveUser(tipName, tipEmail);
    const creator = tipUser.name === '未知贡献者'
      ? branchOwner
      : (tipUser.name.toLowerCase() === branchOwner.name.toLowerCase() ? branchOwner : tipUser);

    const authorCounts = new Map();
    for (const authorLine of git(
      'log', '--no-merges', '--format=%an%x1f%ae', `${firstParent}..${secondParent}`,
    ).split('\n')) {
      if (!authorLine) continue;
      const [authorName, authorEmail = ''] = authorLine.split('\x1f');
      const user = resolveUser(authorName, authorEmail);
      const key = user.name.toLowerCase();
      const current = authorCounts.get(key) || {user, commits: 0};
      if (user.verified && !current.user.verified) current.user = user;
      current.commits++;
      authorCounts.set(key, current);
    }
    const contributors = [...authorCounts.values()].sort((a, b) => b.commits - a.commits);
    const contributor = contributors[0]?.user || creator;
    const title = lines.slice(1).find((line) => !line.startsWith('Merge ')) || tipSubject || '无标题';

    map.set(hash, {
      number,
      url: `https://github.com/${REPO_SLUG}/pull/${number}`,
      title,
      creator,
      contributor,
      contributors,
      merger: resolveUser(mergerName, mergerEmail),
      dateIso,
    });
  }
  return map;
}

const PR_MAP = buildPRMap();
const dayMap = new Map();
const mainlineOutput = git(
  'log', TARGET_REF, '--first-parent', '--reverse',
  `--since=${PROJECT_START}T00:00:00+08:00`,
  '--format=%H%x1f%P%x1f%cI%x1f%an%x1f%ae%x1f%s%x1e',
);

function dayFor(dateStr) {
  if (!dayMap.has(dateStr)) dayMap.set(dateStr, {commits: [], prs: [], users: new Map()});
  return dayMap.get(dateStr);
}

function rememberUser(day, user) {
  const key = user.name.toLowerCase();
  if (!day.users.has(key) || user.verified) day.users.set(key, user);
  return key;
}

for (const record of parseRecords(mainlineOutput)) {
  const [fullHash, parentsText, dateIso, authorName, authorEmail, ...subjectParts] = record.split('\x1f');
  const subject = subjectParts.join('\x1f').trim();
  const dateStr = formatDate(dateIso);
  const day = dayFor(dateStr);
  const pr = PR_MAP.get(fullHash);

  if (pr) {
    day.prs.push(pr);
    rememberUser(day, pr.creator);
    rememberUser(day, pr.contributor);
    rememberUser(day, pr.merger);
    for (const entry of pr.contributors) rememberUser(day, entry.user);
  } else {
    // first-parent 上非 CCB PR 的 merge（例如同步前的上游 merge 或普通分支 merge）
    // 既不能链接成 CCB PR，也不应伪装成一次直接提交。
    if (parentsText.trim().split(/\s+/).length > 1) continue;
    const author = resolveUser(authorName, authorEmail);
    day.commits.push({
      hash: fullHash.slice(0, 7),
      fullHash,
      author,
      subject,
      dateIso,
    });
    rememberUser(day, author);
  }
}

const existingDates = fs.readdirSync(BLOG_DIR)
  .map((name) => name.match(/^(\d{4}-\d{2}-\d{2})-activity\.md$/)?.[1])
  .filter(Boolean)
  .sort();
const latestExistingDate = existingDates.at(-1) || null;
const sourceDates = [...dayMap.keys()].sort();
const latestSourceDate = sourceDates.at(-1) || null;

console.log(`[info] 目标 ref：${TARGET_REF} (${git('rev-parse', '--short', TARGET_REF).trim()})`);
console.log(`[info] 主线共有 ${sourceDates.length} 天有活动，识别到 ${PR_MAP.size} 个 CCB 合并 PR`);
if (!FORCE && !FILL_GAPS && latestExistingDate) console.log(`[info] 从 ${latestExistingDate} 之后增量生成`);

function scoreDay(day) {
  const stats = new Map();
  const add = (user, field, amount = 1) => {
    const key = rememberUser(day, user);
    const current = stats.get(key) || {user, commits: 0, prs: 0, merges: 0};
    if (user.verified && !current.user.verified) current.user = user;
    current[field] += amount;
    stats.set(key, current);
  };
  for (const commit of day.commits) add(commit.author, 'commits');
  for (const pr of day.prs) {
    add(pr.creator, 'prs');
    add(pr.merger, 'merges');
    for (const entry of pr.contributors) add(entry.user, 'commits', entry.commits);
  }
  return [...stats.values()].sort((a, b) => {
    const aScore = a.merges * 4 + a.prs * 3 + a.commits;
    const bScore = b.merges * 4 + b.prs * 3 + b.commits;
    return bScore - aScore || a.user.name.localeCompare(b.user.name);
  });
}

function authorYaml(users) {
  if (!users.length) return 'authors: []';
  return `authors:\n${users.map((user) => {
    const name = JSON.stringify(user.name);
    if (!user.verified) return `  - {name: ${name}}`;
    return `  - {name: ${name}, image_url: "https://github.com/${user.name}.png?size=40", url: "https://github.com/${user.name}"}`;
  }).join('\n')}`;
}

function contributorMarkup(user) {
  const safeName = escapeMDX(user.name);
  if (!user.verified) return `  <span class="contributor-badge"><span>${safeName}</span></span>`;
  return `  <a href="https://github.com/${user.name}" title="@${user.name}" class="contributor-badge"><img src="https://github.com/${user.name}.png?size=40" width="28" height="28" loading="lazy" alt="" /><span>${safeName}</span></a>`;
}

function renderPost(dateStr, day) {
  const stats = scoreDay(day);
  const picked = [];
  const pickedKeys = new Set();
  const pick = (entry) => {
    if (!entry) return;
    const key = entry.user.name.toLowerCase();
    if (pickedKeys.has(key)) return;
    pickedKeys.add(key);
    picked.push(entry.user);
  };
  for (const entry of [...stats].sort((a, b) => b.commits - a.commits)) {
    if (picked.length >= 3) break;
    if (entry.commits > 0) pick(entry);
  }
  pick([...stats].sort((a, b) => b.merges - a.merges).find((entry) => entry.merges > 0));
  for (const entry of stats) {
    if (picked.length >= 12) break;
    pick(entry);
  }

  const lines = [
    '---',
    `slug: ${dateStr}-activity`,
    `title: CCB 开发动态 (${dateStr})`,
    `date: ${dateStr}`,
    authorYaml(picked),
    'tags: [activity, auto]',
    '---',
    '',
    `${dateStr} 开发动态，依据 CCB 主分支记录自动生成。`,
    '',
    '{/* truncate */}',
    '',
    '## 今日贡献者',
    '',
    '<div class="contributors-row">',
    ...stats.slice(0, 20).map((entry) => contributorMarkup(entry.user)),
    '</div>',
    '',
  ];

  if (day.prs.length) {
    lines.push(`## 已合并 PR（${day.prs.length}）`, '');
    lines.push('| PR | 标题 | 创建者 | 主要贡献者 | 合并者 |', '|---|---|---|---|---|');
    for (const pr of day.prs) {
      lines.push(`| [#${pr.number}](${pr.url}) | ${escapeTable(pr.title)} | ${escapeMDX(pr.creator.name)} | ${escapeMDX(pr.contributor.name)} | ${escapeMDX(pr.merger.name)} |`);
    }
    lines.push('');
  }

  if (day.commits.length) {
    lines.push(`## 主线直接提交（${day.commits.length}）`, '');
    lines.push('| 提交 | 说明 | 作者 | 时间 |', '|---|---|---|---|');
    for (const commit of day.commits.slice(0, 100)) {
      lines.push(`| [${commit.hash}](https://github.com/${REPO_SLUG}/commit/${commit.fullHash}) | ${escapeTable(commit.subject, 100)} | ${escapeMDX(commit.author.name)} | ${formatDate(commit.dateIso)} |`);
    }
    lines.push('');
  }
  return lines.join('\n');
}

let created = 0;
let updated = 0;
let skipped = 0;
let pruned = 0;

for (const [dateStr, day] of [...dayMap.entries()].sort(([a], [b]) => a.localeCompare(b))) {
  if (SINCE && dateStr < SINCE) continue;
  if (!FORCE && !FILL_GAPS && latestExistingDate && dateStr <= latestExistingDate) {
    skipped++;
    continue;
  }
  const file = path.join(BLOG_DIR, `${dateStr}-activity.md`);
  const exists = fs.existsSync(file);
  if (exists && !FORCE) {
    skipped++;
    continue;
  }
  if (DRY_RUN) console.log(`[dry] ${exists ? '更新' : '新增'} ${dateStr}`);
  else fs.writeFileSync(file, renderPost(dateStr, day), 'utf8');
  if (exists) updated++;
  else created++;
}

if (PRUNE && latestSourceDate) {
  const sourceDateSet = new Set(sourceDates);
  for (const dateStr of existingDates.filter((date) => {
    if (SINCE && date < SINCE) return false;
    return date > latestSourceDate || !sourceDateSet.has(date);
  })) {
    const file = path.join(BLOG_DIR, `${dateStr}-activity.md`);
    const content = fs.readFileSync(file, 'utf8');
    if (!content.includes('tags: [activity, auto]')) continue;
    if (DRY_RUN) console.log(`[dry] 删除主线外文章 ${dateStr}`);
    else fs.unlinkSync(file);
    pruned++;
  }
}

console.log(`[done] ${DRY_RUN ? '预览' : '完成'}：新增 ${created}，更新 ${updated}，保留 ${skipped}，删除 ${pruned}`);
