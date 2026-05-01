---
description: "为 oral-structures-wechat.js 追加公众号语块数据：按给定句子查重、生成 examples、顺延 id"
agent: "agent"
argument-hint: "输入若干英文句子，每行一句"
---

根据用户提供的英文句子，为 [oral-structures-wechat.js](../data/oral-structures-wechat.js) 追加完整数据。

## 输入

- 用户会提供若干英文句子，每行一句
- [oral-structures-wechat.js](../data/oral-structures-wechat.js) — 公众号语块库正式数据文件

## 执行步骤

1. 读取 [oral-structures-wechat.js](../data/oral-structures-wechat.js)，确认：
   - 所有已存在的 `structure`
   - 当前最大 `id`
   - 现有对象的引号、逗号、缩进风格
2. 对用户提供的句子逐条做标准化后查重：
   - 忽略首尾空格
   - 忽略大小写差异
   - 忽略句末标点差异（如 `.`, `?`, `!`）
   - 语义或模板本质相同的句子视为重复，不重复追加
3. 只为“缺失项”生成完整对象：
   - `structure` 使用用户提供的句子
   - 每条固定生成 3 条 `examples`
   - 英文要自然、口语化、简洁
   - 中文要准确对应，不要书面化
   - 三条 examples 之间要有明显变化
4. `id` 从当前最大值连续递增，不跳号
5. 将新对象追加到 [oral-structures-wechat.js](../data/oral-structures-wechat.js) 末尾，不修改已有数据
6. 如果用户提供的句子全部已存在：
   - 不修改文件
   - 明确告诉用户哪些句子已存在
7. 写入后确认新增条目顺序、`id` 连续性和文件格式都正确

## 数据格式要求

每条对象结构必须与现有文件完全一致：

```js
{
  id: 'b2c3d4e5-2001',
  structure: 'Maybe later.',
  examples: [
    { en: 'Do you want some coffee? Maybe later.', zh: '你想喝点咖啡吗？等会儿吧。' },
    { en: 'Can we talk now? Maybe later.', zh: '我们现在聊吗？晚点吧。' },
    { en: 'I am busy right now. Maybe later.', zh: '我现在有点忙，晚一点吧。' }
  ]
}
```

## 写入前检查清单

- [ ] 仅处理用户本次提供的句子
- [ ] 已有句子不重复追加
- [ ] 每条新增数据都包含 `id`、`structure`、`examples`
- [ ] 每条 `examples` 正好 3 条，且每条都含 `en` 和 `zh`
- [ ] `id` 连续递增，无跳号
- [ ] 文件缩进、引号、逗号风格与现有 JS 文件一致

## 写入后输出

完成后用简洁方式告诉用户：

- 本次新增了哪些句子
- 哪些句子因已存在而被跳过
- 新增条目的 `id` 范围

## 清理

如果执行过程中创建了临时文件，任务结束前必须删除。