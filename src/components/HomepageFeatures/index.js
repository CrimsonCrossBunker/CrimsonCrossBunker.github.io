import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const COPY = {
  'zh-Hans': {
    kicker: '访问路径', title: '你今天想做什么？', intro: '从游玩、安装 MOD 到开始创作，每条路线都给出下一步。',
    paths: [
      {code: '01', label: 'PLAY', title: '新人教程', desc: '从下载、设置到第一天和第一周，建立可靠的生存节奏。', to: '/docs/newbie/intro', meta: '零基础 · 玩家'},
      {code: '02', label: 'MODS', title: '寻找 MOD', desc: '查看维护方式、适配版本和验证状态，再通过 Catapult 安装。', to: '/mods', meta: '玩家 · 一键安装'},
      {code: '03', label: 'LUA', title: '制作 Lua MOD', desc: '使用当前 Lua Platform v1 创建、检查并登记外部 MOD。', to: '/docs/mod/intro', meta: '入门 · 创作'},
      {code: '04', label: 'BUILD', title: '开发 CCB', desc: '搭建环境、编译、验证修改，并通过规范流程提交代码。', to: '/docs/dev/intro', meta: '进阶 · 开发'},
      {code: '05', label: 'LOCALIZE', title: '翻译贡献', desc: '无需编程即可参与，也包含字符串标记、提取和本地验证。', to: '/docs/contribute/translation', meta: '零基础 · 语言'},
      {code: '06', label: 'GUIDE', title: '游戏数据百科', desc: '搜索 CCB 的物品、怪物、配方和地形数据。', to: 'https://crimsoncrossbunker.github.io/CCB-GUIDE/', meta: '在线 · 玩家工具'},
    ],
  },
  en: {
    kicker: 'Access routes', title: 'What do you want to do?', intro: 'Each route gives you a clear next step, from playing and installing MODs to creating one.',
    paths: [
      {code: '01', label: 'PLAY', title: 'New player guide', desc: 'Download, configure, and establish a reliable rhythm for your first days.', to: '/docs/newbie/intro', meta: 'Beginner · Player'},
      {code: '02', label: 'MODS', title: 'Find MODs', desc: 'Check ownership, compatible versions, and validation status, then install with Catapult.', to: '/mods', meta: 'Player · Easy install'},
      {code: '03', label: 'LUA', title: 'Create a Lua MOD', desc: 'Use Lua Platform v1 to create, check, and register an external MOD.', to: '/docs/mod/intro', meta: 'Beginner · Creator'},
      {code: '04', label: 'BUILD', title: 'Develop CCB', desc: 'Set up, build, validate changes, and contribute through the project workflow.', to: '/docs/dev/intro', meta: 'Advanced · Developer'},
      {code: '05', label: 'LOCALIZE', title: 'Translate', desc: 'Contribute without programming, or work on extraction and local validation.', to: '/docs/contribute/translation', meta: 'Beginner · Language'},
      {code: '06', label: 'GUIDE', title: 'Game data guide', desc: 'Search CCB items, monsters, recipes, terrain, and other game data.', to: 'https://crimsoncrossbunker.github.io/CCB-GUIDE/', meta: 'Online · Player tool'},
    ],
  },
};

export default function HomepageFeatures() {
  const {i18n} = useDocusaurusContext();
  const copy = COPY[i18n.currentLocale] || COPY.en;
  return (
    <section className={styles.paths}>
      <div className="container">
        <header className={styles.head}>
          <div><span>ACCESS ROUTES / {copy.kicker}</span><Heading as="h2">{copy.title}</Heading></div>
          <p>{copy.intro}</p>
        </header>
        <div className={styles.grid}>
          {copy.paths.map((path) => (
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
