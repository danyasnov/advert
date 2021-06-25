import {DateTime} from 'luxon'

export const unixToString = (unix: number): string => {
  const date = DateTime.fromSeconds(unix)
  return date.toLocaleString(DateTime.DATE_FULL)
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
