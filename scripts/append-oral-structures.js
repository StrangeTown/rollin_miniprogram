const {
  appendStructuresToJs,
  getIdSeed,
  loadStructures,
  maybeNearDuplicate,
  normalizeStructure,
  readJsonInput,
  validateCandidateItem,
  writeTxtStructures
} = require('./oral-structures-helpers')

function parseArgs(argv) {
  let dryRun = false
  let filePath = ''

  argv.forEach(arg => {
    if (arg === '--dry-run') {
      dryRun = true
      return
    }

    if (!filePath) {
      filePath = arg
      return
    }

    throw new Error(`Unexpected argument: ${arg}`)
  })

  return { dryRun, filePath }
}

function main() {
  const { dryRun, filePath } = parseArgs(process.argv.slice(2))
  const existing = loadStructures()
  const rawCandidates = readJsonInput(filePath)
  const candidates = rawCandidates.map(validateCandidateItem)
  const existingStructures = existing.map(item => item.structure)
  const existingNormalized = new Set(existingStructures.map(normalizeStructure))
  const seen = new Set()

  candidates.forEach(item => {
    const normalized = normalizeStructure(item.structure)
    if (existingNormalized.has(normalized)) {
      throw new Error(`Duplicate structure against existing data: ${item.structure}`)
    }
    if (seen.has(normalized)) {
      throw new Error(`Duplicate structure inside input: ${item.structure}`)
    }
    seen.add(normalized)
  })

  const warnings = []
  candidates.forEach(item => {
    const similarExisting = existingStructures.find(existingStructure => maybeNearDuplicate(item.structure, existingStructure))
    if (similarExisting) {
      warnings.push({ structure: item.structure, similarTo: similarExisting })
    }
  })

  const { prefix, number } = getIdSeed(existing)
  const appended = candidates.map((item, index) => ({
    id: `${prefix}${number + index + 1}`,
    structure: item.structure,
    examples: item.examples
  }))

  if (dryRun) {
    console.log(`Dry run: would append ${appended.length} structures.`)
    console.log(`Id range: ${appended[0].id} -> ${appended[appended.length - 1].id}`)
    if (warnings.length) {
      console.log('Manual review warnings:')
      warnings.forEach(item => {
        console.log(`- ${item.structure}  ~  ${item.similarTo}`)
      })
    }
    return
  }

  appendStructuresToJs(appended)
  writeTxtStructures(existing.concat(appended))

  console.log(`Appended ${appended.length} structures.`)
  console.log(`Id range: ${appended[0].id} -> ${appended[appended.length - 1].id}`)
  console.log('Synced data/oral-structures.txt from data/oral-structures.js.')

  if (warnings.length) {
    console.log('Manual review warnings:')
    warnings.forEach(item => {
      console.log(`- ${item.structure}  ~  ${item.similarTo}`)
    })
  }
}

try {
  main()
} catch (error) {
  console.error(error.message)
  process.exit(1)
}