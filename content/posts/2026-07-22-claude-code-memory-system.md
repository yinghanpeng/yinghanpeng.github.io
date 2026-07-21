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
对话持续进行时，系统启动独立后台子 Agent，持续维护一份结构化文件 sessionmemory.md。

当 Token 到达阈值，系统丢弃早期老旧聊天记录，直接把提前写好的 sessionmemory.md 放进上下文，不需要临时生成摘要，信息完整性更高。

压缩边界智能算法：
calculateMessageToKeepIndex 算法自动计算：
不能随便一刀切断历史。

calculateMessageToKeepIndex内部核心执行逻辑（源码逻辑）
1. 基线计算
统计当前全部消息总 Token；设定目标区间：保留消息 Token 不得低于最小值、不超过最大预算。先初步算出一个理论切割位置。

2. 边界修正（最关键逻辑）
从初步切割点向后 / 向前滑动查找：
- 不能拆分 tool_use ↔ tool_result 配对；
- 不能切断连续的 thinking 思考片段；
- 保证切割边界落在完整的消息分组间隙。

3. 约束兜底
- 不能回退到上一轮压缩边界之前（防止无限保留历史、持续膨胀）；
- 保证新产生的任务交互有足够上下文空间。

4. 输出结果 keepIndex
所有下标≥keepIndex 的消息保留；小于 keepIndex 的旧消息丢弃，并用 sessionmemory.md 会话笔记替代被删掉的历史。

## 休眠重塑记忆（AutoDream）
### 1. 双重触发门槛
两个条件必须同时满足
① 距离上一次整理，间隔 ≥ 24 小时
② 这段时间累计产生至少 5 次新对话
避免频繁整理消耗资源。

### 2. 标准四阶段整理流程
Orient → Gather → Consolidate → Prune Index
- Orient：扫描所有长期记忆文件，看看现在一共有哪些知识；
- Gather：读取近期新增记忆，对比当前项目真实状态，识别过时内容；
- Consolidate
  - 重复信息合并；
  - 把模糊的「下周三」这类相对日期强制转为绝对日期（2026-07-29）；
  - 互相冲突、已经失效的旧记忆直接删除，不是标记作废；
- Prune Index：更新总索引文件 MEMORY.md，严格控制在 200 行 / 25KB 上限，清理冗余条目。

### 3. 多进程锁机制（工程细节）
可能同时打开多个 Claude Code 窗口，防止多个进程同时启动「做梦整理」，造成文件读写冲突：
- 使用锁文件，记录当前执行进程 PID；
- CAS 校验：防止争抢锁；
- 如果整理中途异常崩溃，自动回滚锁文件时间戳，保证下次条件达标可以再次触发整理。

### 四阶段流程
Orient → Gather → Consolidate → Prune Index、相对日期转绝对、直接删除矛盾过时记忆、`MEMORY.md` 裁剪约束。

### 多进程锁机制
PID CAS 校验、失败回滚文件时间戳，和源码 `autoDream.ts` 逻辑 1:1 对应。