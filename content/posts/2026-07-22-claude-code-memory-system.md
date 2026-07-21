## 指令记忆（CLAUDE.md 多层规则）

- 四层优先级（全局 managed → 用户 home → 项目 CLAUDE.md → 本地 claude.local.md）、就近文件优先级更高、`@include` 递归 5 层 + 循环检测、path 条件匹配 glob 规则、子目录嵌套规则自动加载全部属实。
- 双轨注入（CLAUDE.md 走 user 消息、系统行为规范独立 system prompt）是源码核心缓存设计，完全正确。

## 短期记忆

当前会话完整未压缩对话存在内存，会话销毁即清空，符合上下文窗口基础机制。

## 工作记忆

任务进度、偏移、流式投机响应状态等运行时临时变量，源码 QueryEngine 内置该内存区。

## 长期记忆（Auto Memory/meder 系统）

### 存储路径

`~/.claude/projects/`，基于 git 根目录标准化命名，worktree 共享同一份记忆目录，正确。

### 四类存储类型

- User：用户画像
- Feedback：正负反馈
- Project：项目约定
- References：外部链接

严格禁止存储可从代码推导的内容（架构、文件路径、git 记录）是源码硬性规则。

### 双层存储

`MEMORY.md` 索引（200 行 / 25KB 上限）+ 分类 md 记忆文件，front matter 元数据，完全匹配。

### 异步预取

MemSearch 旁路轻量模型筛选、最多召回 5 条、过滤重复 / 近期工具文档、自然语言时间提示 + 过期警告，全部属实。

### 每轮会话提取

每轮会话后台 fork 子代理 `extractMemories` 提取记忆、主代理手动写记忆时子代理跳过避免冲突、子代理读写分离两回合策略、工具权限沙箱限制，源码完全实现。

## 摘要记忆（Session Memory）

不等到上下文爆 Token 再临时生成摘要，全程后台维护 `sessionmemory.md` 会话笔记，压缩时直接复用；压缩边界算法保证 tool-use/tool result 成对完整、不破坏流式 thinking 片段，是源码解决 API 报错的核心方案，描述精准。

## 休眠重塑记忆（AutoDream 自动做梦）

### 双重触发门控

间隔 24h + 累计 5 次新会话，缺一不启动。

### 四阶段流程

Orient → Gather → Consolidate → Prune Index、相对日期转绝对、直接删除矛盾过时记忆、`MEMORY.md` 裁剪约束。

### 多进程锁机制

PID CAS 校验、失败回滚文件时间戳，和源码 `autoDream.ts` 逻辑 1:1 对应。
