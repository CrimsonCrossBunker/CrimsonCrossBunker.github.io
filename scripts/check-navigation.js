#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const GUIDE_URL = 'https://crimsoncrossbunker.github.io/CCB-GUIDE/?lang=zh_CN';
const DOCS_URL = 'https://crimsoncrossbunker.github.io/CCB-Docs/';

function navbarExternalItems(source) {
  const pattern = /\{\s*href:\s*'([^']+)',\s*label:\s*'([^']+)',\s*position:\s*'([^']+)',\s*\}/g;
  return [...source.matchAll(pattern)].map((match) => ({
    href: match[1],
    label: match[2],
    position: match[3],
  }));
}

function validateNavigationSource(source) {
  const errors = [];
  const items = navbarExternalItems(source);
  const wikiIndexes = items
    .map((item, index) => (item.label === '物品维基 ↗' ? index : -1))
    .filter((index) => index >= 0);
  const docsIndexes = items
    .map((item, index) => (item.label === '开发文档 ↗' ? index : -1))
    .filter((index) => index >= 0);

  if (wikiIndexes.length !== 1) errors.push('物品维基导航必须且只能出现一次');
  if (docsIndexes.length !== 1) errors.push('开发文档导航必须且只能出现一次');
  if (errors.length) return errors;

  const wikiIndex = wikiIndexes[0];
  const docsIndex = docsIndexes[0];
  const wiki = items[wikiIndex];
  const docs = items[docsIndex];

  if (wiki.href !== GUIDE_URL) errors.push('物品维基 URL 与部署地址不一致');
  if (docs.href !== DOCS_URL) errors.push('开发文档 URL 与 CCB-Docs Pages 地址不一致');
  if (wiki.position !== 'right' || docs.position !== 'right') {
    errors.push('两个外部文档入口必须位于导航右侧');
  }
  if (docsIndex !== wikiIndex + 1) {
    errors.push('开发文档入口必须紧邻物品维基入口之后');
  }
  return errors;
}

function main() {
  const configPath = process.argv[2]
    ? path.resolve(process.argv[2])
    : path.join(__dirname, '..', 'docusaurus.config.js');
  const errors = validateNavigationSource(fs.readFileSync(configPath, 'utf8'));
  if (errors.length) {
    for (const error of errors) console.error(`[navigation] ${error}`);
    return 1;
  }
  console.log('homepage navigation validation passed');
  return 0;
}

if (require.main === module) process.exitCode = main();

module.exports = {
  DOCS_URL,
  GUIDE_URL,
  navbarExternalItems,
  validateNavigationSource,
};
