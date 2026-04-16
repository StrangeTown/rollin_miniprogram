/**
 * Build a unified item array that includes both oral-structures and scenario sentences.
 * Scenario sentences are converted to the same shape: { id, structure, examples }.
 */
const structures = require('../data/oral-structures-all.js')
const scenarioIndex = require('../data/scenarios/index.js')

let _allItems = null

function getAllPracticeItems() {
  if (_allItems) return _allItems

  const items = structures.slice()

  scenarioIndex.forEach(function (entry) {
    try {
      const scenarioData = require('../data/scenarios/' + entry.id + '.js')
      var sentences = scenarioData.sentences || []
      sentences.forEach(function (s) {
        items.push({
          id: s.id,
          structure: s.zh,
          examples: [{ en: s.en, zh: s.zh }],
          _scenario: entry.name
        })
      })
    } catch (e) {
      // skip broken scenario files
    }
  })

  _allItems = items
  return _allItems
}

module.exports = { getAllPracticeItems }
