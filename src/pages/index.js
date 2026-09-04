import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import HomepageCarousel from '@site/src/components/HomepageCarousel';
import styles from './index.module.css';

const COPY = {
  'zh-Hans': {
    eyebrow: '● CCB 生存网络 / 在线', title: <>大灾变：<br /><span>净化协议</span></>,
    lead: '在一个残酷、复杂又充满可能性的末日世界里活下去。游玩 CCB，或加入社区亲手塑造它。',
    play: '开始生存', download: '下载最新版 ↗', terminalLabel: 'CCB 项目状态', connected: '[正常] 净化协议已连接', waiting: '等待下一位幸存者',
    status: [['持续同步', 'CDDA 上游内容'], ['全平台', '桌面与 Android'], ['社区驱动', '代码、翻译与 MOD']],
    scroll: '向下访问档案', field: '实地记录', gallery: '来自末日现场', galleryDesc: '复杂的生存系统、自由的世界与不断生长的社区内容。',
    open: '开放协作', unfinished: '这个世界还没有写完', join: '修复一个问题、翻译一个词条、画一张贴图，或者制作属于你的 MOD。',
    contribute: '选择贡献路线', community: '先去社区看看 →', layoutTitle: '末日生存与社区开发',
    description: 'Cataclysm: Cleanwater Bomb 官方站：游戏下载、MOD、开发文档与社区入口。',
  },
  en: {
    eyebrow: '● CCB SURVIVAL NETWORK / ONLINE', title: <>Cataclysm:<br /><span>Cleanwater Protocol</span></>,
    lead: 'Survive a harsh, intricate apocalypse full of possibilities. Play CCB, or help the community shape it.',
    play: 'Start surviving', download: 'Download latest ↗', terminalLabel: 'CCB project status', connected: '[OK] Cleanwater protocol connected', waiting: 'Waiting for the next survivor',
    status: [['Continuous', 'CDDA upstream sync'], ['Cross-platform', 'Desktop and Android'], ['Community-led', 'Code, translation, and MODs']],
    scroll: 'Scroll to access archive', field: 'Field records', gallery: 'From the apocalypse', galleryDesc: 'Deep survival systems, an open world, and a growing body of community content.',
    open: 'Open collaboration', unfinished: 'This world is not finished', join: 'Fix an issue, translate a string, draw a tile, or create a MOD of your own.',
    contribute: 'Choose a contribution path', community: 'Visit the community →', layoutTitle: 'Apocalyptic survival and community development',
    description: 'The official Cataclysm: Cleanwater Bomb site for downloads, MODs, developer docs, and community links.',
  },
};

function HomepageHeader({copy}) {
  return (
    <header className={styles.hero}>
      <div className={styles.scanlines} aria-hidden="true" />
      <div className={`container ${styles.heroInner}`}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>{copy.eyebrow}</p>
          <Heading as="h1" className={styles.heroTitle}>
            {copy.title}
          </Heading>
          <p className={styles.heroLead}>
            {copy.lead}
          </p>
          <div className={styles.heroActions}>
            <Link className="button button--primary button--lg" to="/docs/newbie/intro">{copy.play}</Link>
            <Link className="button button--outline button--lg" href="https://github.com/CrimsonCrossBunker/Cataclysm-Cleanwater-Bomb/releases">{copy.download}</Link>
          </div>
        </div>
        <aside className={styles.terminal} aria-label={copy.terminalLabel}>
          <div className={styles.terminalBar}><span /><span /><span /><b>ccb://status</b></div>
          <div className={styles.terminalBody}>
            <p><i>$</i> protocol --inspect</p>
            <p className={styles.ok}>{copy.connected}</p>
            <dl>
              {copy.status.map(([value, label]) => (
                <div key={value}><dt>{value}</dt><dd>{label}</dd></div>
              ))}
            </dl>
            <p className={styles.cursor}>{copy.waiting}<span>_</span></p>
          </div>
        </aside>
      </div>
      <div className={styles.heroFoot}>
        <div className="container"><span>{copy.scroll}</span><i>↓</i></div>
      </div>
    </header>
  );
}

export default function Home() {
  const {i18n} = useDocusaurusContext();
  const copy = COPY[i18n.currentLocale] || COPY.en;
  return (
    <Layout title={copy.layoutTitle} description={copy.description}>
      <HomepageHeader copy={copy} />
      <main className={styles.main}>
        <HomepageFeatures />
        <section className={styles.gallerySection}>
          <div className="container">
            <div className={styles.sectionHead}>
              <div><span className={styles.kicker}>FIELD RECORDS / {copy.field}</span><Heading as="h2">{copy.gallery}</Heading></div>
              <p>{copy.galleryDesc}</p>
            </div>
          </div>
          <HomepageCarousel />
        </section>
        <section className={styles.join}>
          <div className={`container ${styles.joinInner}`}>
            <div><span className={styles.kicker}>OPEN SOURCE / {copy.open}</span><Heading as="h2">{copy.unfinished}</Heading><p>{copy.join}</p></div>
            <div className={styles.joinActions}><Link className="button button--primary button--lg" to="/docs/contribute/intro">{copy.contribute}</Link><Link to="/community">{copy.community}</Link></div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
