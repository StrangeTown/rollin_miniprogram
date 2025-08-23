function formatTime(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr.replace("+08:00", ""));
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const d = date.getDate().toString().padStart(2, "0");
  const h = date.getHours().toString().padStart(2, "0");
  const min = date.getMinutes().toString().padStart(2, "0");
  return `${m}-${d} ${h}:${min}`;
}

function formatRelativeTime(dateStr) {
  if (!dateStr) return "";
  
  const date = new Date(dateStr.replace("+08:00", ""));
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  
  // Convert to different time units
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);
  
  if (diffYears > 0) {
    return `${diffYears}年前`;
  } else if (diffMonths > 0) {
    return `${diffMonths}个月前`;
  } else if (diffDays > 0) {
    return `${diffDays}天前`;
  } else if (diffHours > 0) {
    return `${diffHours}小时前`;
  } else if (diffMinutes > 0) {
    return `${diffMinutes}分钟前`;
  } else {
    return "刚刚";
  }
}

function formatTimeHourMin(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr.replace("+08:00", ""));
  const h = date.getHours().toString().padStart(2, "0");
  const min = date.getMinutes().toString().padStart(2, "0");
  return `${h}:${min}`;
}

module.exports = {
  formatTime,
  formatRelativeTime,
  formatTimeHourMin
};
