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
    title: '转载阅读：去哪儿网 AI Coding 研发平台实践',
    url: '/2026/06/27/qunar-ai-coding-platform-reading/',
    date: '2026-06-27',
    datetime: '2026-06-27T22:55:00+08:00',
    updated: '2026-06-27',
    updatedDatetime: '2026-06-27T22:55:00+08:00',
    summary: '阅读公众号文章《精华：去哪儿网AI Coding研发平台实践，值得读三遍的样本》后的摘要记录，保留原文链接，仅整理其中关于度量、Harness、数据体系与技能沉淀的关键要点。',
    tags: ['转载阅读', 'AI Coding', '工程实践'],
    minutes: 6,
    contentHtml: `
      <h2 id="copyright">转载说明</h2>
      <p>本文为转载阅读记录，不是原文全文搬运。原文来自公众号「无处不在的技术」，标题为《精华：去哪儿网AI Coding研发平台实践，值得读三遍的样本》，发布时间为 2026-06-24。</p>
      <p>原文地址：<a href="https://mp.weixin.qq.com/s/Ug_fMuGkQmM4tECUbpfXOg" target="_blank" rel="noopener noreferrer">https://mp.weixin.qq.com/s/Ug_fMuGkQmM4tECUbpfXOg</a></p>
      <p>版权归原作者及原发布平台所有。这里仅保留阅读后的结构化摘要与个人理解，方便后续回看；如需完整内容，请访问原文。</p>

      <h2 id="overview">文章主线</h2>
      <p>这篇文章围绕去哪儿网在 AI Coding 上的组织化实践展开，不是单纯讨论某个模型或某个 IDE 工具，而是尝试回答一个更难也更现实的问题：当一个大规模研发组织把 AI Coding 变成日常基础设施之后，怎样度量它、治理它，并让它真正沉淀为组织能力。</p>
      <p>全文基本按四条线展开：第一条线是度量体系，第二条线是自动化分级与 Harness，第三条线是平台化落地路径，第四条线是 Skills 沉淀与组织治理。对技术管理者来说，这个结构比单点提效案例更值得反复看。</p>

      <h2 id="key-points">要点摘记</h2>
      <p>第一，文章强调不要只看“AI 写了多少代码”，而要同时看量和成熟度。原文把指标拆成 Volume 与 Maturity 两部分：一边看出码率、出码量、团队覆盖率、需求覆盖率，另一边看自动化等级和 Harness 等级。这比只盯着出码率更接近真实价值。</p>
      <p>第二，作者借用自动驾驶体系，把 AI Coding 分成 L0 到 L5 六级。从补全、局部生成，到有条件自动化、高度自动化，再到接近无人值守，这个分级把“大家都在说 AI Coding”这件事放进了同一套语言系统里，便于团队协作和管理。</p>
      <p>第三，文章最有价值的概念之一是 Harness。它不把重点放在模型有多强，而是放在 AI 参与研发流程时是否被稳定触发、被约束、被隔离、被审查。需求、设计、编码、测试、回归、灰度、发布等环节，都应该有对应的控制点和人工关口。</p>
      <p>第四，原文提出了四个关键控制手段：AI 触发机制、约束与门禁、安全隔离环境、人工审查节点。这个思路很像给 AI Coding 建“护栏系统”，核心目的是在提升自动化的同时，避免无约束地把风险一路带到生产环境。</p>
      <p>第五，落地路径不是“装上工具就结束”，而是 Tool、Infra、Automation、Insight 四段递进。先让 Claude Code、Codex、Cursor 等工具被广泛使用，再把能力接入研发基建，再做多 Agent、多 Skills 的自动化编排，最后用统一数据体系回收全流程洞察。</p>
      <p>第六，QunarDevCenter 这一部分很值得参考。它本质上是在给 AI Coding 建数据底座，负责采集不同终端和工具的会话数据，再与任务、测试、发布、监控链路关联。这样管理者看到的不再只是“某个人用了什么工具”，而是“AI 在整个研发链路里参与到了什么程度，效果如何”。</p>
      <p>第七，天弦（QDO）代表的是把零散 AI 任务编排成可调度工作流。文中举了 JDK 自动升级、复杂需求开发等案例，重点不是展示模型能力，而是展示如何把规则系统、Agent、部署、测试和反馈闭环串成稳定流程。</p>
      <p>第八，Qsuperpowers 和 Skills 体系说明了一个更长期的方向：AI Coding 不只是个人 prompt 技巧的比拼，而是把需求澄清、计划拆解、编码、部署、测试、验收这些经验，逐步沉淀成可复用、可检索、可治理的组织资产。</p>

      <h2 id="notable-sections">我最在意的几个点</h2>
      <p>一个是分级体系。很多团队讨论 AI Coding 时，常常把 Copilot 补全和“需求到代码的自动交付”混在一起。分级之后，团队才能知道自己当前停在哪一层，下一步要补的是模型、流程，还是治理。</p>
      <p>另一个是 Harness。过去很多分享都爱讲模型升级、prompt 技巧、上下文工程，但真正决定能不能大规模上线的，往往是隔离环境、审查节点、失败拦截和复盘机制。这篇文章把这些问题讲得很具体，也更贴近企业真实落地。</p>
      <p>还有一个是 Skills 沉淀。文章里讲的重点不是“工具越多越好”，而是要把有效工作流做成可复用的能力单元，让个人经验逐步变成团队默认能力。这和我现在给博客补 skill 的思路，其实是同一类事情，只是规模不同。</p>

      <h2 id="personal-notes">个人理解</h2>
      <p>我觉得这篇文章最值得看三遍的地方，不是它列了多少平台名称，而是它把 AI Coding 从“个人提效玩具”拉回到了“组织工程系统”视角。真正重要的不是哪个模型一时更强，而是数据有没有采起来、流程有没有编排起来、风险有没有被控制住、经验有没有沉淀下来。</p>
      <p>如果把它映射到个人项目或小团队，也能得到很实用的启发：先别急着追求全自动，先把常见流程写成脚本和 skill，把关键验证点固定下来，把发布和回归做成可重复执行的步骤。稳定之后，再谈更高等级的自动化，会踏实很多。</p>
    `
  },
  {
    title: '转载阅读：从0到1搭建 Agent',
    url: '/2026/06/27/agent-from-zero-to-one-reading/',
    date: '2026-06-27',
    datetime: '2026-06-27T22:20:00+08:00',
    updated: '2026-06-27',
    updatedDatetime: '2026-06-27T22:20:00+08:00',
    summary: '阅读阿里技术《从0到1搭建 Agent ：Agent 原理分析及个人助手实践（长文干货）》后的摘要记录，保留原文链接并只做要点整理。',
    tags: ['转载阅读', 'Agent', 'LLM'],
    minutes: 5,
    contentHtml: `
      <h2 id="copyright">转载说明</h2>
      <p>本文为转载阅读记录，不是原文全文搬运。原文来自公众号「阿里技术」，标题为《从0到1搭建 Agent ：Agent 原理分析及个人助手实践（长文干货）》，发布时间为 2026-05-21。</p>
      <p>原文地址：<a href="https://mp.weixin.qq.com/s/ILX8GGETM84-_rQssCZhwQ" target="_blank" rel="noopener noreferrer">https://mp.weixin.qq.com/s/ILX8GGETM84-_rQssCZhwQ</a></p>
      <p>版权归原作者及原发布平台所有。这里仅保留少量阅读摘录和个人摘要，方便后续回看与学习；如需完整内容，请访问原文。</p>

      <h2 id="overview">文章主线</h2>
      <p>原文是一篇较长的 Agent 入门到实践文章，整体分成两部分：前半部分梳理 Agent 相关理论，后半部分介绍个人助手项目的工程实现。它的核心价值在于把「模型知道什么、模型能做什么、模型如何稳定完成任务」这三条线串在一起。</p>
      <p>理论部分从 LLM 的无状态和知识静态问题出发，依次引出记忆系统、RAG、Function Call、MCP、Agent Loop、Skill、Multi-Agent 和 Harness。实践部分则围绕一个个人助手项目，拆解核心 loop、记忆模块、工具模块、SubAgent、Plan 能力和 Skill 系统。</p>

      <h2 id="key-points">要点摘记</h2>
      <p>第一，Agent 不只是调用大模型，而是围绕模型补齐记忆、知识、工具、规划、执行和容错能力。LLM 本身更像推理与生成核心，真正能做事需要外部系统配合。</p>
      <p>第二，记忆系统解决跨轮次、跨会话的信息延续问题。短期记忆关注上下文窗口管理，长期记忆关注持久化、检索、更新和冲突处理。原文还把记忆进一步推到 skill 沉淀：从事实、规则到可触发的能力包。</p>
      <p>第三，RAG 负责补业务知识和新知识。文章把 RAG 拆成文档分块、向量化、向量存储、检索优化和评估，并强调生产环境里不能只靠简单向量相似度检索。</p>
      <p>第四，Function Call 和 MCP 让模型从“会说”走向“会做”。Function Call 偏单应用内工具调用，MCP 更强调标准化协议、工具发现和跨环境复用。</p>
      <p>第五，Agent Loop 有多种范式：ReAct、Plan-Execute、Plan-React、LATS、Reflexion 等。原文实践更倾向以 ReAct 为主循环，同时在复杂任务中引入可选 Plan 能力。</p>
      <p>第六，Skill 的价值是渐进式加载。它把工具、说明和资源打包成能力包，按需进入上下文，避免工具过多导致 token 膨胀、选择困难和指令冲突。</p>
      <p>第七，Multi-Agent 适合处理上下文隔离、并行探索、专家化和质量评估。文章列举了主从委托、接力传递、对等讨论、层级分治、竞争选优、评估反馈和动态路由等模式。</p>
      <p>第八，Harness 是 Agent 稳定运行的保护层。它负责错误分类、重试退避、上下文治理、副作用控制、权限策略、提示注入防护和可观测性。</p>

      <h2 id="designs">实践设计启发</h2>
      <p>这篇文章里比较值得借鉴的是把个人助手看成一个可演进系统，而不是一次性 prompt。记忆、工具、Plan、SubAgent、Skill、Harness 都是围绕同一个目标服务：让 Agent 能持续吸收信息、按需调用能力，并在复杂任务中保持可控。</p>
      <p>对个人博客和日常工作流来说，最直接的启发是：把重复流程沉淀成 skill，把易错流程写成脚本，把长上下文任务拆成可验证的小步骤。刚刚创建的博客管理 skill，其实就是这种思路的一个小实践。</p>

      <h2 id="personal-notes">个人理解</h2>
      <p>我认为这篇文章适合当作 Agent 工程化路线图来看：从 LLM 基础能力出发，逐层补齐记忆、知识、工具、规划、多智能体协作和稳定性治理。真正有用的 Agent，不是单点能力最强，而是系统边界、状态管理和失败处理足够清楚。</p>
      <p>后续如果继续做个人助手，可以优先从三个方向落地：一是可控的长期记忆，二是工具和 skill 的渐进式加载，三是明确的 Harness 规则。这样比盲目堆工具更容易稳定。</p>
    `
  },
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
