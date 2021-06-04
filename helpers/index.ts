import {AnalyticsService, LocationModel} from 'front-api/src'
import {GeoPositionModel} from 'front-api/src/models/index'
import {setCookie} from 'nookies'

export const notImplementedAlert = () => {
  // eslint-disable-next-line no-alert
  window.alert('NotImplemented')
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const noop = (): void => {}

export class DummyAnalytics implements AnalyticsService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  init = (apiKey: string): Promise<boolean> => {
    return Promise.resolve(false)
  }

  logEvent = (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    eventType: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    eventProps?: Record<string, any>,
  ): Promise<boolean> => {
    return Promise.resolve(false)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  trackingSessionEvents = (isTrack: boolean): Promise<boolean> => {
    return Promise.resolve(false)
  }
}

export const objectFlip = (obj: any): any => {
  return Object.entries(obj).reduce((acc, entry: [string, string]) => {
    const [key, value] = entry
    acc[value] = key
    return acc
  }, {})
}

export const getShortAddress = (addressObj: GeoPositionModel): string => {
  const {city, region, country} = addressObj
  const addressArray = []
  if (city) addressArray.push(city.word)
  if (region) addressArray.push(region.word)
  if (country) addressArray.push(country.word)
  return addressArray[0]
}

export const setCookiesObject = (data: CookiesState, ctx = null): void => {
  Object.keys(data).forEach((key) => {
    const value =
      typeof data[key] === 'object' && data[key] !== null
        ? JSON.stringify(data[key])
        : data[key]
    setCookie(ctx, key, value)
  })
}

export interface CookiesState {
  userLocation?: LocationModel
  searchLocation?: LocationModel
  searchRadius?: number
  countryId?: string | number
  regionId?: string | number
  cityId?: string | number
  searchBy?: 'coords' | 'id'
  address?: string
  language?: string
}

export interface SerializedCookiesState {
  userLocation?: string
  searchLocation?: string
  searchRadius?: string
  countryId?: string
  regionId?: string
  cityId?: string
  searchBy?: 'coords' | 'id'
  address?: string
  language?: string
}
