// Date formatting utilities
export const formatDateTime = (isoString) => {
  if (!isoString) return ""

  const date = new Date(isoString)
  return date.toLocaleString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
}

export const formatDateTimeForAPI = (datetimeLocal) => {
  if (!datetimeLocal) return null
  return datetimeLocal.replace("T", " ") + ":00"
}
