function formatTime(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr.replace("+08:00", ""));
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const d = date.getDate().toString().padStart(2, "0");
  const h = date.getHours().toString().padStart(2, "0");
  const min = date.getMinutes().toString().padStart(2, "0");
  return `${m}-${d} ${h}:${min}`;
}

module.exports = {
  formatTime
};
