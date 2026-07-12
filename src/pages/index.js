import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import HomepageCarousel from '@site/src/components/HomepageCarousel';
import styles from './index.module.css';

const STATUS = [
  ['持续同步', 'CDDA 上游内容'],
  ['全平台', '桌面与 Android'],
  ['社区驱动', '代码、翻译与贴图'],
];

function HomepageHeader() {
  return (
    <header className={styles.hero}>
      <div className={styles.scanlines} aria-hidden="true" />
      <div className={`container ${styles.heroInner}`}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}><span>●</span> CCB SURVIVAL NETWORK / ONLINE</p>
          <Heading as="h1" className={styles.heroTitle}>
            大灾变：<br /><span>净化协议</span>
          </Heading>
          <p className={styles.heroLead}>
            在一个残酷、复杂又充满可能性的末日世界里活下去。游玩 CCB，或加入社区亲手塑造它。
          </p>
          <div className={styles.heroActions}>
            <Link className="button button--primary button--lg" to="/docs/newbie/intro">开始生存</Link>
            <Link className="button button--outline button--lg" href="https://github.com/LYHGLYTX/Cataclysm-Cleanwater-Bomb/releases">下载最新版 ↗</Link>
          </div>
        </div>
        <aside className={styles.terminal} aria-label="CCB 项目状态">
          <div className={styles.terminalBar}><span /><span /><span /><b>ccb://status</b></div>
          <div className={styles.terminalBody}>
            <p><i>$</i> protocol --inspect</p>
            <p className={styles.ok}>[OK] 净化协议已连接</p>
            <dl>
              {STATUS.map(([value, label]) => (
                <div key={value}><dt>{value}</dt><dd>{label}</dd></div>
              ))}
            </dl>
            <p className={styles.cursor}>等待下一位幸存者<span>_</span></p>
          </div>
        </aside>
      </div>
      <div className={styles.heroFoot}>
        <div className="container"><span>SCROLL TO ACCESS ARCHIVE</span><i>↓</i></div>
      </div>
    </header>
  );
}

export default function Home() {
  return (
    <Layout title="末日生存与社区开发" description="Cataclysm: Cleanwater Bomb 官方中文站：新人、开发、MOD、翻译与贴图教程。">
      <HomepageHeader />
      <main className={styles.main}>
        <HomepageFeatures />
        <section className={styles.gallerySection}>
          <div className="container">
            <div className={styles.sectionHead}>
              <div><span className={styles.kicker}>FIELD RECORDS / 实地记录</span><Heading as="h2">来自末日现场</Heading></div>
              <p>复杂的生存系统、自由的世界与不断生长的社区内容。</p>
            </div>
          </div>
          <HomepageCarousel />
        </section>
        <section className={styles.join}>
          <div className={`container ${styles.joinInner}`}>
            <div><span className={styles.kicker}>OPEN SOURCE / 开放协作</span><Heading as="h2">这个世界还没有写完</Heading><p>修复一个问题、翻译一个词条、画一张贴图，或者制作属于你的 MOD。</p></div>
            <div className={styles.joinActions}><Link className="button button--primary button--lg" to="/docs/contribute/intro">选择贡献路线</Link><Link to="/community">先去社区看看 →</Link></div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
