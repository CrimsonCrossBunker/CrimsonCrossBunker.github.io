import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import PageHero from '@site/src/components/PageHero';
import styles from './community.module.css';

const ONLINE = [
  {code: 'DIS', name: 'Discord', desc: '开发讨论、玩家交流与国际社区', href: 'https://discord.gg/tUG9MFwCqf'},
  {code: 'RDT', name: 'Reddit', desc: '分享存档、反馈与长篇讨论', href: 'https://www.reddit.com/r/CataclysmCB/'},
  {code: 'TX', name: 'Transifex', desc: 'CCB 官方翻译团队、在线翻译与校对', href: 'https://app.transifex.com/Cataclysm-Cleanwater-Bomb/cataclysm-cleanwater-bomb/dashboard/'},
  {code: 'GIT', name: 'GitHub', desc: 'Issue、代码审查与版本发布', href: 'https://github.com/CrimsonCrossBunker/Cataclysm-Cleanwater-Bomb'},
];

const GROUPS = [
  {name: '玩家交流群', number: '552610319', img: 'img/qq/jiaoliu.jpg', desc: '游玩提问、反馈和日常交流'},
  {name: '开发贡献群', number: '252513599', img: 'img/qq/dev.jpg', desc: '代码、MOD 与项目协作'},
  {name: '贴图贡献群', number: '694984594', img: 'img/qq/tileset.jpg', desc: 'CCB 不死人贴图绘制与归置'},
  {name: '翻译贡献群', number: '316558115', img: 'img/qq/qrcode.jpg', desc: '词条翻译、术语和校对'},
];

function GroupCard({group}) {
  return <article className={styles.groupCard}><img src={useBaseUrl(group.img)} alt={`${group.name}二维码`} loading="lazy" /><div><span>QQ / {group.number}</span><Heading as="h3">{group.name}</Heading><p>{group.desc}</p></div></article>;
}

export default function Community() {
  return (
    <Layout title="社区" description="加入 CCB 玩家、开发、翻译和贴图社区。">
      <PageHero eyebrow="COMMUNICATION NODE / 社区节点" title="末日不是单人项目" description="提问时带上版本、平台、完整报错与复现步骤；贡献前说清目标和范围。这样更容易得到有效回应。">
        <Link className="button button--primary button--lg" to="/docs/contribute/intro">查看贡献路线</Link>
      </PageHero>
      <main className={`container ${styles.main}`}>
        <section><div className={styles.sectionHead}><span>PUBLIC CHANNELS</span><Heading as="h2">公共频道</Heading></div><div className={styles.onlineGrid}>{ONLINE.map((item) => <a key={item.name} href={item.href} className={styles.onlineCard}><b>{item.code}</b><div><Heading as="h3">{item.name}</Heading><p>{item.desc}</p></div><i>↗</i></a>)}</div></section>
        <section><div className={styles.sectionHead}><span>QQ GROUPS</span><Heading as="h2">中文协作群</Heading></div><div className={styles.groupGrid}>{GROUPS.map((group) => <GroupCard key={group.number} group={group} />)}</div></section>
        <aside className={styles.note}><b>REPORT PROTOCOL</b><p>Bug 反馈请附版本号、系统、存档或最小复现；开发问题请附构建命令和第一条有效错误。翻译与校对请进入 CCB Transifex 项目。二维码失效时可使用群号搜索。</p></aside>
      </main>
    </Layout>
  );
}
