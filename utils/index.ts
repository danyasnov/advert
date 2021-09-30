import {DateTime} from 'luxon'
import {FilterPublication} from 'front-api/src/models/index'

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

export const clearUrlFromQuery = (value: string): string => {
  return value.split('?')[0]
}

export const setSortToUrl = (value: string, sortBy: string): string => {
  const params = new URLSearchParams(value.split('?')[1])
  params.set('sortBy', sortBy)
  return `${value.split('?')[0]}?${params}`
}

export const clearFalsyValues = (
  obj: Record<string, unknown>,
): Record<string, unknown> => {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => {
      if (Array.isArray(value) && !value.length) {
        return false
      }
      return !!value
    }),
  )
}
export const defaultFilter = {
  onlyFromSubscribed: false,
  published: FilterPublication.ALL_TIME,
  priceMax: undefined,
  priceMin: undefined,
  fieldValues: new Map(),
  search: '',
  onlyDiscounted: false,
  secureDeal: false,
  sort: {
    type: 'date_updated',
    direction: 'asc',
    key: '',
  },
}

export const randomString = (length: number): string => {
  let result = ''
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  // eslint-disable-next-line no-plusplus
  for (let i = length; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)]
  return result
}
