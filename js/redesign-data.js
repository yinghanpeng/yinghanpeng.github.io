window.BLOG_DATA = {
  "site": {
    "name": "zorro 的技术博客",
    "author": "zorro",
    "description": "记录工程实践、排错过程和持续学习。",
    "origin": "https://yinghanpeng.github.io"
  },
  "posts": [
    {
      "title": "在外网发现的一篇很好的 AI ENGINEERING PDF,内容见附件",
      "url": "/2026/07/15/ai-engineering-pdf-note/",
      "date": "2026-07-15",
      "datetime": "2026-07-15T21:45:00+08:00",
      "updated": "2026-07-15",
      "updatedDatetime": "2026-07-15T21:45:00+08:00",
      "summary": "记录一份在外网发现的 AI Engineering Guidebook PDF，并附上原始附件文件，方便后续直接打开阅读。",
      "tags": [
        "AI Engineering",
        "PDF",
        "资料收藏"
      ],
      "minutes": 1,
      "contentHtml": "<h2 id=\"attachment\">附件说明</h2>\n      <p>在外网发现了一份很不错的 <strong>AI Engineering</strong> 资料，这里先存一份到博客里，方便后面直接打开查看。</p>\n      <p>附件文件：<a href=\"/files/pdf/ai-engineering-guidebook.pdf\" target=\"_blank\" rel=\"noopener noreferrer\">AI Engineering Guidebook.pdf</a></p>\n      <p>文件信息：384 页，PDF 文档。</p>\n\n      <h2 id=\"usage\">打开方式</h2>\n      <p>可以直接点击上面的链接在线打开，也可以在浏览器里另存后离线阅读。</p>"
    },
    {
      "title": "转载阅读：Harness 工程之道，Skill 原理与最佳实践",
      "url": "/2026/07/01/skill-engineering-reading/",
      "date": "2026-07-01",
      "datetime": "2026-07-01T21:20:00+08:00",
      "updated": "2026-07-01",
      "updatedDatetime": "2026-07-01T21:20:00+08:00",
      "summary": "阅读阿里云开发者《Harness 工程之道：Skill 原理与最佳实践》后的摘要记录，保留原文链接，整理其中关于 Skill 的触发机制、目录结构、作用域优先级与工程化设计原则的关键观点。",
      "tags": [
        "转载阅读",
        "Skill",
        "Harness Engineering"
      ],
      "minutes": 7,
      "contentHtml": "<h2 id=\"copyright\">转载说明</h2>\n      <p>本文为转载阅读记录，不是原文全文搬运。原文来自公众号「阿里云开发者」，标题为《Harness 工程之道：Skill 原理与最佳实践》，发布时间为 2026-07-01。</p>\n      <p>原文地址：<a href=\"https://mp.weixin.qq.com/s/yo2f5edeNNkYtCte9P0yhQ\" target=\"_blank\" rel=\"noopener noreferrer\">https://mp.weixin.qq.com/s/yo2f5edeNNkYtCte9P0yhQ</a></p>\n      <p>版权归原作者及原发布平台所有。这里仅保留阅读后的结构化摘要与个人理解，方便后续回看；如需完整内容，请访问原文。</p>\n\n      <h2 id=\"overview\">文章主线</h2>\n      <p>这篇文章讨论的不是“怎么再写一个更长的 Prompt”，而是为什么 Agent 时代需要把专业知识和工作流封装成 Skill。作者从 Prompt 工程的局限切入，解释 Skill 如何以更轻量、更模块化的方式，把领域能力按需加载给 Agent。</p>\n      <p>全文基本沿着四条线展开：第一条线讲 Skill 产生的背景与核心理念，第二条线讲 Skill 的结构规范，第三条线讲触发机制和作用域优先级，第四条线讲一组比较工程化的最佳实践，包括路由设计、知识分层、权限隔离、脚本增强和参数传递。</p>\n\n      <h2 id=\"key-points\">要点摘记</h2>\n      <p>第一，文章把 Skill 放在 Prompt 工程的延长线上来理解。Prompt 工程解决的是“每次对话怎么把背景塞进去”，但随着项目变复杂，所有知识都堆在一个大 Prompt 里会越来越臃肿，上下文窗口被稀释，知识也和单个项目深度耦合。Skill 的价值，就是把这些知识和流程拆成可移植、可版本化、可按需加载的能力包。</p>\n      <p>第二，作者认为 Skill 的核心设计理念是渐进性披露。会话刚启动时，Agent 只知道每个 Skill 的 name 和 description；只有任务语义命中后，才读取完整的 SKILL.md；进入真正执行阶段，才按路由去加载对应模块和参考资料。这样上下文成本更低，也更容易把窗口留给当前任务真正相关的信息。</p>\n      <p>第三，文章把 System Prompt 和 Skill 做了一个挺清楚的区分。前者更像“这个项目的规矩”，会在会话启动时整体加载；后者更像“某种可复用的能力”，只在需要时激活。一个项目完全可以同时拥有全局规则和多个 Skill，它们不是互斥关系，而是层叠关系。</p>\n      <p>第四，Skill 的目录结构和 SKILL.md 入口规范被讲得很细。一个 Skill 本质上就是一个带 SKILL.md 的文件夹，里面可以放 scripts、references、assets 等子目录；而 SKILL.md 既是唯一入口，也是唯一触发器，其中 frontmatter 的 name 和 description 字段尤其关键，因为 Agent 是否会在正确时机调用它，主要靠这里的语义描述。</p>\n      <p>第五，作者特别强调 description 的重要性。自动触发的本质是语义匹配，因此 description 不只是写“这个 Skill 做什么”，还要写“什么时候该用它”。要同时回答 WHAT 和 WHEN，尽量显式列出具体触发词，必要时还要写清不适用的边界，以减少误触发。</p>\n      <p>第六，作用域和优先级也很关键。Skill 可能来自企业级配置、个人全局配置、项目目录或 plugin 内置资源；一旦多个 Skill 同时命中，通常需要遵循企业策略优先、再到个人配置、项目配置、插件内置的层次。也就是说，Skill 不只是一个文件格式，更是一个有治理层次的能力分发系统。</p>\n      <p>第七，文章里最实用的一组建议是“SKILL.md 正文即路由器”。主文件应该负责分发意图和声明全局规则，而不是把所有知识都堆进去；细节应该下沉到模块文件，让 Agent 只在当前阶段读取真正需要的内容。这和我们现在给博客、脚本、Skill 做分层，其实是完全同一类设计思想。</p>\n      <p>第八，后半段对权限设计和脚本增强也很到位。工程级 Skill 涉及多个模块和工具时，应该坚持模块级白名单和最小权限；而凡是适合确定性完成的事情，比如配置读写、环境检测、日志采集和复杂计算，都更适合封装成脚本，让 Agent 去调，而不是让模型自己“猜”。</p>\n\n      <h2 id=\"notable-sections\">我最在意的几个点</h2>\n      <p>我最认同的一点，是把 SKILL.md 当“路由器”而不是“知识仓库”。很多人一写 Skill 就想把所有背景、规则、案例、接口说明都塞进主文件里，结果很快又退化成一个超大 Prompt。按路由分层之后，Skill 才真正具备可维护性。</p>\n      <p>第二个点是 description 的工程价值。平时容易把它当文案字段，但实际上它决定自动触发是否靠谱。写得模糊，Skill 就会失灵或者乱触发；写得清楚，它才真像一个能被 Agent 正确调用的“能力单元”。</p>\n      <p>第三个点是脚本和权限隔离。文章没有把 Skill 浪漫化成纯提示词艺术，而是很明确地说：真正生产可用的 Skill，必须把可确定的逻辑交给脚本，把危险操作关进白名单，把模块职责切干净。这一点非常工程化，也非常重要。</p>\n\n      <h2 id=\"personal-notes\">个人理解</h2>\n      <p>我觉得这篇文章刚好补上了 Harness 话题里一个很落地的拼图。Harness 讲的是给 Agent 搭工作环境，而 Skill 更像这个环境里的能力插件系统。它把知识、规则、脚本和工具调用方式都组织成一个可发现、可激活、可治理的结构，让 Agent 不用每次从零开始拼凑工作流。</p>\n      <p>放到我现在给你做博客管理、图片整理和转载阅读这些事上，其实同样成立。真正省力的不是让模型每次重新理解流程，而是把稳定流程沉淀成一个描述清楚、边界明确、按需加载的 Skill。这样一来，能力才会越来越像资产，而不是一次性聊天产物。</p>"
    },
    {
      "title": "转载阅读：开启 Harness Engineering 探索之旅",
      "url": "/2026/06/29/harness-engineering-reading/",
      "date": "2026-06-29",
      "datetime": "2026-06-29T22:15:00+08:00",
      "updated": "2026-06-29",
      "updatedDatetime": "2026-06-29T22:15:00+08:00",
      "summary": "阅读腾讯技术工程《开启Harness Engineering探索之旅》后的摘要记录，保留原文链接，整理其中关于 Prompt/Context/Harness 三层迁移、研发端到端协议化和测试自愈链路的关键观点。",
      "tags": [
        "转载阅读",
        "Harness Engineering",
        "AI Coding"
      ],
      "minutes": 7,
      "contentHtml": "<h2 id=\"copyright\">转载说明</h2>\n      <p>本文为转载阅读记录，不是原文全文搬运。原文来自公众号「腾讯技术工程」，标题为《开启Harness Engineering探索之旅》，发布时间为 2026-06-29。</p>\n      <p>原文地址：<a href=\"https://mp.weixin.qq.com/s/uhc7_-0Vm_cw9p17b9VyJA\" target=\"_blank\" rel=\"noopener noreferrer\">https://mp.weixin.qq.com/s/uhc7_-0Vm_cw9p17b9VyJA</a></p>\n      <p>版权归原作者及原发布平台所有。这里仅保留阅读后的结构化摘要与个人理解，方便后续回看；如需完整内容，请访问原文。</p>\n\n      <h2 id=\"overview\">文章主线</h2>\n      <p>这篇文章试图解释一个很多团队都已经碰到的现实问题：AI 写代码越来越快，但研发整体节奏并没有按同样比例提速。作者把这个现象归因到一个更高层的短板上，也就是模型之外那套工作环境、约束、反馈和验证机制，并用 Harness Engineering 这个名字去概括它。</p>\n      <p>全文先讲概念是怎么“结晶”出来的，再回到团队自己的工程实践，重点展开他们如何围绕需求、设计、实现、测试、部署和归档做一整套协议化、管线化和自愈化改造。它不是单点工具介绍，而是一篇很强的工程系统设计复盘。</p>\n\n      <h2 id=\"key-points\">要点摘记</h2>\n      <p>第一，作者把 AI 工程的关注点迁移拆成三站：Prompt Engineering 关注单次回答，Context Engineering 关注每一步喂给模型的信息，而 Harness Engineering 关注整段任务在真实工程环境里能不能稳定跑完。这个分层挺清楚，也解释了为什么模型变强之后，新的瓶颈会转移到模型外。</p>\n      <p>第二，文中反复强调 Harness 不是教模型“怎么回答”，而是设计模型“怎么工作”。换句话说，重点不再是这一句输出对不对，而是长链路任务里有没有执行环境、工具协调、状态管理、反馈注入、约束施加和进展验证。</p>\n      <p>第三，作者认为“AI 写得快但整体没快多少”的根因不在代码生成本身，而在理解、对齐、验证、沉淀和追溯这些非编码环节没有同步被系统性加速。代码这一环提速后，下游 review、测试、维护反而更容易被动，这也是很多团队真实会遇到的结构性问题。</p>\n      <p>第四，腾讯这套实践把目标概括成“人提需求，AI 理解，AI 执行，人确认”，并把研发端到端交付拆成 P1 到 P6 的标准阶段，再加一个可选前置。核心思想不是让 AI 自由发挥，而是让每一阶段都变成有明确输入输出契约、可校验、可追溯的工序。</p>\n      <p>第五，P1 和 P2 的做法很值得注意。需求阶段要求直接引用 TAPD 原始口径，AC 必须可测，test cases 与 requirements 同源；设计阶段则把 design 文档当作机器可读契约来写，强调字段、接口、状态流、改动点都要显式化，避免实现阶段靠 AI 自行脑补。</p>\n      <p>第六，P3 和 P4 的实践更像真正的 Harness 工程。实现阶段通过 D2C、UI 校准闭环和 code-reviewer 三档机制约束“像不像、对不对”；测试阶段则把后端 API 测试做成失败后自动抓 trace、查日志、查数据库、查 Redis，再产出根因建议的自愈链路。</p>\n      <p>第七，文章里对部署和归档的强调也很重要。部署不是“推上去就完”，而是要有评分卡、显式确认和上线前硬门槛；归档也不是写材料，而是为下次同类任务沉淀知识与可复用能力，否则 AI 每次都要重新踩坑。</p>\n      <p>第八，这篇文章的价值不在于某个 Skill 名字，而在于它把 Harness 具体化成了一整套组织内的工程纪律：协议、模板、校验、Stop 点、评分卡、自愈循环、知识同步。这比单纯谈模型能力，更接近大团队真正能落地的东西。</p>\n\n      <h2 id=\"notable-sections\">我最在意的几个点</h2>\n      <p>我最在意的第一个点，是他们把“需求到上线”拆成了明确阶段，而且每一阶段都要求机器可读。很多团队现在已经能用 AI 写出东西，但一旦流程没有契约，真正的风险就从代码质量转移成“整个链路谁也说不清楚发生了什么”。</p>\n      <p>第二个点是测试自愈链路。文章里最亮眼的一段，不是让 AI 自动生成测试，而是失败之后能不能自动拿着 trace 去找日志、查数据、回给实现 Agent 继续修。这种反馈回路才是 Harness 真正发力的地方。</p>\n      <p>第三个点是它对边界很诚实。比如用户真正想要什么、SQL 是否执行、灰度与回滚的决策权，文章都明确保留给人。它不是一篇盲目吹全自动的文章，这反而让整套方案更可信。</p>\n\n      <h2 id=\"personal-notes\">个人理解</h2>\n      <p>我觉得这篇文章最重要的提醒是：Agent 真正难的部分，越来越不是“能不能生成代码”，而是“能不能在你的工程体系里稳定工作”。当团队从个人提效走向组织协作时，Prompt 已经不够，单纯上下文也不够，必须把流程纪律、反馈回路和风险控制一起补上。</p>\n      <p>如果映射到我现在维护博客、脚本和个人工作流的场景，也一样成立。真正能长期省心的，不是一次性让 AI 写出东西，而是把常见错误、校验规则和发布步骤慢慢外置成固定机制。Harness 说到底，就是把“下次别再犯同样的错”工程化。</p>"
    },
    {
      "title": "AI 核心概念十图速览",
      "url": "/2026/06/29/ai-concepts-gallery/",
      "date": "2026-06-29",
      "datetime": "2026-06-29T21:30:00+08:00",
      "updated": "2026-06-29",
      "updatedDatetime": "2026-06-29T21:30:00+08:00",
      "summary": "整理了 10 张 AI 核心概念图，包括 MCP、RAG、Function Calling、Memory、Planning、Workflow vs Agent 等，适合做一篇集中回看和分享用的图文笔记。",
      "tags": [
        "AI",
        "知识图谱",
        "Agent"
      ],
      "minutes": 4,
      "contentHtml": "<h2 id=\"overview\">这篇内容放什么</h2>\n      <p>把这 10 张图集中整理成一篇博客，方便后面统一回看、转发和收藏。内容覆盖了 AI Agent 常见的一组核心概念：MCP、RAG、Function Calling、Context Engineering、Memory、Planning、Workflow vs Agent、Multi-Agent、Model Architecture 和 Reinforcement Learning。</p>\n      <p>这些图本身已经很完整，所以正文不额外展开大段解释，主要保留一个清晰的浏览顺序。后面如果你想，我也可以继续把这篇扩成“每张图配一段自己的理解”的版本。</p>\n\n      <h2 id=\"gallery\">十张图</h2>\n      <figure>\n        <img src=\"/images/posts/ai-concepts/mcp.jpg\" alt=\"一张图讲懂 MCP\">\n        <figcaption>1. MCP（Model Context Protocol）：让 AI 以标准方式连接工具、数据和外部系统。</figcaption>\n      </figure>\n      <figure>\n        <img src=\"/images/posts/ai-concepts/rag.jpg\" alt=\"一张图讲懂 RAG\">\n        <figcaption>2. RAG（Retrieval-Augmented Generation）：先检索，再增强上下文，最后生成回答。</figcaption>\n      </figure>\n      <figure>\n        <img src=\"/images/posts/ai-concepts/function-calling.jpg\" alt=\"一张图讲懂 Function Calling\">\n        <figcaption>3. Function Calling / Tool Calling：让模型从“会说”走向“会做”。</figcaption>\n      </figure>\n      <figure>\n        <img src=\"/images/posts/ai-concepts/context-engineering.jpg\" alt=\"一张图讲懂 Context Engineering\">\n        <figcaption>4. Context Engineering：把真正相关、准确、结构化的信息放进上下文。</figcaption>\n      </figure>\n      <figure>\n        <img src=\"/images/posts/ai-concepts/memory.jpg\" alt=\"一张图讲懂 Memory\">\n        <figcaption>5. Memory（记忆系统）：让 AI 记住过去，理解现在，辅助未来。</figcaption>\n      </figure>\n      <figure>\n        <img src=\"/images/posts/ai-concepts/planning.jpg\" alt=\"一张图讲懂 Planning\">\n        <figcaption>6. Planning（规划）：先拆解目标，再决定执行路径和资源分配。</figcaption>\n      </figure>\n      <figure>\n        <img src=\"/images/posts/ai-concepts/workflow-vs-agent.jpg\" alt=\"一张图讲懂 Workflow vs Agent\">\n        <figcaption>7. Workflow vs Agent：什么时候适合固定流程，什么时候适合自主决策。</figcaption>\n      </figure>\n      <figure>\n        <img src=\"/images/posts/ai-concepts/multi-agent.jpg\" alt=\"一张图讲懂 Multi-Agent\">\n        <figcaption>8. Multi-Agent（多智能体）：多个角色协作完成复杂任务。</figcaption>\n      </figure>\n      <figure>\n        <img src=\"/images/posts/ai-concepts/model-architecture.jpg\" alt=\"一张图讲懂 Model Architecture\">\n        <figcaption>9. Model Architecture（模型架构）：理解 Transformer、MoE 和大模型能力边界。</figcaption>\n      </figure>\n      <figure>\n        <img src=\"/images/posts/ai-concepts/reinforcement-learning.jpg\" alt=\"一张图讲懂 Reinforcement Learning\">\n        <figcaption>10. Reinforcement Learning（强化学习）：通过试错与反馈不断优化策略。</figcaption>\n      </figure>\n\n      <h2 id=\"closing\">一句收尾</h2>\n      <p>如果把这组图连起来看，其实刚好能串出一条从模型基础能力到 Agent 工程化落地的主线：模型架构决定底座，强化学习影响行为优化，RAG、Memory 和 Context Engineering 提供知识与上下文，Function Calling 和 MCP 打通外部能力，Planning、Workflow、Agent 和 Multi-Agent 决定任务怎么真正跑起来。</p>"
    },
    {
      "title": "转载阅读：Loop Engineering 概念解析、思考与实践",
      "url": "/2026/06/27/loop-engineering-reading/",
      "date": "2026-06-27",
      "datetime": "2026-06-27T23:20:00+08:00",
      "updated": "2026-06-27",
      "updatedDatetime": "2026-06-27T23:20:00+08:00",
      "summary": "阅读阿里技术《Loop Engineering 概念解析、思考与实践》后的摘要记录，保留原文链接，整理其中关于 Agent Loop、外层验收闭环、六大框架与适用边界的核心观点。",
      "tags": [
        "转载阅读",
        "Loop Engineering",
        "Agent"
      ],
      "minutes": 6,
      "contentHtml": "<h2 id=\"copyright\">转载说明</h2>\n      <p>本文为转载阅读记录，不是原文全文搬运。原文来自公众号「阿里技术」，标题为《Loop Engineering 概念解析、思考与实践》，发布时间为 2026-06-18。</p>\n      <p>原文地址：<a href=\"https://mp.weixin.qq.com/s/ael7aIEoomk4AU84E-mpGg\" target=\"_blank\" rel=\"noopener noreferrer\">https://mp.weixin.qq.com/s/ael7aIEoomk4AU84E-mpGg</a></p>\n      <p>版权归原作者及原发布平台所有。这里仅保留阅读后的结构化摘要和个人理解，方便后续回看；如需完整内容，请访问原文。</p>\n\n      <h2 id=\"overview\">文章主线</h2>\n      <p>这篇文章的核心不是再解释一遍 Agent 会调用工具，而是进一步讨论：既然 Agent 已经能完成长链条执行，那么能不能把“人不断补一句提示、再验一次结果、再让它继续改”的外层协作，也设计成一个自动循环。作者把这种思路概括为 Loop Engineering。</p>\n      <p>整篇文章基本分成四段：先区分底层 Agent Loop 和更高层的 Loop Engineering，再说明为什么大家开始关注这种“自动化验收闭环”，随后梳理一套六要素框架，最后讨论它的实践方式与边界条件。</p>\n\n      <h2 id=\"key-points\">要点摘记</h2>\n      <p>第一，文章强调 Agent Loop 和 Loop Engineering 不是一回事。前者是 Agent 内部靠 Response、Function Call、工具结果回灌形成的执行循环，后者则是人在 Agent 之外设计的一套更高层流程，用来驱动开发、验证、反馈、修正不断重复，直到达到预设目标。</p>\n      <p>第二，Loop Engineering 想解决的是“人肉反复催模型”的问题。很多人现在用 AI Coding，本质上还是在频繁说“继续”“还是报错”“你改了啥”“回滚”，文章认为这些高频干预如果本身有明确标准，就可以被提前写进流程，让 Agent 主动完成验证和迭代。</p>\n      <p>第三，作者把这种思路描述为把 Human-in-the-Loop 尽量往外推。不是取消人，而是让人更多出现在目标设定和最终确认处，而不是每一轮都手动纠偏。前提是需求、测试集、验收条件要足够清楚，否则自动循环只会把偏差放大。</p>\n      <p>第四，文章总结了一个完整 Loop 的六个核心部分：Automations、Worktrees、Skills、Connectors 或 Plugins、Sub Agents、State。它们分别解决定时触发、并行隔离、能力复用、外部工具接入、角色分工和状态追踪这几类问题。</p>\n      <p>第五，文中对 Worktree 和 Sub Agent 的讨论很实用。并行 Agent 如果不隔离代码目录，很容易互相覆盖；验证类 Sub Agent 如果和实现类 Agent 混在一起，又容易变成自己给自己打分，所以需要通过工作区隔离和角色隔离来提高稳定性。</p>\n      <p>第六，文章认为 Skill 在 Loop Engineering 里不仅是可复用能力包，还可以在每轮循环里持续沉淀经验，逐步从静态说明演化成“活的知识”。这和单次 prompt 的差别在于，它会随着验证和修正不断累积有效做法。</p>\n      <p>第七，实践例子里作者用文本分类任务说明，Loop 不一定非得依赖复杂框架。只要把目标、验证和修正逻辑写清楚，Claude Code 或 Codex 这类工具就可以自己围绕准确率目标循环执行、修正并沉淀能力。</p>\n      <p>第八，文章最后专门提醒：Loop 不是银弹。它对需求定义、验证标准、成本意识和稳定性控制的要求更高。需求模糊时，传统的人在环路里多轮确认，反而可能比一上来全自动更稳。</p>\n\n      <h2 id=\"framework\">六要素里我最认同的点</h2>\n      <p>我比较认同作者把 Loop Engineering 拆成六个部分，而不是把它神化成一个新名词。Automations 负责节奏，Worktrees 负责隔离，Skills 和 Connectors 负责能力，Sub Agents 负责分工，State 负责可追踪性。拆开看之后，它其实更像一套“自动化工程组合拳”。</p>\n      <p>另一个很重要的点是“外层闭环”。很多时候模型本身已经会写代码，真正拖慢效率的是写完之后那一长串来回确认、修补和验证。如果这一层能部分程序化，才算真正把 Agent 从工具升级成可持续运行的系统。</p>\n\n      <h2 id=\"personal-notes\">个人理解</h2>\n      <p>我觉得这篇文章最有价值的地方，是它把“提一个需求”往前推进成“定义一套闭环流程”。这和普通 prompt engineering 的差别，不是文风更复杂，而是你开始思考触发条件、验收标准、失败重试、状态记录和角色分工。</p>\n      <p>放到个人工作流里，这个思路也挺实用：固定、确定、可复现的流程，优先写脚本；需要模型动态判断但又有明确标准的流程，适合写成 skill 或 loop；需求还很模糊、验证标准也说不清时，就别硬上全自动。先把流程讲明白，比把 Loop 造得很酷更重要。</p>"
    },
    {
      "title": "转载阅读：去哪儿网 AI Coding 研发平台实践",
      "url": "/2026/06/27/qunar-ai-coding-platform-reading/",
      "date": "2026-06-27",
      "datetime": "2026-06-27T22:55:00+08:00",
      "updated": "2026-06-27",
      "updatedDatetime": "2026-06-27T22:55:00+08:00",
      "summary": "阅读公众号文章《精华：去哪儿网AI Coding研发平台实践，值得读三遍的样本》后的摘要记录，保留原文链接，仅整理其中关于度量、Harness、数据体系与技能沉淀的关键要点。",
      "tags": [
        "转载阅读",
        "AI Coding",
        "工程实践"
      ],
      "minutes": 6,
      "contentHtml": "<h2 id=\"copyright\">转载说明</h2>\n      <p>本文为转载阅读记录，不是原文全文搬运。原文来自公众号「无处不在的技术」，标题为《精华：去哪儿网AI Coding研发平台实践，值得读三遍的样本》，发布时间为 2026-06-24。</p>\n      <p>原文地址：<a href=\"https://mp.weixin.qq.com/s/Ug_fMuGkQmM4tECUbpfXOg\" target=\"_blank\" rel=\"noopener noreferrer\">https://mp.weixin.qq.com/s/Ug_fMuGkQmM4tECUbpfXOg</a></p>\n      <p>版权归原作者及原发布平台所有。这里仅保留阅读后的结构化摘要与个人理解，方便后续回看；如需完整内容，请访问原文。</p>\n\n      <h2 id=\"overview\">文章主线</h2>\n      <p>这篇文章围绕去哪儿网在 AI Coding 上的组织化实践展开，不是单纯讨论某个模型或某个 IDE 工具，而是尝试回答一个更难也更现实的问题：当一个大规模研发组织把 AI Coding 变成日常基础设施之后，怎样度量它、治理它，并让它真正沉淀为组织能力。</p>\n      <p>全文基本按四条线展开：第一条线是度量体系，第二条线是自动化分级与 Harness，第三条线是平台化落地路径，第四条线是 Skills 沉淀与组织治理。对技术管理者来说，这个结构比单点提效案例更值得反复看。</p>\n\n      <h2 id=\"key-points\">要点摘记</h2>\n      <p>第一，文章强调不要只看“AI 写了多少代码”，而要同时看量和成熟度。原文把指标拆成 Volume 与 Maturity 两部分：一边看出码率、出码量、团队覆盖率、需求覆盖率，另一边看自动化等级和 Harness 等级。这比只盯着出码率更接近真实价值。</p>\n      <p>第二，作者借用自动驾驶体系，把 AI Coding 分成 L0 到 L5 六级。从补全、局部生成，到有条件自动化、高度自动化，再到接近无人值守，这个分级把“大家都在说 AI Coding”这件事放进了同一套语言系统里，便于团队协作和管理。</p>\n      <p>第三，文章最有价值的概念之一是 Harness。它不把重点放在模型有多强，而是放在 AI 参与研发流程时是否被稳定触发、被约束、被隔离、被审查。需求、设计、编码、测试、回归、灰度、发布等环节，都应该有对应的控制点和人工关口。</p>\n      <p>第四，原文提出了四个关键控制手段：AI 触发机制、约束与门禁、安全隔离环境、人工审查节点。这个思路很像给 AI Coding 建“护栏系统”，核心目的是在提升自动化的同时，避免无约束地把风险一路带到生产环境。</p>\n      <p>第五，落地路径不是“装上工具就结束”，而是 Tool、Infra、Automation、Insight 四段递进。先让 Claude Code、Codex、Cursor 等工具被广泛使用，再把能力接入研发基建，再做多 Agent、多 Skills 的自动化编排，最后用统一数据体系回收全流程洞察。</p>\n      <p>第六，QunarDevCenter 这一部分很值得参考。它本质上是在给 AI Coding 建数据底座，负责采集不同终端和工具的会话数据，再与任务、测试、发布、监控链路关联。这样管理者看到的不再只是“某个人用了什么工具”，而是“AI 在整个研发链路里参与到了什么程度，效果如何”。</p>\n      <p>第七，天弦（QDO）代表的是把零散 AI 任务编排成可调度工作流。文中举了 JDK 自动升级、复杂需求开发等案例，重点不是展示模型能力，而是展示如何把规则系统、Agent、部署、测试和反馈闭环串成稳定流程。</p>\n      <p>第八，Qsuperpowers 和 Skills 体系说明了一个更长期的方向：AI Coding 不只是个人 prompt 技巧的比拼，而是把需求澄清、计划拆解、编码、部署、测试、验收这些经验，逐步沉淀成可复用、可检索、可治理的组织资产。</p>\n\n      <h2 id=\"notable-sections\">我最在意的几个点</h2>\n      <p>一个是分级体系。很多团队讨论 AI Coding 时，常常把 Copilot 补全和“需求到代码的自动交付”混在一起。分级之后，团队才能知道自己当前停在哪一层，下一步要补的是模型、流程，还是治理。</p>\n      <p>另一个是 Harness。过去很多分享都爱讲模型升级、prompt 技巧、上下文工程，但真正决定能不能大规模上线的，往往是隔离环境、审查节点、失败拦截和复盘机制。这篇文章把这些问题讲得很具体，也更贴近企业真实落地。</p>\n      <p>还有一个是 Skills 沉淀。文章里讲的重点不是“工具越多越好”，而是要把有效工作流做成可复用的能力单元，让个人经验逐步变成团队默认能力。这和我现在给博客补 skill 的思路，其实是同一类事情，只是规模不同。</p>\n\n      <h2 id=\"personal-notes\">个人理解</h2>\n      <p>我觉得这篇文章最值得看三遍的地方，不是它列了多少平台名称，而是它把 AI Coding 从“个人提效玩具”拉回到了“组织工程系统”视角。真正重要的不是哪个模型一时更强，而是数据有没有采起来、流程有没有编排起来、风险有没有被控制住、经验有没有沉淀下来。</p>\n      <p>如果把它映射到个人项目或小团队，也能得到很实用的启发：先别急着追求全自动，先把常见流程写成脚本和 skill，把关键验证点固定下来，把发布和回归做成可重复执行的步骤。稳定之后，再谈更高等级的自动化，会踏实很多。</p>"
    },
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
      "title": "langgraph学习笔记",
      "url": "/2025/05/13/langgraph-study-notes/",
      "date": "2025-05-13",
      "datetime": "2025-05-13T20:00:00+08:00",
      "updated": "2025-05-13",
      "updatedDatetime": "2025-05-13T20:00:00+08:00",
      "summary": "结合五份 LangGraph 学习笔记，系统梳理 LangGraph 的定位、图结构、控制流、持久化、中断恢复与流式执行，作为一篇连贯的入门到进阶学习记录。",
      "tags": [
        "LangGraph",
        "LangChain",
        "学习笔记"
      ],
      "minutes": 18,
      "contentHtml": "<h2 id=\"overview\">写在前面</h2>\n      <p>这篇文章把几份 <strong>LangGraph</strong> 学习笔记整理到一起，按一个更连续的顺序重新梳理，方便后面统一回看。内容主要覆盖五个部分：LangGraph 的基础定位、图结构与控制流、持久化和可恢复执行、中断与人在环，以及流式执行。</p>\n      <p>如果只是想快速知道 LangGraph 适合做什么，可以先记一句话：<strong>LangChain 更偏高层 Agent 开发入口，LangGraph 更偏底层编排框架和 Agent Runtime</strong>。当任务需要明确状态、复杂分支、长时间运行、中断恢复或人工介入时，LangGraph 的价值会变得非常明显。</p>\n\n      <h2 id=\"positioning\">1. LangGraph 的定位</h2>\n      <p>从学习体验上看，LangChain 1.x 更像面向应用开发者的高层框架，入口通常是 <code>create_agent</code>；而 LangGraph 更像一层执行运行时，负责把节点、状态和边组织成一个真正可执行、可持久化、可恢复的图。</p>\n      <p>两者不是替代关系。更自然的理解是：LangChain 提供更好用的 Agent 抽象，LangGraph 提供更细粒度的流程控制能力。对于普通问答、工具调用或结构比较直接的 Agent，LangChain 往往已经够用；但一旦进入复杂工作流、任务拆解、审批、中断恢复、长期运行这些场景，LangGraph 会更合适。</p>\n      <p>这一层定位差异也解释了为什么很多 Agent 框架最终都会往运行时能力靠拢。真正难的不是让模型输出一段文字，而是让一个任务在复杂条件下稳定地跑完整个流程。</p>\n\n      <h2 id=\"graph-basics\">2. 图的基本组成</h2>\n      <p>LangGraph 的核心抽象并不复杂，主要就是三个词：<strong>State、Node、Edge</strong>。</p>\n      <p><strong>State</strong> 是共享状态，承载图运行过程中的上下文、中间结果和后续节点要消费的数据。<strong>Node</strong> 是执行单元，通常就是一个函数，负责读取当前状态并返回局部更新。<strong>Edge</strong> 则定义节点之间如何流转，既可以是固定顺序，也可以根据状态动态决定下一步。</p>\n      <p>如果用最简单的话描述，一个 LangGraph 程序本质上是在回答三件事：<strong>当前有哪些状态、每个节点做什么、执行完以后往哪里走</strong>。</p>\n\n      <h2 id=\"superstep\">3. 图是怎么运行起来的</h2>\n      <p>LangGraph 的底层运行思想借鉴了 Pregel 模型，执行单位通常可以理解成一轮一轮推进的 <strong>Superstep</strong>。每一轮大致会经历三个阶段：先根据当前状态和边关系做计划，决定哪些节点应该被触发；再执行这一轮被激活的节点；最后把所有节点返回的局部更新统一合并进状态，形成新的状态快照，供下一轮继续使用。</p>\n      <p>这个执行模型有两个很重要的含义。第一，节点只返回“我这一步产生了什么变化”，而不是直接粗暴改全局对象。第二，并行节点通常基于同一轮开始时的状态快照计算，中间结果会在本轮结束后统一提交。这让复杂工作流的行为更稳定，也更容易解释。</p>\n\n      <h2 id=\"graph-api-vs-functional-api\">4. Graph API 与 Functional API</h2>\n      <p>LangGraph 提供两套主要写法。<strong>Graph API</strong> 是显式声明 State、Node 和 Edge 的图式写法，适合复杂流程、可视化需求、多条件分支和长期维护。<strong>Functional API</strong> 则更接近普通 Python 函数流程，用 <code>@entrypoint</code> 和 <code>@task</code> 组织执行，更适合已有过程式代码做轻量改造。</p>\n      <p>如果是从零开始学习，我更倾向于先把 Graph API 吃透。因为它最直接地暴露了 LangGraph 的核心思维方式：状态如何流动、节点如何被调度、边如何决定流程。等这套心智模型清楚之后，再看 Functional API 会轻松很多。</p>\n\n      <h2 id=\"build-first-graph\">5. 一个最小可运行图</h2>\n      <p>构建一个最小图的步骤很固定：先定义全局状态，再创建 <code>StateGraph</code>，然后声明节点、添加节点、连接边，最后调用 <code>compile()</code> 得到可执行图。</p>\n      <pre><code>class OverAllState(TypedDict):\n    logs: list[str]\n    cur_id: str\n\nbuilder = StateGraph(state_schema=OverAllState)\nbuilder.add_node(\"node_1\", node_1)\nbuilder.add_node(\"node_2\", node_2)\nbuilder.add_edge(START, \"node_1\")\nbuilder.add_edge(\"node_1\", \"node_2\")\nbuilder.add_edge(\"node_2\", END)\n\ngraph = builder.compile()</code></pre>\n      <p>这类最小示例看起来朴素，但非常适合用来理解整个运行时的行为。尤其是当后面引入条件分支、并行执行、检查点和中断时，你会发现所有复杂能力其实都是在这个骨架上叠加出来的。</p>\n\n      <h2 id=\"control-flow\">6. 控制流：顺序、分支与结束语义</h2>\n      <p>在控制流层面，最基础的接口是 <code>add_edge</code>。只要会连边，就能搭出顺序执行、分支和循环。对于简单线性流程，也可以使用 <code>add_sequence</code>，它会自动把一串节点按顺序连起来。</p>\n      <p>一个很容易被忽略的细节是，<code>END</code> 更像终止语义，而不是真正执行的普通节点。也就是说，某些简单流程里，就算不显式连到 <code>END</code>，只要最后没有后续节点被触发，图也会自然结束。但为了可读性和维护性，显式写出终点通常还是更清楚。</p>\n      <p>相对地，<code>START</code> 往往不能省略。因为它不只是一个标签，而是真正告诉运行时“从哪里开始调度”的入口。</p>\n\n      <h2 id=\"persistence\">7. 持久化与可恢复执行</h2>\n      <p>这一部分是 LangGraph 和很多普通工作流封装相比最有辨识度的地方。所谓 <strong>Durable Execution</strong>，本质上就是在执行过程中保存关键状态，使任务在中断、失败或等待外部输入后可以继续运行，而不是从头再来。</p>\n      <p>LangGraph 的持久化体系围绕几个关键词展开：<strong>Checkpoint</strong> 负责保存状态快照，<strong>Checkpointer</strong> 负责把这些检查点落到某个后端里，<strong>thread_id</strong> 用于区分不同会话或执行线，开发者平时看到的则通常是基于检查点封装出来的 <strong>StateSnapshot</strong> 视图。</p>\n      <p>最常见的启用方式有两步：编译图时传入一个检查点存储器；调用图时提供带有 <code>thread_id</code> 的配置对象。这样同一个线程里的多次调用就会共享一条持久化执行线。</p>\n      <pre><code>checkpointer = InMemorySaver()\ngraph = builder.compile(checkpointer=checkpointer)\n\nconfig = {\"configurable\": {\"thread_id\": \"demo-thread\"}}\ngraph.invoke(inputs, config=config)</code></pre>\n      <p>开发和学习阶段，<code>InMemorySaver</code> 基本够用；真正需要跨进程、跨服务保存状态时，再换成 SQLite、PostgreSQL、MongoDB 或 Redis 这类后端实现。理解上可以抓住一句话：<strong>Persistence 是基础，Durable Execution 是建立在它之上的运行能力</strong>。</p>\n\n      <h2 id=\"durable-scenarios\">8. 可恢复执行适合什么场景</h2>\n      <p>从实际应用看，持久化和可恢复执行至少支持四类典型能力：多轮会话共享历史、中断后恢复、失败后继续、以及基于历史检查点做 time travel、回放和分叉。这些能力叠在一起之后，LangGraph 才不只是“一个会调用函数的图”，而更像真正的任务运行时。</p>\n      <p>这对于 Agent 系统尤其关键。因为一旦任务链路变长，任何一步失败、等待审批或需要补充输入，都不应该逼着系统从第一步重做。否则模型再聪明，系统级体验也会非常差。</p>\n\n      <h2 id=\"interrupt\">9. 中断机制与 Human-in-the-Loop</h2>\n      <p>LangGraph 提供了两类中断。<strong>动态中断</strong> 通过在节点里调用 <code>interrupt()</code> 实现，是业务逻辑的一部分；<strong>静态中断</strong> 则通过 <code>interrupt_before</code> 和 <code>interrupt_after</code> 这类参数在运行前设置，更偏调试用途。</p>\n      <p>动态中断非常适合实现人在环。图执行到某个位置时先暂停，把需要人类确认的信息暴露给调用方；等用户给出反馈后，再通过 <code>Command(resume=...)</code> 把结果送回图里继续执行。恢复后，传给 <code>resume</code> 的内容会作为 <code>interrupt()</code> 的返回值参与后续逻辑。</p>\n      <pre><code>def approve_node(state):\n    decision = interrupt(\"是否同意继续执行？\")\n    return {\"approved\": decision}\n\nresume_res = graph.invoke(Command(resume=True), config=config)</code></pre>\n      <p>在学习笔记里，这部分还整理了几种常见模式，比如基础 HITL、并行中断、审批模式、审核编辑模式、工具执行前审批、单节点串行中断以及人类输入校验。它们背后其实是同一件事：<strong>让图在关键时刻停下来，并且能在拿到外部反馈后有状态地继续跑</strong>。</p>\n\n      <h2 id=\"streaming\">10. 流式执行</h2>\n      <p>除了最终 <code>invoke</code> 一次性返回结果，LangGraph 还支持在执行过程中持续吐出状态变化和事件，这就是流式执行。同步场景用 <code>stream()</code>，异步场景用 <code>astream()</code>，两者的语义基本一致。</p>\n      <p>流式输出的关键在于 <code>stream_mode</code>。常见模式包括：<code>values</code> 输出每个超步后的完整状态，<code>updates</code> 输出节点产生的增量更新，<code>messages</code> 输出消息流式增量，<code>checkpoints</code> 用于观察检查点，<code>tasks</code> 用于追踪任务级事件，<code>debug</code> 偏调试封装，<code>custom</code> 则允许节点主动写自定义事件。</p>\n      <pre><code>for chunk in graph.stream(\n    {\"initial_state\": \"初始状态\"},\n    stream_mode=[\"values\", \"updates\"],\n):\n    print(chunk)</code></pre>\n      <p>这套能力在产品侧很有用。因为很多时候我们并不只想要最终答案，而是想知道任务跑到哪一步、哪些节点已经完成、状态是否更新、模型有没有开始输出、检查点有没有保存成功。流式执行让这些过程变得可观测。</p>\n\n      <h2 id=\"learning-route\">11. 我的学习顺序建议</h2>\n      <p>如果是刚接触 LangGraph，我会建议按下面这个顺序学：先从最小图理解 State、Node、Edge 和 Superstep；再看控制流，把顺序、条件分支和循环跑明白；然后再进持久化和 <code>thread_id</code>；理解这些之后，再去看中断恢复、人在环和流式执行。</p>\n      <p>换句话说，不要一上来就扑到最炫的 Agent Demo 上。LangGraph 真正值得学的，不是“图能不能跑”，而是它为什么能在复杂场景里跑得更稳、更可控、更可恢复。</p>\n\n      <h2 id=\"closing\">12. 小结</h2>\n      <p>回看这几份笔记，LangGraph 最打动我的地方不是语法，而是它把 Agent 系统里那些经常被忽略的运行时问题摆到了台面上：状态怎么共享、流程怎么显式表达、异常怎么恢复、人工怎么介入、执行过程怎么观测。这些问题一旦开始认真处理，Agent 才真正从“会回答”变成“能稳定做事”。</p>\n      <p>所以如果把 LangChain 看成一个更友好的 Agent 开发入口，那 LangGraph 更像是让这些 Agent 具备工程韧性的底层骨架。等基础打牢之后，再回头看更复杂的多 Agent、工作流编排和 Harness 设计，会顺很多。</p>"
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
