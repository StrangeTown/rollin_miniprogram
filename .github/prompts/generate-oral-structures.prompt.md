---
description: "为 oral-structures.js 新增 20 条口语结构数据，自动查重、生成 examples、更新 txt 索引"
agent: "agent"
argument-hint: "可选：指定新增条数，默认 20"
---

为 `oral-structures.js` 新增 20 条完整的口语结构数据。

## 输入文件

- [oral-structures.txt](../data/oral-structures.txt) — 所有已存在的 structure，仅用于查重
- [oral-structures.js](../data/oral-structures.js) — 正式数据文件，新数据追加到末尾

## 执行步骤

1. 读取 `oral-structures.txt`，提取并确认所有已有 structure
2. 读取 `oral-structures.js`，确认当前最大 `id`
3. 生成 20 条候选 structure，逐条执行去重检查：
   - 忽略大小写、首尾空格、末尾标点差异
   - 表达模板本质相同或过于接近视为重复，替换直到得到 20 条有效项
   - 必须保持与现有数据一致的口语风格和难度
4. 为每条有效 structure 生成完整对象（含 3 条 examples）
5. id 从当前最大值连续递增，不跳号
6. 写入前核对检查清单，通过后再写文件
7. 将 20 条对象追加到 `oral-structures.js` 末尾，不得修改已有数据
8. 将 20 条 structure 逐行追加到 `oral-structures.txt` 末尾，顺序与 JS 一致，不得修改已有数据

## 数据格式要求

每条对象结构与现有数据完全一致：

```js
{
  id: 101,
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
- 保持现有文件的缩进、逗号、引号风格

## 写入前检查清单

- [ ] 新增数据正好 20 条
- [ ] 所有 structure 不在 oral-structures.txt 中
- [ ] 没有明显近似重复项
- [ ] 每条含 `id`、`structure`、`examples`
- [ ] 每条 examples 正好 3 条，每条含 `en` 和 `zh`
- [ ] id 连续递增，无跳号
- [ ] 格式与现有 JS 文件一致

## 写入后确认

- [ ] oral-structures.js 已成功追加 20 条新数据
- [ ] oral-structures.txt 已同步追加本次新增的全部 structure
- [ ] 两个文件中新增顺序一致

## 清理

如果执行过程中在 `/tmp` 或其他路径创建了任何临时脚本文件，必须在任务完成后立即删除，不得遗留在系统中。
