const STORAGE_KEY = 'oral_practice_progress'

function getProgress() {
  return wx.getStorageSync(STORAGE_KEY) || []
}

function markPracticed(id) {
  const progress = getProgress()
  if (!progress.includes(id)) {
    progress.push(id)
    wx.setStorageSync(STORAGE_KEY, progress)
  }
}

function getStats(total) {
  const practiced = getProgress().length
  return {
    total: total,
    practiced: practiced,
    remaining: total - practiced
  }
}

function resetProgress() {
  wx.removeStorageSync(STORAGE_KEY)
}

module.exports = {
  getProgress,
  markPracticed,
  getStats,
  resetProgress
}
