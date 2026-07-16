import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));

function renderMarkdown(file) {
  return execFileSync(
    'python3',
    [join(root, 'tools/render-markdown.py'), join(root, file)],
    { encoding: 'utf8' }
  );
}

const site = {
  name: 'zorro 的技术博客',
  author: 'zorro',
  description: '记录工程实践、排错过程和持续学习。',
  origin: 'https://yinghanpeng.github.io'
};

const postDefinitions = JSON.parse(await readFile(join(root, 'content/posts.json'), 'utf8'));
const posts = postDefinitions.map((post) => ({
  ...post,
  contentHtml: post.contentFormat === 'markdown'
    ? renderMarkdown(post.contentFile)
    : post.contentHtml
}));

posts.sort((a, b) => b.date.localeCompare(a.date));

const years = [...new Set(posts.map((post) => post.date.slice(0, 4)))];
const months = [...new Set(posts.map((post) => post.date.slice(0, 7)))];
const assetSources = await Promise.all([
  readFile(join(root, 'css/redesign.css'), 'utf8'),
  readFile(join(root, 'js/redesign.js'), 'utf8')
]);
const assetVersion = [
  posts
    .map((post) => [post.url, post.date, post.updated, post.title].join('|'))
    .join('||'),
  ...assetSources
]
  .join('||')
  .split('')
  .reduce((hash, char) => ((hash * 33) + char.charCodeAt(0)) >>> 0, 5381)
  .toString(36);

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
  <link rel="stylesheet" href="/css/redesign.css?v=${assetVersion}">
  <script src="/js/redesign-data.js?v=${assetVersion}" defer></script>
  <script src="/js/redesign.js?v=${assetVersion}" defer></script>
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
    <content><![CDATA[${escapeCdata(post.contentHtml.trim()).replace(/[ \t]+$/gm, '')}
]]></content>
  </entry>`).join('\n')}
</search>
`;

await writeRootFile('search.xml', searchXml);

console.log(`Rendered ${routes.length} pages from ${posts.length} posts.`);
