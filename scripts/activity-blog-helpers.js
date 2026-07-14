'use strict';

// 这些别名均来自 CCB/Cataclysm-DDA 的公开提交记录，并通过 GitHub
// commit/PR 元数据核实。Git 作者名和邮箱不一定等于 GitHub 登录名。
const KNOWN_LOGIN_BY_NAME = new Map([
  ['lunaglaze', 'LunaGlaze'],
  ['eliadoarias', 'EliadOArias'],
  ['yuebai', 'byiyuebai'],
  ['np4huk', 'np4Huk'],
  ['guardian dll', 'GuardianDll'],
  ['john candlebury', 'John-Candlebury'],
  ['john-candlebury', 'John-Candlebury'],
  ['maksim trukhinov', 'StriderDunedain'],
  ['oromiself', 'OromisElf'],
  ['kevin denham - avixa', 'kevindenham'],
  ['ziggyrogue', 'ZiggyRogue'],
  ['armaswiss', 'armaswiss'],
  ['jahkuba', 'jahkuba'],
  ['antonín drdácký', 'Brambor'],
  ['maya granade', 'kevingranade'],
  ['mihály verhás', 'Michael1993'],
  ['morat2255', 'Morat2255'],
  ['david seguin', 'dseguin'],
  ['eryk lepszy', 'Chazoshtare'],
  ['brambor', 'Brambor'],
  ['sharkman', 'sharkman'],
  ['dru', 'RDru'],
  ['holypedantic', 'HolyPedantic'],
  ['oleksii filonenko', 'Br1ght0ne'],
  ['evan brown', 'bobokapi'],
  ['lylesy', 'LyleSY'],
]);

const KNOWN_LOGIN_BY_EMAIL = new Map([
  ['dorchadas@gmail.com', 'Standing-Storm'],
  ['antisim009@gmail.com', 'GuardianDll'],
  ['johncandlebury@gmail.com', 'John-Candlebury'],
  ['22.valiant@gmail.com', 'np4Huk'],
  ['maks.truxinov@yandex.ru', 'StriderDunedain'],
  ['oromis.der.lehrer.eragons@freenet.de', 'OromisElf'],
  ['kdenham@avixa.org', 'kevindenham'],
  ['a7gfds835a@gmail.com', 'ZiggyRogue'],
  ['jhon.florey@gmail.com', 'armaswiss'],
  ['pr.darkman@gmail.com', 'jahkuba'],
  ['tondadrd@gmail.com', 'Brambor'],
  ['tondadrd@seznam.cz', 'Brambor'],
  ['kevin.granade@gmail.com', 'kevingranade'],
  ['misi.verhas@gmail.com', 'Michael1993'],
  ['rtlieb@yahoo.com', 'Morat2255'],
  ['davidseguin@live.ca', 'dseguin'],
  ['eryklepszy@protonmail.com', 'Chazoshtare'],
  ['sharkman.ru@gmail.com', 'sharkman'],
  ['drusekx@gmail.com', 'RDru'],
  ['asher.merrifield@gmail.com', 'HolyPedantic'],
  ['github@brightone.cloud', 'Br1ght0ne'],
  ['ebrown255@gmail.com', 'bobokapi'],
  ['lyle.sollayates@gmail.com', 'LyleSY'],
]);

function collapseDuplicatedName(name) {
  if (name.length % 2 !== 0) return name;
  const half = name.length / 2;
  const first = name.slice(0, half);
  const second = name.slice(half);
  return first.toLowerCase() === second.toLowerCase() ? first : name;
}

function cleanName(name) {
  const withoutCommand = String(name || '').replace(/\s*git config\b.*$/i, '').trim();
  const clean = collapseDuplicatedName(withoutCommand);
  return clean || '未知贡献者';
}

function knownLogin(name, email = '') {
  return KNOWN_LOGIN_BY_EMAIL.get(String(email).trim().toLowerCase())
    || KNOWN_LOGIN_BY_NAME.get(cleanName(name).toLowerCase())
    || null;
}

function isMergeCommitSubject(subject) {
  return /^merge(?:\s+pull\s+request\b|\s+branch\b|\s+remote-tracking\s+branch\b|\s+tag\b|\s*:)/i
    .test(String(subject || '').trim());
}

function compareContributorStats(a, b) {
  return b.commits - a.commits || a.user.name.localeCompare(b.user.name);
}

module.exports = {
  KNOWN_LOGIN_BY_NAME,
  cleanName,
  compareContributorStats,
  isMergeCommitSubject,
  knownLogin,
};
