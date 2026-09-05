import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './mods.module.css';
const COPY = {
  'zh-Hans': {
    title: 'CCB MOD 中心', description: '查找、安装、制作和登记 CCB MOD。', eyebrow: 'CCB / MOD',
    heading: '玩家和作者，从这里开始', intro: 'Catapult 读取同一份 MOD 目录，玩家按 CCB 维护或民间维护查找并安装；作者可以在网页填写申请，也可以提交 PR。审核与特殊问题由维护者人工处理。',
    install: '下载 Catapult', browse: '浏览 MOD 目录',
    player: '我是玩家', playerSteps: ['下载 Catapult v1.2.0-ccb 或更新版本，在“实验版 / 候选版”中选择 0.Ag-Candidate-2026-09-05-0219。', '打开 MOD 标签，按 CCB 维护或民间维护筛选。查看适配信息后，可安装欢迎示例、废料多用工具、野外观察手册和口袋提醒器。', '在游戏里创建新世界并启用选中的 MOD；安装不等于启用。按目录中的“怎么玩”检查物品与交互，先用测试存档。'],
    author: '我是 MOD 作者', authorSteps: ['用 Lua Platform v1 编写行为；静态、可校验的数据可以继续使用 JSON。', '在自己的仓库发布单个 MOD 的固定版本 ZIP，或申请由 CCB-MOD 维护源码。', '打开申请收录页面，填写信息并生成 GitHub 申请草稿；补充测试记录后提交，等待人工审核。熟悉 Git 的作者也可以直接提交 PR。'],
    docs: 'Lua Platform v1 文档', register: '登记民间 MOD', maintained: 'CCB 维护', maintainedText: '源码在 CCB-MOD，由核心成员或指定维护者修复和适配。',
    community: '民间维护', communityText: '源码在作者仓库，CCB 目录只展示登记信息与验证结果，不接管维护。',
    status: '首版状态', statusText: '首版使用 Candidate 和 Lua API 1。Linux 已验证示例加载、新世界运行以及启动器安装、更新和卸载；其他平台的游戏内验收仍需维护者确认。注册信息合并后由维护者人工部署。',
  },
  en: {
    title: 'CCB MOD hub', description: 'Find, install, create, and register CCB MODs.', eyebrow: 'CCB / MOD',
    heading: 'One starting point for players and authors', intro: 'Catapult reads the shared MOD catalog. Players browse CCB-maintained or community MODs; authors can apply with the web form or a pull request. Maintainers review submissions and handle unusual cases manually.',
    install: 'Download Catapult', browse: 'Browse the MOD catalog',
    player: 'I am a player', playerSteps: ['Download Catapult v1.2.0-ccb or newer. Select 0.Ag-Candidate-2026-09-05-0219 under Experimental / Candidate.', 'Open the MOD tab, filter CCB maintained or Community, and check compatibility. Try the welcome example, Scrap Multitool, Field Journal and Pocket Reminder.', 'Create a new game world and enable your installed MODs. Installed does not mean enabled. Follow the catalog’s How to play instructions, using a test save first.'],
    author: 'I am a MOD author', authorSteps: ['Write behaviour with Lua Platform v1. Passive, schema-validatable data may remain JSON.', 'Publish a fixed-version ZIP containing one MOD, or ask CCB-MOD to maintain the source.', 'Fill in the submission form, open the GitHub application draft, add test evidence and submit for manual review. You can also submit a PR directly.'],
    docs: 'Lua Platform v1 docs', register: 'Register a community MOD', maintained: 'CCB maintained', maintainedText: 'Source lives in CCB-MOD and is adapted by core or assigned maintainers.',
    community: 'Community maintained', communityText: "Source stays in the author's repository; the CCB catalog shows the author's claim and validation result.",
    status: 'Version-one status', statusText: 'The first version uses a Candidate and Lua API 1. Linux checks cover example loading, a new world, and launcher installation, update and uninstall. In-game verification on other platforms remains pending. Maintainers deploy merged catalog changes manually.',
  },
};

const CATALOG = 'https://crimsoncrossbunker.github.io/CCB-MOD/';
const CATAPULT = 'https://github.com/CrimsonCrossBunker/Catapult/releases/latest';
const DOCS = 'https://crimsoncrossbunker.github.io/CCB-Docs/api/lua/v1/overview/';
const REGISTER = 'https://crimsoncrossbunker.github.io/CCB-MOD/submit.html';

function Steps({items}) {
  return <ol>{items.map((item) => <li key={item}>{item}</li>)}</ol>;
}

export default function Mods() {
  const {i18n} = useDocusaurusContext();
  const copy = COPY[i18n.currentLocale] || COPY.en;
  const registrationUrl = REGISTER + '?lang=' + (i18n.currentLocale === 'zh-Hans' ? 'zh-Hans' : 'en');
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
