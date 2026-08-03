'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const {
  DOCS_URL,
  GUIDE_URL,
  validateNavigationSource,
} = require('./check-navigation');

function item(href, label, position = 'right') {
  return `{ href: '${href}', label: '${label}', position: '${position}', }`;
}

test('接受物品维基后紧邻双语开发文档的导航', () => {
  const source = [
    item(GUIDE_URL, '物品维基 ↗'),
    item(DOCS_URL, '开发文档 ↗'),
    item('https://github.com/example/repo', 'GitHub ↗'),
  ].join('\n');
  assert.deepEqual(validateNavigationSource(source), []);
});

test('拒绝缺失或重复的开发文档入口', () => {
  const missing = item(GUIDE_URL, '物品维基 ↗');
  assert.match(validateNavigationSource(missing).join('\n'), /开发文档导航/);

  const duplicate = [
    item(GUIDE_URL, '物品维基 ↗'),
    item(DOCS_URL, '开发文档 ↗'),
    item(DOCS_URL, '开发文档 ↗'),
  ].join('\n');
  assert.match(validateNavigationSource(duplicate).join('\n'), /只能出现一次/);
});

test('拒绝错误 URL、位置或不相邻顺序', () => {
  const source = [
    item(GUIDE_URL, '物品维基 ↗', 'left'),
    item('https://github.com/example/repo', 'GitHub ↗'),
    item('https://example.invalid/docs', '开发文档 ↗'),
  ].join('\n');
  const errors = validateNavigationSource(source).join('\n');
  assert.match(errors, /CCB-Docs Pages/);
  assert.match(errors, /导航右侧/);
  assert.match(errors, /紧邻/);
});
