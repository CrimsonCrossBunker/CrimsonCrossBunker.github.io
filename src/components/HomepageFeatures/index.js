import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const PATHS = [
  {code: '01', label: 'PLAY', title: '新人教程', desc: '从下载、设置到第一天和第一周，建立一套可靠的生存节奏。', to: '/docs/newbie/intro', meta: '零基础 · 玩家'},
  {code: '02', label: 'BUILD', title: '开发者教程', desc: '搭建环境、编译 CCB、验证修改，并通过规范流程提交代码。', to: '/docs/dev/intro', meta: '进阶 · 开发'},
  {code: '03', label: 'MOD', title: 'MOD 制作', desc: '用 JSON 创建第一个模组，加入物品、配方和更多游戏内容。', to: '/docs/mod/intro', meta: '入门 · 创作'},
  {code: '04', label: 'LOCALIZE', title: '翻译贡献', desc: '无需编程即可参与；也包含字符串标记、提取和本地验证。', to: '/docs/contribute/translation', meta: '零基础 · 语言'},
  {code: '05', label: 'PIXEL', title: '贴图贡献', desc: '认领缺失 ID，画像素图，并通过工作表与工具完成归置。', to: '/docs/contribute/tileset', meta: '入门 · 美术'},
];

export default function HomepageFeatures() {
  return (
    <section className={styles.paths}>
      <div className="container">
        <header className={styles.head}>
          <div><span>ACCESS ROUTES / 访问路径</span><Heading as="h2">你今天想做什么？</Heading></div>
          <p>每条路线都从必要背景开始，以一个可以亲手验证的结果结束。</p>
        </header>
        <div className={styles.grid}>
          {PATHS.map((path) => (
            <Link key={path.code} to={path.to} className={styles.card}>
              <div className={styles.cardTop}><span>{path.code}</span><i>{path.label}</i></div>
              <Heading as="h3">{path.title}</Heading>
              <p>{path.desc}</p>
              <div className={styles.cardFoot}><small>{path.meta}</small><b aria-hidden="true">↗</b></div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
