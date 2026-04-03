const HISTORY_KEY = 'drill_history'

function getDateKey(date = new Date()) {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

function getHistoryMap() {
  const history = wx.getStorageSync(HISTORY_KEY)
  if (!history || typeof history !== 'object' || Array.isArray(history)) {
    return {}
  }
  return history
}

function getPracticeIdsByDate(dateKey) {
  const history = getHistoryMap()
  const ids = history[dateKey]
  return Array.isArray(ids) ? ids : []
}

function getTodayPracticeIds() {
  return getPracticeIdsByDate(getDateKey())
}

function recordPractice(id) {
  const history = getHistoryMap()
  const dateKey = getDateKey()
  const ids = Array.isArray(history[dateKey]) ? history[dateKey].slice() : []

  if (ids.includes(id)) {
    return ids
  }

  ids.push(id)
  history[dateKey] = ids
  wx.setStorageSync(HISTORY_KEY, history)
  return ids
}

module.exports = {
  getDateKey,
  getHistoryMap,
  getPracticeIdsByDate,
  getTodayPracticeIds,
  recordPractice
}