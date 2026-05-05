---
description: "为 wechat-daily-reading.js 追加公众号整句数据：按给定句子查重、生成中文翻译、顺延 id"
agent: "agent"
argument-hint: "输入若干英文句子，每行一句"
---

根据用户提供的英文句子，为 [wechat-daily-reading.js](../../data/sentence-library/others/wechat-daily-reading.js) 追加完整的整句数据。

## 输入

- 用户会提供若干英文句子，每行一句
- [wechat-daily-reading.js](../../data/sentence-library/others/wechat-daily-reading.js) — 公众号整句数据文件

## 执行步骤

1. 读取 [wechat-daily-reading.js](../../data/sentence-library/others/wechat-daily-reading.js)，确认：
   - 所有已存在的 `en`
   - 当前最大 `id`（形如 `scn-wechat-013`）
   - 现有对象的引号、逗号、缩进风格
2. 对用户提供的句子逐条做标准化后查重：
   - 忽略首尾空格
   - 忽略大小写差异
   - 忽略句末标点差异（如 `.`, `?`, `!`）
   - 语义本质相同的句子视为重复，不重复追加
3. 只为“缺失项”生成完整对象：
   - `en` 使用用户提供的句子（保持原样）
   - `zh` 准确对应，自然口语化，不要书面化
4. `id` 在已有最大编号基础上连续递增（保持 `scn-wechat-NNN` 三位补零格式），不跳号
5. 将新对象追加到 `sentences` 数组末尾，不修改已有数据
6. 如果用户提供的句子全部已存在：
   - 不修改文件
   - 明确告诉用户哪些句子已存在
7. 写入后确认新增条目顺序、`id` 连续性和文件格式都正确

## 数据格式要求

每条对象结构必须与现有文件完全一致：

```js
{ id: 'scn-wechat-014', en: 'Take it easy.', zh: '别紧张，慢慢来。' }
```

## 写入前检查清单

- [ ] 仅处理用户本次提供的句子
- [ ] 已有句子不重复追加
- [ ] 每条新增数据都包含 `id`、`en`、`zh`
- [ ] `id` 连续递增，无跳号，保持三位补零
- [ ] 文件缩进、引号、逗号风格与现有 JS 文件一致

## 写入后输出

完成后用简洁方式告诉用户：

- 本次新增了哪些句子
- 哪些句子因已存在而被跳过
- 新增条目的 `id` 范围

## 清理

如果执行过程中创建了临时文件，任务结束前必须删除。
