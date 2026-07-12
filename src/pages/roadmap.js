import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import PageHero from '@site/src/components/PageHero';
import styles from './roadmap.module.css';

const WORK = [
  {id: '01', title: '上游同步与稳定性', state: '持续', desc: '选择性同步 CDDA 改动，修复冲突、崩溃与跨平台回归。'},
  {id: '02', title: '性能与渲染', state: '高优先', desc: '定位卡顿根因，改进 SDL3 渲染、加载与大型存档体验。'},
  {id: '03', title: 'NPC 与战斗体验', state: '高优先', desc: '提升指挥、路径、战斗决策、射击反馈与系统可控性。'},
  {id: '04', title: '内容与 MOD 兼容', state: '进行中', desc: '扩展特色玩法，同时维护社区常用 MOD 与数据兼容。'},
  {id: '05', title: '翻译与贴图供给', state: '进行中', desc: '降低认领、校验和归置门槛，让非代码贡献可以持续进入项目。'},
  {id: '06', title: '文档与社区', state: '持续', desc: '维护教程、工作动态和协作入口，让新人能独立走完第一条贡献路径。'},
];

const LANES = [
  ['CODE', '开发线', 'Issue → 分支 → 构建与测试 → PR'],
  ['MOD', '内容线', '最小 MOD → 游戏验证 → 兼容与发布'],
  ['PIX', '贴图线', '缺失 ID → 认领绘制 → 校验归置'],
  ['L10N', '翻译线', '词条上下文 → 翻译校对 → 构建同步'],
];

export default function Roadmap() {
  return <Layout title="开发路线" description="CCB 当前维护方向与社区贡献路径。"><PageHero eyebrow="PROJECT VECTOR / 开发路线" title="让每一步都可验证" description="路线图表达长期方向，不承诺固定发布日期。具体进展以项目动态、Issue 与合并记录为准。"><Link className="button button--primary button--lg" to="/blog">查看项目动态</Link></PageHero><main className={`container ${styles.main}`}><section><div className={styles.heading}><span>ACTIVE OBJECTIVES</span><Heading as="h2">当前方向</Heading></div><div className={styles.grid}>{WORK.map((item) => <article key={item.id} className={styles.card}><header><b>{item.id}</b><span>{item.state}</span></header><Heading as="h3">{item.title}</Heading><p>{item.desc}</p></article>)}</div></section><section><div className={styles.heading}><span>CONTRIBUTION LANES</span><Heading as="h2">贡献流水线</Heading></div><div className={styles.lanes}>{LANES.map(([code,title,flow]) => <div key={code}><b>{code}</b><Heading as="h3">{title}</Heading><p>{flow}</p></div>)}</div></section><aside className={styles.cta}><div><span>READY FOR INPUT</span><Heading as="h2">从一个小任务开始</Heading><p>路线图不是任务分配表。开始较大工作前，请先到社区或 Issue 确认范围。</p></div><Link className="button button--outline button--lg" to="/docs/contribute/intro">选择贡献路线</Link></aside></main></Layout>;
}
