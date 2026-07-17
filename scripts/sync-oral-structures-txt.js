const {
  loadStructures,
  readTxtStructures,
  writeTxtStructures
} = require('./oral-structures-helpers')

function main() {
  const checkOnly = process.argv.includes('--check')
  const structures = loadStructures()
  const expected = structures.map(item => item.structure)
  const current = readTxtStructures()
  const inSync = JSON.stringify(expected) === JSON.stringify(current)

  if (checkOnly) {
    if (!inSync) {
      console.error('data/oral-structures.txt is out of sync with data/oral-structures.js.')
      process.exit(1)
    }

    console.log('data/oral-structures.txt is in sync.')
    return
  }

  writeTxtStructures(structures)
  console.log(`Synced ${expected.length} structures to data/oral-structures.txt.`)
}

try {
  main()
} catch (error) {
  console.error(error.message)
  process.exit(1)
}