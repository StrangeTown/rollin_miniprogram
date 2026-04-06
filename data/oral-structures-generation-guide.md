# Oral Structures Generation Instructions

## Task

为 `oral-structures.js` 新增 20 条完整的口语结构数据。

## Input Files

- `oral-structures.txt`
  - 包含所有已存在的 `structure`
  - 仅用于查重
- `oral-structures.js`
  - 正式数据文件
  - 新数据必须追加到文件末尾

## Required Output

新增的每条数据必须包含以下字段：

- `id`
- `structure`
- `examples`

其中：

- `examples` 必须固定为 3 条
- 每条 example 必须包含：
  - `en`
  - `zh`

## Rules

### Structure Rules

- 必须是新的口语结构
- 不得与 `oral-structures.txt` 中已有 `structure` 重复
- 不得只通过大小写变化制造新项
- 不得只通过标点变化制造新项
- 不得只做非常轻微的改写来制造近似重复项
- 必须保持与现有数据一致的口语风格和难度

### Example Rules

- 每条数据必须有 3 条 example
- 英文句子要自然、口语化、简洁
- 中文翻译要与英文准确对应
- 三条例句之间要有明显变化
- 不要使用过于书面化或生硬的表达

### ID Rules

- `id` 必须在现有最大值基础上继续递增
- 不得复用已有 `id`
- 不得跳号或打乱顺序
- 必须先从 `oral-structures.js` 读取当前最后一个 `id` 或当前最大 `id`，再生成新 `id`

### File Update Rules

- 只允许在 `oral-structures.js` 末尾追加新数据
- 在完成 `oral-structures.js` 更新后，必须同步更新 `oral-structures.txt`
- `oral-structures.txt` 需要追加本次新增的全部 `structure`
- `oral-structures.txt` 中新增的 `structure` 顺序必须与追加到 `oral-structures.js` 中的顺序一致
- 不要修改已有数据
- 保持现有缩进、逗号、引号和整体格式一致

## Deduplication Procedure

在生成前，先读取 `oral-structures.txt`，将其中所有 `structure` 视为已存在项。

在判断是否重复时，按以下规则处理：

1. 忽略大小写
2. 忽略首尾空格
3. 忽略末尾标点差异，例如 `...`、`.`、`?`、`!`
4. 如果表达模板本质相同或过于接近，视为重复，不生成

## Execution Procedure

1. 读取 `oral-structures.txt`
2. 提取并确认所有已有 `structure`
3. 读取 `oral-structures.js`，确认当前最后一个 `id` 或当前最大 `id`
4. 生成候选的 20 条新 `structure`
5. 对候选 `structure` 逐条执行去重检查
6. 如果有重复或近似重复，替换为新的候选项，直到得到 20 条有效 `structure`
7. 为这 20 条有效 `structure` 生成完整对象
8. 为每条对象补全 3 条 examples
9. 按当前最大 `id` 继续生成新的连续 `id`
10. 先检查新增对象本身是否满足全部写入条件
11. 将这 20 条完整对象追加到 `oral-structures.js` 末尾
12. 将这 20 条新增的 `structure` 逐行追加到 `oral-structures.txt` 末尾

## Final Check Before Writing JS

写入 `oral-structures.js` 之前，必须确认：

- 新增数据正好 20 条
- 所有 `structure` 都不在 `oral-structures.txt` 中
- 没有明显近似重复项
- 每条数据都包含 `id`、`structure`、`examples`
- 每条数据都正好有 3 条 examples
- 每条 example 都包含 `en` 和 `zh`
- `id` 连续递增
- 输出格式与现有 JS 文件保持一致

## Final Check After Writing Files

完成文件更新后，必须确认：

- `oral-structures.js` 已成功追加这 20 条新数据
- `oral-structures.txt` 已同步追加本次新增的全部 `structure`
- `oral-structures.txt` 中新增的顺序与 `oral-structures.js` 中新增数据的顺序一致