import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));

const site = {
  name: 'zorro 的技术博客',
  author: 'zorro',
  description: '记录工程实践、排错过程和持续学习。',
  origin: 'https://yinghanpeng.github.io'
};

const posts = [
  {
    title: '测试文章',
    url: '/2026/06/27/test-post/',
    date: '2026-06-27',
    datetime: '2026-06-27T21:13:32+08:00',
    updated: '2026-06-27',
    updatedDatetime: '2026-06-27T21:13:32+08:00',
    summary: '这是一篇用于测试 GitHub Pages 发布流程的文章。适合作为新设计的首篇测试内容。',
    tags: ['发布测试', 'GitHub Pages'],
    minutes: 2,
    contentHtml: `
      <h2 id="publish-validation">发布验证</h2>
      <p>这是一篇用于测试 GitHub Pages 发布流程的文章。新设计会保留静态站的简单可靠，同时把首页、归档、搜索和文章页做得更清楚。</p>
      <p>如果你能在首页、归档页和搜索里看到它，就说明静态文件发布链路是通的。发布成功后可以删除这篇文章，或把它替换成正式内容。</p>

      <h2 id="writing-flow">写作流程</h2>
      <p>后续新增正式文章时，只需要把文章数据补进生成脚本，再运行一次渲染命令。首页、归档、搜索索引和文章页都会同步更新，避免手工维护多个 HTML 块。</p>
      <pre><code>post:
  title: 测试文章
  date: 2026-06-27
  tags:
    - GitHub Pages
    - 发布测试</code></pre>

      <h2 id="next-step">下一步</h2>
      <p>这篇文章现在可以继续作为发布测试保留；等正式内容准备好后，也可以把它替换成第一篇真正的技术记录。</p>
    `
  },
  {
    title: '123',
    url: '/2021/02/13/newpapername/',
    date: '2021-02-13',
    datetime: '2021-02-13T17:14:45+08:00',
    updated: '2023-07-07',
    updatedDatetime: '2023-07-07T17:59:55+08:00',
    summary: '旧文章占位内容。重设计后它仍然保留，并出现在首页、归档和搜索里。',
    tags: ['旧文', '随笔'],
    minutes: 1,
    contentHtml: '<p>123232</p>'
  }
];

posts.sort((a, b) => b.date.localeCompare(a.date));

const years = [...new Set(posts.map((post) => post.date.slice(0, 4)))];
const months = [...new Set(posts.map((post) => post.date.slice(0, 7)))];

const routes = [
  {
    file: 'index.html',
    route: 'home',
    title: site.name,
    description: site.description,
    canonical: '/'
  },
  {
    file: 'archives/index.html',
    route: 'archive',
    title: `归档 | ${site.name}`,
    description: `目前共计 ${posts.length} 篇文章。`,
    canonical: '/archives/'
  },
  ...years.map((year) => ({
    file: `archives/${year}/index.html`,
    route: 'archive',
    archiveYear: year,
    title: `${year} 年归档 | ${site.name}`,
    description: `${year} 年的文章归档。`,
    canonical: `/archives/${year}/`
  })),
  ...months.map((yearMonth) => {
    const [year, month] = yearMonth.split('-');
    return {
      file: `archives/${year}/${month}/index.html`,
      route: 'archive',
      archiveYear: year,
      archiveMonth: month,
      title: `${year} 年 ${month} 月归档 | ${site.name}`,
      description: `${year} 年 ${month} 月的文章归档。`,
      canonical: `/archives/${year}/${month}/`
    };
  }),
  ...posts.map((post) => ({
    file: `${post.url.replace(/^\/|\/$/g, '')}/index.html`,
    route: 'post',
    postUrl: post.url,
    title: `${post.title} | ${site.name}`,
    description: post.summary,
    canonical: post.url
  }))
];

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function escapeAttr(value) {
  return escapeHtml(value).replaceAll("'", '&#39;');
}

function escapeCdata(value) {
  return String(value).replaceAll(']]>', ']]]]><![CDATA[>');
}

function routeAttrs(route) {
  const attrs = [
    `data-route="${escapeAttr(route.route)}"`,
    route.postUrl ? `data-post-url="${escapeAttr(route.postUrl)}"` : '',
    route.archiveYear ? `data-archive-year="${escapeAttr(route.archiveYear)}"` : '',
    route.archiveMonth ? `data-archive-month="${escapeAttr(route.archiveMonth)}"` : ''
  ].filter(Boolean);
  return attrs.join(' ');
}

function pageTemplate(route) {
  const canonical = `${site.origin}${route.canonical}`;
  return `<!doctype html>
<html lang="zh-CN" class="theme-dark">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#111412">
  <meta name="description" content="${escapeAttr(route.description)}">
  <meta property="og:type" content="${route.route === 'post' ? 'article' : 'website'}">
  <meta property="og:title" content="${escapeAttr(route.title)}">
  <meta property="og:description" content="${escapeAttr(route.description)}">
  <meta property="og:url" content="${escapeAttr(canonical)}">
  <meta property="og:site_name" content="${escapeAttr(site.name)}">
  <meta property="og:locale" content="zh_CN">
  <meta name="twitter:card" content="summary">
  <link rel="canonical" href="${escapeAttr(canonical)}">
  <link rel="apple-touch-icon" sizes="180x180" href="/images/apple-touch-icon-next.png">
  <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32-next.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon-16x16-next.png">
  <link rel="stylesheet" href="/css/redesign.css">
  <script src="/js/redesign-data.js" defer></script>
  <script src="/js/redesign.js" defer></script>
  <title>${escapeHtml(route.title)}</title>
</head>
<body ${routeAttrs(route)}>
  <div id="reading-progress" class="reading-progress"></div>
  <div id="app" class="app-shell">
    <main class="loading-panel">
      <p>正在加载博客内容...</p>
      <noscript>
        <p>浏览器需要启用 JavaScript 才能使用新版归档和搜索。</p>
      </noscript>
    </main>
  </div>
</body>
</html>
`;
}

async function writeRootFile(relativePath, content) {
  const target = join(root, relativePath);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, content, 'utf8');
}

const data = {
  site,
  posts: posts.map((post) => ({
    title: post.title,
    url: post.url,
    date: post.date,
    datetime: post.datetime,
    updated: post.updated,
    updatedDatetime: post.updatedDatetime,
    summary: post.summary,
    tags: post.tags,
    minutes: post.minutes,
    contentHtml: post.contentHtml.trim()
  }))
};

await writeRootFile('js/redesign-data.js', `window.BLOG_DATA = ${JSON.stringify(data, null, 2)};\n`);

for (const route of routes) {
  await writeRootFile(route.file, pageTemplate(route));
}

const searchXml = `<?xml version="1.0" encoding="utf-8"?>
<search>
${posts.map((post) => `  <entry>
    <title>${escapeHtml(post.title)}</title>
    <url>${escapeHtml(post.url)}</url>
    <content><![CDATA[${escapeCdata(post.contentHtml.trim())}
]]></content>
  </entry>`).join('\n')}
</search>
`;

await writeRootFile('search.xml', searchXml);

console.log(`Rendered ${routes.length} pages from ${posts.length} posts.`);
