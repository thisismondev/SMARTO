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

function pad(value: number) {
  return String(value).padStart(2, "0")
}

function formatDateTimeFromUTCDate(date: Date) {
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(
    date.getUTCDate()
  )} ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(
    date.getUTCSeconds()
  )}`
}

export function getMakassarPreviousHourRange() {
  const now = new Date()

  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Makassar",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hour12: false,
    hourCycle: "h23",
  })

  const parts = formatter.formatToParts(now)

  const get = (type: string) =>
    parts.find((part) => part.type === type)?.value

  const year = Number(get("year"))
  const month = Number(get("month"))
  const day = Number(get("day"))
  const hour = Number(get("hour"))

  const endDate = new Date(Date.UTC(year, month - 1, day, hour, 0, 0))
  const startDate = new Date(endDate.getTime() - 60 * 60 * 1000)

  return {
    startAt: formatDateTimeFromUTCDate(startDate),
    endAt: formatDateTimeFromUTCDate(endDate),
  }
}