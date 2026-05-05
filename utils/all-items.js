/**
 * Build a unified item array that includes both oral-structures and full-sentence groups
 * (scenarios + other sentence-groups). Sentences are converted to the same shape:
 * { id, structure, examples }.
 */
const structures = require('../data/oral-structures.js')
const sentenceLibrary = require('../data/sentence-library/index.js')

let _allItems = null

function getAllPracticeItems() {
  if (_allItems) return _allItems

  const items = structures.slice()

  sentenceLibrary.forEach(function (group) {
    var source = group.source
    var groupItems = group.items || []
    groupItems.forEach(function (entry) {
      try {
        var data = source === 'others'
          ? require('../data/sentence-library/others/' + entry.id + '.js')
          : require('../data/sentence-library/scenarios/' + entry.id + '.js')
        var sentences = data.sentences || []
        sentences.forEach(function (s) {
          items.push({
            id: s.id,
            structure: s.zh,
            examples: [{ en: s.en, zh: s.zh }],
            _scenario: entry.name
          })
        })
      } catch (e) {
        // skip broken files
      }
    })
  })

  _allItems = items
  return _allItems
}

module.exports = { getAllPracticeItems }
