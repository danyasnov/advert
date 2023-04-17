import {DateTime} from 'luxon'
import {FilterPublication} from 'front-api/src/models/index'

const dateFormat = 'dd.LL.yyyy'
const timeFormat = 't'
export const unixToDate = (unix: number): string => {
  const date = DateTime.fromSeconds(unix)
  return date.toFormat(dateFormat)
}
export const unixToDateTime = (unix: number): string => {
  const date = DateTime.fromSeconds(unix)
  return date.toFormat(`${dateFormat} ${timeFormat}`)
}
export const unixMlToDateTime = (unix: number): string => {
  const date = DateTime.fromMillis(unix)
  return date.toFormat(`${dateFormat} ${timeFormat}`)
}
export const unixMlToTime = (unix: number): string => {
  const date = DateTime.fromMillis(unix)
  return date.toFormat(timeFormat)
}
export const unixToTime = (unix: number): string => {
  const date = DateTime.fromSeconds(unix)
  return date.toFormat(timeFormat)
}
export const unixMlToDate = (unix: number): string => {
  const date = DateTime.fromMillis(unix)
  return date.toFormat(`${dateFormat}`)
}

export const getFirstNonEmptyArray = <T>(...items: T[]): T | null => {
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

export const getPosition = (): Promise<{
  lat: number
  lng: number
}> => {
  return new Promise((resolve, reject) =>
    navigator.geolocation.getCurrentPosition((position) => {
      resolve({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      })
    }, reject),
  )
}

export const swap = (arr, index1, index2) =>
  arr.map((val, idx) => {
    if (idx === index1) return arr[index2]
    if (idx === index2) return arr[index1]
    return val
  })

export const rotate = async ({degrees, file}): Promise<Blob> => {
  const image = new Image()
  image.src = file.url
  return new Promise((resolve) => {
    image.onload = () => {
      const imgHeight = file.height
      const imgWidth = file.width
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (degrees === 90 || degrees === 270) {
        canvas.width = imgHeight
        canvas.height = imgWidth
      } else {
        canvas.width = imgWidth
        canvas.height = imgHeight
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      if (degrees === 90 || degrees === 270) {
        ctx.translate(imgHeight / 2, imgWidth / 2)
      } else {
        ctx.translate(imgWidth / 2, imgHeight / 2)
      }
      ctx.rotate((degrees * Math.PI) / 180)
      ctx.drawImage(image, -imgWidth / 2, -imgHeight / 2)
      ctx.canvas.toBlob(resolve, 'image/jpeg')
    }
  })
}

export const getDigitsFromString = (string: string) => {
  return string.replace(/[^0-9]/g, '')
}
