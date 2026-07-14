'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const {
  cleanName,
  compareContributorStats,
  isMergeCommitSubject,
  knownLogin,
} = require('./activity-blog-helpers');

test('清理错误拼接的 Git 作者名', () => {
  assert.equal(
    cleanName('Standing-StormStanding-Storm git config --global user.name Standing-Storm'),
    'Standing-Storm',
  );
});

test('把公开 Git 身份映射到已核实的 GitHub 帐号', () => {
  assert.equal(knownLogin('GuardianDll', 'antisim009@gmail.com'), 'GuardianDll');
  assert.equal(knownLogin('John Candlebury', 'johncandlebury@gmail.com'), 'John-Candlebury');
  assert.equal(knownLogin('Maksim Trukhinov', 'maks.truxinov@yandex.ru'), 'StriderDunedain');
  assert.equal(knownLogin('Kevin Denham - AVIXA', 'kdenham@avixa.org'), 'kevindenham');
});

test('贡献者只按非合并 commit 数量排名', () => {
  const stats = [
    {user: {name: 'PR-only'}, commits: 1, prs: 100, merges: 20},
    {user: {name: 'Commit-author'}, commits: 2, prs: 0, merges: 0},
  ].sort(compareContributorStats);
  assert.equal(stats[0].user.name, 'Commit-author');
});

test('识别结构被压平后仍带有 merge 标题的提交', () => {
  assert.equal(isMergeCommitSubject('Merge pull request #87958 from user/branch'), true);
  assert.equal(isMergeCommitSubject('Merge branch upstream/master'), true);
  assert.equal(isMergeCommitSubject('Fix merge conflict handling'), false);
});

test('7 月 14 日贡献者均有头像链接且没有重复身份', () => {
  const post = fs.readFileSync(
    path.join(__dirname, '..', 'blog', '2026-07-14-activity.md'),
    'utf8',
  );
  assert.doesNotMatch(post, /<span class="contributor-badge"/);
  assert.doesNotMatch(post, /Standing-StormStanding-Storm/);
  assert.equal((post.match(/href="https:\/\/github\.com\/GuardianDll"/g) || []).length, 1);
  for (const login of ['John-Candlebury', 'np4Huk', 'kevindenham', 'StriderDunedain', 'OromisElf', 'ZiggyRogue']) {
    assert.match(post, new RegExp(`href="https://github\\.com/${login}"`));
  }
});

test('所有自动开发动态的贡献者都有 GitHub 头像链接', () => {
  const blogDir = path.join(__dirname, '..', 'blog');
  for (const filename of fs.readdirSync(blogDir).filter((name) => /-activity\.md$/.test(name))) {
    const post = fs.readFileSync(path.join(blogDir, filename), 'utf8');
    assert.doesNotMatch(post, /<span class="contributor-badge"/, filename);
  }
});
