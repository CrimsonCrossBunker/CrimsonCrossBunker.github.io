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
const REPO_OWNER = REPO_SLUG.split('/')[0].toLowerCase();
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
// 同一贡献者在普通邮箱提交和 GitHub noreply 提交中使用了不同显示名，
// 仅凭 git 邮箱无法自动关联，保留已核实的显示名到 GitHub 登录名映射。
const KNOWN_LOGIN_BY_NAME = new Map([
  ['lunaglaze', 'LunaGlaze'],
  ['eliadoarias', 'EliadOArias'],
  ['yuebai', 'byiyuebai'],
]);
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
    identityByEmail.set(email, {
      name,
      login: verified || undefined,
      verified: Boolean(verified),
    });
  }
}

for (const [name, login] of KNOWN_LOGIN_BY_NAME) verifiedByName.set(name, login);

function resolveUser(name, email = '') {
  const displayName = cleanName(name);
  const knownLogin = KNOWN_LOGIN_BY_NAME.get(displayName.toLowerCase());
  if (knownLogin) return {name: displayName, login: knownLogin, verified: true};
  const verified = noreplyLogin(email) || verifiedByName.get(displayName.toLowerCase());
  if (verified) return {name: verified, login: verified, verified: true};
  return identityByEmail.get(email) || {name: cleanName(name), verified: false};
}

function githubUser(name) {
  const login = cleanName(name);
  return {name: login, login, verified: true};
}

function userKey(user) {
  return user.verified && user.login
    ? `github:${user.login.toLowerCase()}`
    : `name:${user.name.toLowerCase()}`;
}

function preferredUser(current, candidate) {
  if (!current) return candidate;
  if (candidate.verified && !current.verified) return candidate;
  if (candidate.verified && current.verified
    && candidate.login.toLowerCase() === current.login.toLowerCase()) {
    const currentIsLogin = current.name.toLowerCase() === current.login.toLowerCase();
    const candidateIsLogin = candidate.name.toLowerCase() === candidate.login.toLowerCase();
    if (currentIsLogin && !candidateIsLogin) return candidate;
  }
  return current;
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
  const loginByName = new Map(verifiedByName);

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
    const sourceRef = match[2];
    const branchOwner = githubUser(sourceRef.split('/')[0]);
    const tipLine = git('log', '-1', '--format=%an%x1f%ae%x1f%s', secondParent).trim();
    const [tipName = '', tipEmail = '', tipSubject = ''] = tipLine.split('\x1f');
    const title = lines.slice(1).find((line) => !line.startsWith('Merge ')) || tipSubject || '无标题';
    const rawTipUser = resolveUser(tipName, tipEmail);
    if (rawTipUser.name !== '未知贡献者'
      && (branchOwner.login.toLowerCase() !== REPO_OWNER
        || rawTipUser.name.toLowerCase() === branchOwner.login.toLowerCase())) {
      loginByName.set(rawTipUser.name.toLowerCase(), branchOwner.login);
    }
    // 普通邮箱无法直接反查 GitHub 帐号。PR head 的仓库所有者是可靠的
    // GitHub 身份，因此保留提交者显示名，并用 head owner 提供头像和链接。
    const tipUser = !rawTipUser.verified
      && rawTipUser.name !== '未知贡献者'
      && branchOwner.login.toLowerCase() !== REPO_OWNER
      ? {...rawTipUser, login: branchOwner.login, verified: true}
      : rawTipUser;
    const creator = tipUser.name === '未知贡献者'
      ? branchOwner
      : (tipUser.name.toLowerCase() === branchOwner.name.toLowerCase() ? branchOwner : tipUser);

    const authorCounts = new Map();
    for (const authorLine of git(
      'log', '--no-merges', '--format=%an%x1f%ae', `${firstParent}..${secondParent}`,
    ).split('\n')) {
      if (!authorLine) continue;
      const [authorName, authorEmail = ''] = authorLine.split('\x1f');
      const resolvedUser = resolveUser(authorName, authorEmail);
      const user = !resolvedUser.verified
        && resolvedUser.name.toLowerCase() === rawTipUser.name.toLowerCase()
        ? tipUser
        : resolvedUser;
      const key = userKey(user);
      const current = authorCounts.get(key) || {user, commits: 0};
      current.user = preferredUser(current.user, user);
      current.commits++;
      authorCounts.set(key, current);
    }
    const contributors = [...authorCounts.values()].sort((a, b) => b.commits - a.commits);
    const contributor = contributors[0]?.user || creator;

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

  // 有些贡献者早期使用普通邮箱，直到较晚的 PR 才能确认 GitHub 帐号。
  // PR 扫描完成后统一回填，避免早期文章缺少头像和个人主页链接。
  const linkKnownUser = (user) => {
    if (user.verified) return user;
    const login = loginByName.get(user.name.toLowerCase());
    return login ? {...user, login, verified: true} : user;
  };
  for (const pr of map.values()) {
    pr.creator = linkKnownUser(pr.creator);
    pr.contributor = linkKnownUser(pr.contributor);
    pr.merger = linkKnownUser(pr.merger);
    pr.contributors = pr.contributors.map((entry) => ({
      ...entry,
      user: linkKnownUser(entry.user),
    }));
  }
  for (const [name, login] of loginByName) verifiedByName.set(name, login);
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
  const key = userKey(user);
  day.users.set(key, preferredUser(day.users.get(key), user));
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
    current.user = preferredUser(current.user, user);
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
    // 合并工作单独评选“合并大王”，不计入每日贡献者排名。
    const aScore = a.prs * 3 + a.commits;
    const bScore = b.prs * 3 + b.commits;
    return bScore - aScore || a.user.name.localeCompare(b.user.name);
  });
}

function authorYaml(awards) {
  if (!awards.length) return 'authors: []';
  return `authors:\n${awards.map(({user}) => {
    const name = JSON.stringify(user.name);
    if (!user.verified) return `  - {name: ${name}}`;
    return `  - {name: ${name}, image_url: "https://github.com/${user.login}.png?size=40", url: "https://github.com/${user.login}"}`;
  }).join('\n')}`;
}

function contributorMarkup(user) {
  const safeName = escapeMDX(user.name);
  if (!user.verified) return `  <span class="contributor-badge"><span>${safeName}</span></span>`;
  return `  <a href="https://github.com/${user.login}" title="@${user.login}" class="contributor-badge"><img src="https://github.com/${user.login}.png?size=40" width="28" height="28" loading="lazy" alt="" /><span>${safeName}</span></a>`;
}

function renderPost(dateStr, day) {
  const stats = scoreDay(day);
  const contributorBadges = ['每日最佳员工', '勤奋贡献者', '积极贡献者'];
  const awards = stats
    .filter((entry) => entry.commits > 0 || entry.prs > 0)
    .slice(0, 3)
    .map((entry, index) => ({...entry, badge: contributorBadges[index]}));
  const awardedKeys = new Set(awards.map((entry) => userKey(entry.user)));
  const mergeWinner = [...stats]
    .sort((a, b) => b.merges - a.merges || a.user.name.localeCompare(b.user.name))
    .find((entry) => entry.merges > 0 && !awardedKeys.has(userKey(entry.user)));
  if (mergeWinner) awards.push({...mergeWinner, badge: '合并大王'});

  const lines = [
    '---',
    `slug: ${dateStr}-activity`,
    `title: CCB 开发动态 (${dateStr})`,
    `date: ${dateStr}`,
    authorYaml(awards),
    `author_badges: [${awards.map(({badge}) => JSON.stringify(badge)).join(', ')}]`,
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
