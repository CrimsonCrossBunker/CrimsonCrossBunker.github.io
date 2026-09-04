import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './mods.module.css';
const COPY = {
  'zh-Hans': {
    title: 'CCB MOD 中心', description: '查找、安装、制作和登记 CCB MOD。', eyebrow: 'CCB / MOD',
    heading: '玩家和作者，从这里开始', intro: '第一版只做一条能走通的流程：Catapult 读取官方目录，玩家查看兼容信息后安装；作者通过 PR 登记。复杂问题由维护者人工处理。',
    install: '下载 Catapult', browse: '浏览 MOD 目录',
    player: '我是玩家', playerSteps: ['下载 Catapult v1.1.0-ccb 或更新版本，在“实验版 / 候选版”中选择 0.Ag-Candidate-2026-09-05-0219。', '打开 MOD 页面，查看维护方式、适配版本和验证状态，安装 CCB Lua 欢迎示例。', '创建新世界并启用该 MOD；进入世界后，消息记录应出现“来自 CCB-MOD 的问候”。其他 MOD 出错时使用详情页里的反馈地址。'],
    author: '我是 MOD 作者', authorSteps: ['用 Lua Platform v1 编写行为；静态、可校验的数据可以继续使用 JSON。', '在自己的仓库发布 ZIP，或申请由 CCB-MOD 维护源码。', '复制注册模板、填写版本和维护信息，然后提交 PR。'],
    docs: 'Lua Platform v1 文档', register: '登记民间 MOD', maintained: 'CCB 维护', maintainedText: '源码在 CCB-MOD，由核心成员或指定维护者修复和适配。',
    community: '社区维护', communityText: '源码在作者仓库，CCB 目录只展示作者声明与验证结果。',
    status: '首版状态', statusText: '首版使用 Candidate 和 Lua API 1。Linux 已验证示例加载、新世界运行以及启动器安装、更新和卸载；其他平台的游戏内验收仍需维护者确认。注册信息合并后由维护者人工部署。',
  },
  en: {
    title: 'CCB MOD hub', description: 'Find, install, create, and register CCB MODs.', eyebrow: 'CCB / MOD',
    heading: 'One starting point for players and authors', intro: 'Version one keeps a single working path: Catapult reads the public catalog, players check compatibility before installing, and authors register through a pull request. Maintainers handle unusual cases manually.',
    install: 'Download Catapult', browse: 'Browse the MOD catalog',
    player: 'I am a player', playerSteps: ['Download Catapult v1.1.0-ccb or newer. Select 0.Ag-Candidate-2026-09-05-0219 under Experimental / Candidate.', 'Open the MOD page, check ownership, supported versions and validation, then install CCB Lua Welcome Example.', 'Create a new world with the MOD enabled. Message history should show “Hello from CCB-MOD”. For other MOD problems, use the issue link in their details.'],
    author: 'I am a MOD author', authorSteps: ['Write behaviour with Lua Platform v1. Passive, schema-validatable data may remain JSON.', 'Publish a ZIP from your own repository, or ask CCB-MOD to maintain the source.', 'Copy the registration template, fill in versions and maintainers, then open a pull request.'],
    docs: 'Lua Platform v1 docs', register: 'Register a community MOD', maintained: 'CCB maintained', maintainedText: 'Source lives in CCB-MOD and is adapted by core or assigned maintainers.',
    community: 'Community maintained', communityText: "Source stays in the author's repository; the CCB catalog shows the author's claim and validation result.",
    status: 'Version-one status', statusText: 'The first version uses a Candidate and Lua API 1. Linux checks cover example loading, a new world, and launcher installation, update and uninstall. In-game verification on other platforms remains pending. Maintainers deploy merged catalog changes manually.',
  },
};

const CATALOG = 'https://crimsoncrossbunker.github.io/CCB-MOD/';
const CATAPULT = 'https://github.com/CrimsonCrossBunker/Catapult/releases/latest';
const DOCS = 'https://crimsoncrossbunker.github.io/CCB-Docs/api/lua/v1/overview/';
const REGISTER = 'https://github.com/CrimsonCrossBunker/CCB-MOD/blob/main/docs/register.en.md';

function Steps({items}) {
  return <ol>{items.map((item) => <li key={item}>{item}</li>)}</ol>;
}

export default function Mods() {
  const {i18n} = useDocusaurusContext();
  const copy = COPY[i18n.currentLocale] || COPY.en;
  const registrationUrl = i18n.currentLocale === 'zh-Hans' ? REGISTER.replace('register.en', 'register.zh-Hans') : REGISTER;
  const docsUrl = i18n.currentLocale === 'zh-Hans' ? DOCS : DOCS.replace('/CCB-Docs/', '/CCB-Docs/en/');
  return (
    <Layout title={copy.title} description={copy.description}>
      <main className={`container ${styles.main}`}>
        <section className={styles.hero}>
          <p>{copy.eyebrow}</p>
          <Heading as="h1">{copy.heading}</Heading>
          <div className={styles.heroGrid}>
            <p>{copy.intro}</p>
            <div className={styles.actions}>
              <Link className="button button--primary button--lg" href={CATAPULT}>{copy.install}</Link>
              <Link className="button button--outline button--lg" href={CATALOG}>{copy.browse}</Link>
            </div>
          </div>
        </section>
        <section className={styles.paths}>
          <article><span>PLAYER</span><Heading as="h2">{copy.player}</Heading><Steps items={copy.playerSteps} /></article>
          <article><span>AUTHOR</span><Heading as="h2">{copy.author}</Heading><Steps items={copy.authorSteps} /><div className={styles.links}><a href={docsUrl}>{copy.docs} ↗</a><a href={registrationUrl}>{copy.register} ↗</a></div></article>
        </section>
        <section className={styles.types}>
          <article><b>01</b><div><Heading as="h3">{copy.maintained}</Heading><p>{copy.maintainedText}</p></div></article>
          <article><b>02</b><div><Heading as="h3">{copy.community}</Heading><p>{copy.communityText}</p></div></article>
        </section>
        <aside className={styles.note}><b>{copy.status}</b><p>{copy.statusText}</p></aside>
      </main>
    </Layout>
  );
}
