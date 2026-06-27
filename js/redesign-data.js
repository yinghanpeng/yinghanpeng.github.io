window.BLOG_DATA = {
  "site": {
    "name": "zorro 的技术博客",
    "author": "zorro",
    "description": "记录工程实践、排错过程和持续学习。",
    "origin": "https://yinghanpeng.github.io"
  },
  "posts": [
    {
      "title": "转载阅读：从0到1搭建 Agent",
      "url": "/2026/06/27/agent-from-zero-to-one-reading/",
      "date": "2026-06-27",
      "datetime": "2026-06-27T22:20:00+08:00",
      "updated": "2026-06-27",
      "updatedDatetime": "2026-06-27T22:20:00+08:00",
      "summary": "阅读阿里技术《从0到1搭建 Agent ：Agent 原理分析及个人助手实践（长文干货）》后的摘要记录，保留原文链接并只做要点整理。",
      "tags": [
        "转载阅读",
        "Agent",
        "LLM"
      ],
      "minutes": 5,
      "contentHtml": "<h2 id=\"copyright\">转载说明</h2>\n      <p>本文为转载阅读记录，不是原文全文搬运。原文来自公众号「阿里技术」，标题为《从0到1搭建 Agent ：Agent 原理分析及个人助手实践（长文干货）》，发布时间为 2026-05-21。</p>\n      <p>原文地址：<a href=\"https://mp.weixin.qq.com/s/ILX8GGETM84-_rQssCZhwQ\" target=\"_blank\" rel=\"noopener noreferrer\">https://mp.weixin.qq.com/s/ILX8GGETM84-_rQssCZhwQ</a></p>\n      <p>版权归原作者及原发布平台所有。这里仅保留少量阅读摘录和个人摘要，方便后续回看与学习；如需完整内容，请访问原文。</p>\n\n      <h2 id=\"overview\">文章主线</h2>\n      <p>原文是一篇较长的 Agent 入门到实践文章，整体分成两部分：前半部分梳理 Agent 相关理论，后半部分介绍个人助手项目的工程实现。它的核心价值在于把「模型知道什么、模型能做什么、模型如何稳定完成任务」这三条线串在一起。</p>\n      <p>理论部分从 LLM 的无状态和知识静态问题出发，依次引出记忆系统、RAG、Function Call、MCP、Agent Loop、Skill、Multi-Agent 和 Harness。实践部分则围绕一个个人助手项目，拆解核心 loop、记忆模块、工具模块、SubAgent、Plan 能力和 Skill 系统。</p>\n\n      <h2 id=\"key-points\">要点摘记</h2>\n      <p>第一，Agent 不只是调用大模型，而是围绕模型补齐记忆、知识、工具、规划、执行和容错能力。LLM 本身更像推理与生成核心，真正能做事需要外部系统配合。</p>\n      <p>第二，记忆系统解决跨轮次、跨会话的信息延续问题。短期记忆关注上下文窗口管理，长期记忆关注持久化、检索、更新和冲突处理。原文还把记忆进一步推到 skill 沉淀：从事实、规则到可触发的能力包。</p>\n      <p>第三，RAG 负责补业务知识和新知识。文章把 RAG 拆成文档分块、向量化、向量存储、检索优化和评估，并强调生产环境里不能只靠简单向量相似度检索。</p>\n      <p>第四，Function Call 和 MCP 让模型从“会说”走向“会做”。Function Call 偏单应用内工具调用，MCP 更强调标准化协议、工具发现和跨环境复用。</p>\n      <p>第五，Agent Loop 有多种范式：ReAct、Plan-Execute、Plan-React、LATS、Reflexion 等。原文实践更倾向以 ReAct 为主循环，同时在复杂任务中引入可选 Plan 能力。</p>\n      <p>第六，Skill 的价值是渐进式加载。它把工具、说明和资源打包成能力包，按需进入上下文，避免工具过多导致 token 膨胀、选择困难和指令冲突。</p>\n      <p>第七，Multi-Agent 适合处理上下文隔离、并行探索、专家化和质量评估。文章列举了主从委托、接力传递、对等讨论、层级分治、竞争选优、评估反馈和动态路由等模式。</p>\n      <p>第八，Harness 是 Agent 稳定运行的保护层。它负责错误分类、重试退避、上下文治理、副作用控制、权限策略、提示注入防护和可观测性。</p>\n\n      <h2 id=\"designs\">实践设计启发</h2>\n      <p>这篇文章里比较值得借鉴的是把个人助手看成一个可演进系统，而不是一次性 prompt。记忆、工具、Plan、SubAgent、Skill、Harness 都是围绕同一个目标服务：让 Agent 能持续吸收信息、按需调用能力，并在复杂任务中保持可控。</p>\n      <p>对个人博客和日常工作流来说，最直接的启发是：把重复流程沉淀成 skill，把易错流程写成脚本，把长上下文任务拆成可验证的小步骤。刚刚创建的博客管理 skill，其实就是这种思路的一个小实践。</p>\n\n      <h2 id=\"personal-notes\">个人理解</h2>\n      <p>我认为这篇文章适合当作 Agent 工程化路线图来看：从 LLM 基础能力出发，逐层补齐记忆、知识、工具、规划、多智能体协作和稳定性治理。真正有用的 Agent，不是单点能力最强，而是系统边界、状态管理和失败处理足够清楚。</p>\n      <p>后续如果继续做个人助手，可以优先从三个方向落地：一是可控的长期记忆，二是工具和 skill 的渐进式加载，三是明确的 Harness 规则。这样比盲目堆工具更容易稳定。</p>"
    },
    {
      "title": "测试文章",
      "url": "/2026/06/27/test-post/",
      "date": "2026-06-27",
      "datetime": "2026-06-27T21:13:32+08:00",
      "updated": "2026-06-27",
      "updatedDatetime": "2026-06-27T21:13:32+08:00",
      "summary": "这是一篇用于测试 GitHub Pages 发布流程的文章。适合作为新设计的首篇测试内容。",
      "tags": [
        "发布测试",
        "GitHub Pages"
      ],
      "minutes": 2,
      "contentHtml": "<h2 id=\"publish-validation\">发布验证</h2>\n      <p>这是一篇用于测试 GitHub Pages 发布流程的文章。新设计会保留静态站的简单可靠，同时把首页、归档、搜索和文章页做得更清楚。</p>\n      <p>如果你能在首页、归档页和搜索里看到它，就说明静态文件发布链路是通的。发布成功后可以删除这篇文章，或把它替换成正式内容。</p>\n\n      <h2 id=\"writing-flow\">写作流程</h2>\n      <p>后续新增正式文章时，只需要把文章数据补进生成脚本，再运行一次渲染命令。首页、归档、搜索索引和文章页都会同步更新，避免手工维护多个 HTML 块。</p>\n      <pre><code>post:\n  title: 测试文章\n  date: 2026-06-27\n  tags:\n    - GitHub Pages\n    - 发布测试</code></pre>\n\n      <h2 id=\"next-step\">下一步</h2>\n      <p>这篇文章现在可以继续作为发布测试保留；等正式内容准备好后，也可以把它替换成第一篇真正的技术记录。</p>"
    },
    {
      "title": "123",
      "url": "/2021/02/13/newpapername/",
      "date": "2021-02-13",
      "datetime": "2021-02-13T17:14:45+08:00",
      "updated": "2023-07-07",
      "updatedDatetime": "2023-07-07T17:59:55+08:00",
      "summary": "旧文章占位内容。重设计后它仍然保留，并出现在首页、归档和搜索里。",
      "tags": [
        "旧文",
        "随笔"
      ],
      "minutes": 1,
      "contentHtml": "<p>123232</p>"
    }
  ]
};
