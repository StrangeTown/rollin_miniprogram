const {
  loadStructures,
  normalizeStructure,
  parseStructuredId,
  readTxtStructures
} = require('./oral-structures-helpers')

function assert(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

function main() {
  const structures = loadStructures()
  assert(structures.length > 0, 'data/oral-structures.js must not be empty.')

  const parsedIds = structures.map(item => parseStructuredId(item.id))
  const prefix = parsedIds[0].prefix
  const ids = new Set()
  const normalizedStructures = new Set()

  structures.forEach((item, index) => {
    assert(parsedIds[index].prefix === prefix, `Id prefix mismatch at item #${index + 1}.`)
    assert(!ids.has(item.id), `Duplicate id found: ${item.id}`)
    ids.add(item.id)

    assert(typeof item.structure === 'string' && item.structure.trim(), `Missing structure at item #${index + 1}.`)
    const normalized = normalizeStructure(item.structure)
    assert(!normalizedStructures.has(normalized), `Duplicate structure found: ${item.structure}`)
    normalizedStructures.add(normalized)

    assert(Array.isArray(item.examples) && item.examples.length === 3, `Item ${item.id} must have exactly 3 examples.`)
    item.examples.forEach((example, exampleIndex) => {
      assert(example && typeof example === 'object' && !Array.isArray(example), `Item ${item.id} example #${exampleIndex + 1} must be an object.`)
      assert(typeof example.en === 'string' && example.en.trim(), `Item ${item.id} example #${exampleIndex + 1} en must be non-empty.`)
      assert(typeof example.zh === 'string' && example.zh.trim(), `Item ${item.id} example #${exampleIndex + 1} zh must be non-empty.`)
    })

    if (index > 0) {
      assert(parsedIds[index].number === parsedIds[index - 1].number + 1, `Id sequence gap before ${item.id}.`)
    }
  })

  const txtStructures = readTxtStructures()
  const jsStructures = structures.map(item => item.structure)
  assert(JSON.stringify(txtStructures) === JSON.stringify(jsStructures), 'data/oral-structures.txt is out of sync with data/oral-structures.js.')

  console.log(`Validated ${structures.length} oral structures.`)
  console.log(`Id range: ${structures[0].id} -> ${structures[structures.length - 1].id}`)
  console.log('data/oral-structures.txt is in sync.')
}

try {
  main()
} catch (error) {
  console.error(error.message)
  process.exit(1)
}