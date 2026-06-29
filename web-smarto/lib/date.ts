export function getMakassarDateTime() {
  const now = new Date()

  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Makassar",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    hourCycle: "h23",
  })

  const parts = formatter.formatToParts(now)

  const get = (type: string) =>
    parts.find((part) => part.type === type)?.value

  const year = get("year")
  const month = get("month")
  const day = get("day")
  const hour = get("hour")
  const minute = get("minute")
  const second = get("second")

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`
}
export function getMakassarCurrentHourStart() {
  const nowMakassar = getMakassarDateTime()

  return nowMakassar.substring(0, 13) + ":00:00"
}