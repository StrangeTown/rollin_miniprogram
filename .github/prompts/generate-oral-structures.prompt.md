---
description: "为 oral-structures.js 新增口语结构数据，使用脚本自动查重、分配 id、校验并同步 txt 索引"
agent: "agent"
argument-hint: "可选：指定新增条数，默认 20"
---

为 `oral-structures.js` 新增 20 条完整的口语结构数据。

## 事实源

- [oral-structures.js](../data/oral-structures.js) — 唯一事实源；查重、最大 `id`、最终写入都以它为准
- [oral-structures.txt](../data/oral-structures.txt) — 由脚本自动从 JS 同步生成，仅供浏览，不要手工编辑

## 本地脚本

- `node scripts/check-oral-structure-candidates.js [candidate-file.json] --take=20`
  - 输入可为 JSON 数组：字符串数组，或带 `structure` 字段的对象数组
  - 也支持标准输入，这样可以避免创建临时文件
- `node scripts/append-oral-structures.js [candidate-file.json]`
  - 输入必须为完整对象数组：每项含 `structure` 和 `examples`
  - 脚本会自动做精确去重、分配连续 `id`、追加到 JS，并同步生成 TXT
  - 支持 `--dry-run`
- `node scripts/validate-oral-structures.js`
  - 校验结构完整性、`id` 连续性、examples 数量，以及 TXT 是否与 JS 同步
- `node scripts/sync-oral-structures-txt.js`
  - 仅在需要手动重建 TXT 时使用；平时由 append 脚本自动调用

## 推荐更快流程

1. 读取 [oral-structures.js](../data/oral-structures.js)，只用它来理解现有口语风格和难度；不要再把 TXT 当成查重真源
2. 先生成 30 条仅含 `structure` 的候选，而不是一开始就生成完整 examples
3. 运行 `node scripts/check-oral-structure-candidates.js ... --take=20`
   - 先自动筛掉和现有数据完全重复、以及候选内部重复的项
   - 只对脚本选出的 20 条再做人工近似复核
4. 只为最终 20 条有效 structure 生成完整对象（含 3 条 examples）
5. 将完整对象作为 JSON 数组传给 `node scripts/append-oral-structures.js ...`
   - 让脚本自动分配 `id`
   - 让脚本自动追加到 JS
   - 让脚本自动同步 TXT
6. 最后运行 `node scripts/validate-oral-structures.js`

## 数据格式要求

传给 append 脚本的每条对象结构如下，注意 **不要手写 `id`**：

```json
{
  structure: 'I was about to...',
  examples: [
    { en: 'I was about to leave when you called.', zh: '你打电话来的时候我正要走。' },
    { en: 'I was about to say the same thing.', zh: '我正要说同一件事。' },
    { en: 'I was about to give up, honestly.', zh: '说真的，我当时快放弃了。' }
  ]
}
```

- `examples` 固定 3 条，不多不少
- 英文：自然、口语化、简洁，三条之间有明显变化
- 中文：与英文准确对应，不要书面化
- `id` 由脚本自动分配，不要手工生成

## 传入脚本的方式

优先使用标准输入，避免临时文件：

```bash
node scripts/append-oral-structures.js <<'JSON'
[
  {
    "structure": "I was about to...",
    "examples": [
      { "en": "I was about to leave when you called.", "zh": "你打电话来的时候我正要走。" },
      { "en": "I was about to say the same thing.", "zh": "我正要说同一件事。" },
      { "en": "I was about to give up, honestly.", "zh": "说真的，我当时快放弃了。" }
    ]
  }
]
JSON
```

## 写入前检查清单

- [ ] 新增数据正好 20 条
- [ ] 所有 structure 不在 oral-structures.js 现有数据中
- [ ] 候选已先经过 `check-oral-structure-candidates.js` 精确去重
- [ ] 没有明显近似重复项
- [ ] 每条含 `structure`、`examples`
- [ ] 每条 examples 正好 3 条，每条含 `en` 和 `zh`
- [ ] 不手工编写 `id`，由 append 脚本自动分配

## 写入后确认

- [ ] `node scripts/append-oral-structures.js ...` 已成功执行
- [ ] `node scripts/validate-oral-structures.js` 已通过
- [ ] oral-structures.txt 已与 oral-structures.js 自动同步

## 清理

优先使用标准输入避免临时文件。如果执行过程中确实在 `/tmp` 或其他路径创建了候选 JSON 文件，任务完成后必须立即删除，不得遗留在系统中。
