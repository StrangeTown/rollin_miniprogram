const fs = require('fs')
const path = require('path')

const ROOT_DIR = path.resolve(__dirname, '..')
const JS_PATH = path.join(ROOT_DIR, 'data', 'oral-structures.js')
const TXT_PATH = path.join(ROOT_DIR, 'data', 'oral-structures.txt')

const STOPWORDS = new Set([
  'a', 'an', 'the', 'am', 'are', 'as', 'at', 'be', 'but', 'by', 'for', 'from',
  'he', 'her', 'hers', 'him', 'his', 'i', 'if', 'in', 'is', 'it', 'its', 'me',
  'my', 'of', 'on', 'or', 'our', 'ours', 'she', 'that', 'their', 'theirs',
  'them', 'they', 'this', 'to', 'us', 'was', 'we', 'were', 'with', 'you',
  'your', 'yours'
])

function loadStructures() {
  delete require.cache[require.resolve(JS_PATH)]
  const data = require(JS_PATH)
  if (!Array.isArray(data)) {
    throw new Error('data/oral-structures.js must export an array.')
  }
  return data
}

function readJsSource() {
  return fs.readFileSync(JS_PATH, 'utf8')
}

function writeJsSource(content) {
  fs.writeFileSync(JS_PATH, content)
}

function readTxtStructures() {
  if (!fs.existsSync(TXT_PATH)) {
    return []
  }

  return fs.readFileSync(TXT_PATH, 'utf8').split(/\r?\n/).filter(Boolean)
}

function writeTxtStructures(structures) {
  const content = structures.map(item => item.structure).join('\n') + '\n'
  fs.writeFileSync(TXT_PATH, content)
}

function normalizeStructure(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[.?!,;:，。！？；：'"`~…]+$/g, '')
}

function comparableStructure(value) {
  return normalizeStructure(value)
    .replace(/\.{3,}/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .split(' ')
    .filter(token => token && !STOPWORDS.has(token))
}

function maybeNearDuplicate(left, right) {
  const leftTokens = comparableStructure(left)
  const rightTokens = comparableStructure(right)

  if (leftTokens.length < 2 || rightTokens.length < 2) {
    return false
  }

  const leftSet = new Set(leftTokens)
  const rightSet = new Set(rightTokens)
  let shared = 0

  leftSet.forEach(token => {
    if (rightSet.has(token)) {
      shared += 1
    }
  })

  return shared >= 2 && shared === Math.min(leftSet.size, rightSet.size)
}

function parseStructuredId(id) {
  const match = /^(.*-)(\d+)$/.exec(String(id || ''))
  if (!match) {
    throw new Error(`Invalid structure id: ${id}`)
  }

  return {
    prefix: match[1],
    number: Number(match[2])
  }
}

function getIdSeed(structures) {
  if (!structures.length) {
    return { prefix: 'a1b2c3d4-', number: 1000 }
  }

  return parseStructuredId(structures[structures.length - 1].id)
}

function escapeJsString(value) {
  return String(value)
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\r/g, '\\r')
    .replace(/\n/g, '\\n')
}

function formatStructureEntry(entry) {
  return [
    '  {',
    `    id: '${escapeJsString(entry.id)}',`,
    `    structure: '${escapeJsString(entry.structure)}',`,
    '    examples: [',
    ...entry.examples.map(example => `      { en: '${escapeJsString(example.en)}', zh: '${escapeJsString(example.zh)}' },`),
    '    ]',
    '  }'
  ].join('\n')
}

function appendStructuresToJs(entries) {
  const source = readJsSource().replace(/\s+$/g, '')
  if (!source.endsWith(']')) {
    throw new Error('Unexpected data/oral-structures.js format: file must end with ].')
  }

  const block = entries.map(formatStructureEntry).join(',\n')
  const nextSource = source.replace(/\n\]$/, ',\n' + block + '\n]') + '\n'
  writeJsSource(nextSource)
}

function ensureString(value, label) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`${label} must be a non-empty string.`)
  }

  return value.trim()
}

function validateCandidateItem(item, index) {
  if (!item || typeof item !== 'object' || Array.isArray(item)) {
    throw new Error(`Candidate #${index + 1} must be an object.`)
  }

  if (item.id !== undefined) {
    throw new Error(`Candidate #${index + 1} must not include id; ids are assigned automatically.`)
  }

  const structure = ensureString(item.structure, `Candidate #${index + 1} structure`)
  if (!Array.isArray(item.examples) || item.examples.length !== 3) {
    throw new Error(`Candidate #${index + 1} must have exactly 3 examples.`)
  }

  const examples = item.examples.map((example, exampleIndex) => {
    if (!example || typeof example !== 'object' || Array.isArray(example)) {
      throw new Error(`Candidate #${index + 1} example #${exampleIndex + 1} must be an object.`)
    }

    return {
      en: ensureString(example.en, `Candidate #${index + 1} example #${exampleIndex + 1} en`),
      zh: ensureString(example.zh, `Candidate #${index + 1} example #${exampleIndex + 1} zh`)
    }
  })

  return { structure, examples }
}

function readJsonInput(filePath) {
  const raw = filePath
    ? fs.readFileSync(path.resolve(process.cwd(), filePath), 'utf8')
    : fs.readFileSync(0, 'utf8')

  let parsed
  try {
    parsed = JSON.parse(raw)
  } catch (error) {
    throw new Error(`Invalid JSON input: ${error.message}`)
  }

  if (!Array.isArray(parsed)) {
    throw new Error('Input JSON must be an array.')
  }

  return parsed
}

module.exports = {
  JS_PATH,
  TXT_PATH,
  appendStructuresToJs,
  getIdSeed,
  loadStructures,
  maybeNearDuplicate,
  normalizeStructure,
  parseStructuredId,
  readJsonInput,
  readTxtStructures,
  validateCandidateItem,
  writeTxtStructures
}