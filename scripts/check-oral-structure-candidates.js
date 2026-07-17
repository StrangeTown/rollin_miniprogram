const {
  loadStructures,
  maybeNearDuplicate,
  normalizeStructure,
  readJsonInput
} = require('./oral-structures-helpers')

function parseArgs(argv) {
  let take = 20
  let filePath = ''

  argv.forEach(arg => {
    if (arg.startsWith('--take=')) {
      take = Number(arg.slice('--take='.length))
      return
    }

    if (!filePath) {
      filePath = arg
      return
    }

    throw new Error(`Unexpected argument: ${arg}`)
  })

  if (!Number.isInteger(take) || take <= 0) {
    throw new Error('--take must be a positive integer.')
  }

  return { filePath, take }
}

function extractStructure(item, index) {
  if (typeof item === 'string') {
    if (!item.trim()) {
      throw new Error(`Candidate #${index + 1} must not be empty.`)
    }
    return item.trim()
  }

  if (item && typeof item === 'object' && !Array.isArray(item) && typeof item.structure === 'string' && item.structure.trim()) {
    return item.structure.trim()
  }

  throw new Error(`Candidate #${index + 1} must be a string or an object with a non-empty structure field.`)
}

function main() {
  const { filePath, take } = parseArgs(process.argv.slice(2))
  const input = readJsonInput(filePath)
  const existingStructures = loadStructures().map(item => item.structure)
  const existingNormalized = new Set(existingStructures.map(normalizeStructure))
  const accepted = []
  const rejected = []
  const seen = new Set()

  input.forEach((item, index) => {
    const structure = extractStructure(item, index)
    const normalized = normalizeStructure(structure)

    if (existingNormalized.has(normalized)) {
      rejected.push({ structure, reason: 'duplicate-existing' })
      return
    }

    if (seen.has(normalized)) {
      rejected.push({ structure, reason: 'duplicate-input' })
      return
    }

    seen.add(normalized)
    accepted.push(structure)
  })

  const selected = accepted.slice(0, take)
  const warnings = []

  selected.forEach(structure => {
    const similarExisting = existingStructures.find(existing => maybeNearDuplicate(structure, existing))
    if (similarExisting) {
      warnings.push({ structure, similarTo: similarExisting, source: 'existing' })
    }
  })

  console.log(`Checked ${input.length} candidates.`)
  console.log(`Accepted exact-unique candidates: ${accepted.length}`)
  console.log(`Selected first ${Math.min(selected.length, take)} for next step:`)
  selected.forEach((structure, index) => {
    console.log(`${index + 1}. ${structure}`)
  })

  if (rejected.length) {
    console.log('')
    console.log('Rejected candidates:')
    rejected.forEach(item => {
      console.log(`- ${item.structure} (${item.reason})`)
    })
  }

  if (warnings.length) {
    console.log('')
    console.log('Manual review warnings:')
    warnings.forEach(item => {
      console.log(`- ${item.structure}  ~  ${item.similarTo} (${item.source})`)
    })
  }

  if (accepted.length < take) {
    console.error(`Need at least ${take} exact-unique candidates, but only ${accepted.length} passed.`)
    process.exit(1)
  }
}

try {
  main()
} catch (error) {
  console.error(error.message)
  process.exit(1)
}