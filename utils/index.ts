import {DateTime} from 'luxon'

export const unixToDate = (unix: number): string => {
  const date = DateTime.fromSeconds(unix)
  return date.toLocaleString(DateTime.DATE_SHORT)
}
export const unixToDateTime = (unix: number): string => {
  const date = DateTime.fromSeconds(unix)
  return date.toLocaleString(DateTime.DATETIME_SHORT)
}

export const getFirstNonEmptyArray = <T extends unknown>(
  ...items: T[]
): T | null => {
  // eslint-disable-next-line no-restricted-syntax
  for (const item of items) {
    if (Array.isArray(item) && item.length) return item
  }
  return null
}
