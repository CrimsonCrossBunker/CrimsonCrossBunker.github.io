// @ts-check
// 侧边栏配置：新人教程 + 开发者教程 两个独立侧栏
// See: https://docusaurus.io/docs/sidebar

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // 新人教程侧栏
  newbieSidebar: [
    {
      type: 'category',
      label: '新人教程',
      collapsed: false,
      items: [
        'newbie/intro',
        'newbie/getting-started',
        'newbie/controls',
        'newbie/first-day',
        'newbie/first-week',
      ],
    },
  ],

  // 开发者教程侧栏
  devSidebar: [
    {
      type: 'category',
      label: '开发者教程',
      collapsed: false,
      items: [
        'dev/intro',
        'dev/environment',
        'dev/build',
        'dev/macos-sdl2',
        'dev/testing',
        'dev/contributing',
      ],
    },
  ],

  modSidebar: [
    {
      type: 'category',
      label: 'MOD 制作教程',
      collapsed: false,
      items: [
        'mod/intro',
        'mod/first-mod',
        'mod/content',
        'mod/test-and-publish',
      ],
    },
  ],

  // 贡献指南侧栏
  contributeSidebar: [
    {
      type: 'category',
      label: '贡献指南',
      collapsed: false,
      items: [
        'contribute/intro',
        'contribute/code',
        'contribute/tileset',
        'contribute/translation',
      ],
    },
  ],

  // 开发路线侧栏
  roadmapSidebar: [
    {
      type: 'category',
      label: '开发路线',
      collapsed: false,
      items: [
        'roadmap/vision',
        'roadmap/status',
      ],
    },
  ],
};

export default sidebars;
