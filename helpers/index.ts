import {AnalyticsService, LocationModel, CACategoryModel} from 'front-api/src'
import {GeoPositionModel} from 'front-api/src/models/index'
import {parseCookies, setCookie} from 'nookies'
import {GetServerSidePropsContext} from 'next'
import {ParsedUrlQuery} from 'querystring'
import {getAddressByGPS, getLocationByIp, parseIp} from '../api'
import {CookiesState, LocationIdFilter, SerializedCookiesState} from '../types'
import {getCities, getCountries, getRegions} from '../api/v1'

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

export const getShortAddress = (addressObj: GeoPositionModel = {}): string => {
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
    setCookie(ctx, key, value, {
      path: '/',
      maxAge: 30 * 24 * 60 * 60,
    })
  })
}

export const processCookies = async (
  ctx: Partial<GetServerSidePropsContext>,
): Promise<CookiesState> => {
  const {locale, req} = ctx
  const cookies: SerializedCookiesState = parseCookies(ctx)
  const state: CookiesState = {}
  let locationByIp = null
  state.language = locale || cookies.language || 'en'
  if (!cookies.userLocation) {
    try {
      const ip = parseIp(req)
      locationByIp = await getLocationByIp(ip)
      if (locationByIp.data?.data) {
        const {latitude, longitude} = locationByIp.data.data
        state.userLocation = {
          latitude,
          longitude,
        }
      }
    } catch (e) {
      console.error(e)
    }
  } else {
    state.userLocation = JSON.parse(cookies.userLocation)
  }
  state.searchLocation =
    !cookies.searchLocation && state.userLocation
      ? state.userLocation
      : JSON.parse(cookies.searchLocation)

  state.searchRadius = cookies.searchRadius ? Number(cookies.searchRadius) : 25
  state.searchBy = cookies.searchBy ?? 'coords'

  if (cookies.countryId) state.countryId = cookies.countryId
  if (cookies.regionId) state.regionId = cookies.regionId
  if (cookies.cityId) state.cityId = cookies.cityId
  if (!cookies.address || cookies.language !== locale) {
    if (state.searchBy === 'coords') {
      const position = await getAddressByGPS(state.userLocation, state.language)
      state.address = getShortAddress(position.result)
    } else {
      const address = []
      if (state.countryId) {
        const countries = await getCountries(state.language)
        const countryTitle = (countries ?? []).find(
          (c) => c.id === state.countryId,
        )?.title
        if (countryTitle) address.push(countryTitle)
        if (state.regionId) {
          const regions = await getRegions(state.countryId, state.language)
          const regionTitle = (regions.result ?? []).find(
            (c) => c.id === state.countryId,
          )?.word
          if (regionTitle) address.push(regionTitle)
          if (state.cityId) {
            const cities = await getCities(state.regionId, state.language)
            const cityTitle = (cities.result ?? []).find(
              (c) => c.id === state.cityId,
            )?.word
            if (cityTitle) address.push(cityTitle)
          }
        }
      }
      if (address.length) {
        state.address = address[address.length - 1]
      }
    }
  }
  setCookiesObject(state, ctx)
  return state
}

export const findCategoryByQuery = (
  categoriesQuery: string | string[],
  categories: CACategoryModel[],
): CACategoryModel | null => {
  if (!Array.isArray(categoriesQuery)) return null
  let category
  // eslint-disable-next-line no-restricted-syntax
  for (const slug of categoriesQuery) {
    const source = (category?.items || categories) ?? []
    category = source.find((c) => c.slug === slug)
    if (!category) {
      break
    }
  }
  return category
}
export const findCurrentCategoriesOptionsyByQuery = (
  categoriesQuery: string | string[],
  categories: CACategoryModel[],
): CACategoryModel[] | null => {
  if (!Array.isArray(categoriesQuery)) return null
  let category
  // eslint-disable-next-line no-restricted-syntax
  for (const slug of categoriesQuery) {
    const source = (category?.items || categories) ?? []
    const temp = source.find((c) => c.slug === slug)
    if (!temp?.items.length) {
      break
    } else {
      category = temp
    }
  }
  return category?.items
}

export const getQueryValue = (query: ParsedUrlQuery, path: string): string => {
  const value = query[path]
  return Array.isArray(value) ? value[0] : value
}

export const getSearchByFilter = (
  state: CookiesState,
): LocationIdFilter | (LocationModel & {distanceMax: number}) => {
  if (state.searchBy === 'id') {
    const data: LocationIdFilter = {
      countryISO: parseInt(state.countryId, 10),
    }
    if (state.cityId) data.cityId = parseInt(state.cityId, 10)
    if (state.regionId) data.regionId = parseInt(state.regionId, 10)
    return data
  }
  return {
    ...state.searchLocation,
    distanceMax: state.searchRadius,
  }
}
