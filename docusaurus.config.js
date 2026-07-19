// @ts-check
// Docusaurus 配置 - Cataclysm: Cleanwater Bomb (CCB) 站点
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Cataclysm: Cleanwater Bomb',
  tagline: '在末日中活下去，也亲手塑造它',
  favicon: 'img/favicon.ico',

  // Mermaid 流程图支持
  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },
  themes: ['@docusaurus/theme-mermaid'],

  plugins: [
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        language: ['zh'],
        indexBlog: true,
        indexPages: true,
        docsRouteBasePath: '/docs',
      },
    ],
  ],

  future: {
    v4: true,
  },

  // 生产环境 URL（GitHub Pages）
  url: 'https://crimsoncrossbunker.github.io',
  // 组织站点地址：https://crimsoncrossbunker.github.io/
  baseUrl: '/',

  // GitHub Pages 部署配置
  organizationName: 'CrimsonCrossBunker', // GitHub 用户/组织名
  projectName: 'CrimsonCrossBunker.github.io', // 仓库名
  deploymentBranch: 'gh-pages',
  trailingSlash: false,

  onBrokenLinks: 'warn',

  // 国际化：简体中文为主，英文备选
  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans'],
    localeConfigs: {
      'zh-Hans': {label: '简体中文'},
    },
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          editUrl:
            'https://github.com/CrimsonCrossBunker/CrimsonCrossBunker.github.io/tree/main/',
        },
        blog: {
          showReadingTime: true,
          blogTitle: '工作状态',
          blogDescription: 'CCB 开发进展与上游同步日志',
          postsPerPage: 10,
          blogSidebarTitle: '近期更新',
          blogSidebarCount: 'ALL',
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          editUrl:
            'https://github.com/CrimsonCrossBunker/CrimsonCrossBunker.github.io/tree/main/',
          onInlineTags: 'warn',
          onInlineAuthors: 'ignore',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/docusaurus-social-card.jpg',
      colorMode: {
        defaultMode: 'dark',
        respectPrefersColorScheme: false,
      },
      navbar: {
        title: 'CCB',
        logo: {
          alt: 'CCB Logo',
          src: 'img/logo.png',
        },
        items: [
          {type: 'docSidebar', sidebarId: 'newbieSidebar', position: 'left', label: '开始游玩'},
          {
            type: 'docSidebar',
            sidebarId: 'devSidebar',
            position: 'left',
            label: '开发',
          },
          {
            type: 'docSidebar',
            sidebarId: 'modSidebar',
            position: 'left',
            label: '制作 MOD',
          },
          {
            type: 'docSidebar',
            sidebarId: 'contributeSidebar',
            position: 'left',
            label: '参与贡献',
          },
          {to: '/blog', label: '项目动态', position: 'left'},
          {to: '/community', label: '社区', position: 'left'},
          {
            href: 'https://crimsoncrossbunker.github.io/CCB-GUIDE/?lang=zh_CN',
            label: '游戏指南 ↗',
            position: 'right',
          },
          {
            href: 'https://github.com/CrimsonCrossBunker/Cataclysm-Cleanwater-Bomb',
            label: 'GitHub ↗',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: '生存终端',
            items: [
              {
                label: '新人教程',
                to: '/docs/newbie/intro',
              },
              {
                label: '开发者教程',
                to: '/docs/dev/intro',
              },
              {
                label: 'MOD 教程',
                to: '/docs/mod/intro',
              },
              {
                label: '贡献指南',
                to: '/docs/contribute/intro',
              },
            ],
          },
          {
            title: '社区',
            items: [
              {
                label: 'Discord',
                href: 'https://discord.gg/tUG9MFwCqf',
              },
              {
                label: 'Reddit',
                href: 'https://www.reddit.com/r/CataclysmCB/',
              },
              {
                label: 'Transifex 翻译团队',
                href: 'https://app.transifex.com/Cataclysm-Cleanwater-Bomb/cataclysm-cleanwater-bomb/dashboard/',
              },
              {
                label: 'QQ 群 / 加入我们',
                to: '/community',
              },
              {
                label: 'CDDA 官方',
                href: 'https://github.com/CleverRaven/Cataclysm-DDA',
              },
            ],
          },
          {
            title: '项目',
            items: [
              {
                label: '项目动态',
                to: '/blog',
              },
              {label: '开发路线', to: '/roadmap'},
              {
                label: 'CCB 仓库',
                href: 'https://github.com/CrimsonCrossBunker/Cataclysm-Cleanwater-Bomb',
              },
              {
                label: '游戏资料指南',
                href: 'https://crimsoncrossbunker.github.io/CCB-GUIDE/?lang=zh_CN',
              },
              {
                label: '指南源码',
                href: 'https://github.com/CrimsonCrossBunker/CCB-GUIDE',
              },
            ],
          },
        ],
        copyright: `© ${new Date().getFullYear()} Cataclysm: Cleanwater Bomb · 社区驱动的末日生存项目`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['json', 'bash', 'cpp'],
      },
    }),
};

export default config;
