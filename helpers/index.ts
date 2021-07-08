import {AnalyticsService, LocationModel, CACategoryModel} from 'front-api/src'
import {GeoPositionModel} from 'front-api/src/models/index'
import {parseCookies, setCookie} from 'nookies'
import {GetServerSidePropsContext} from 'next'
import {ParsedUrlQuery} from 'querystring'
import {IncomingMessage} from 'http'
import {NextApiRequestCookies} from 'next/dist/next-server/server/api-utils'
import {getAddressByGPS, getLocationByIp, parseIp} from '../api'
import {CookiesState, LocationIdFilter, SerializedCookiesState} from '../types'
import {fetchCities, fetchCountries, fetchRegions} from '../api/v1'

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
  ctx: Partial<GetServerSidePropsContext> & {
    req: IncomingMessage & {cookies: NextApiRequestCookies; locale?: string}
  },
): Promise<CookiesState> => {
  const {req} = ctx
  const cookies: SerializedCookiesState = parseCookies(ctx)
  const state: CookiesState = {}
  let locationByIp = null
  let addressByGps = null
  state.language = cookies.language || req.locale || 'en'
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

  // URL search params eg RU/moscow
  if (state.searchBy === 'coords') {
    addressByGps = await getAddressByGPS(state.searchLocation, state.language)
    if (addressByGps.result) {
      state.countryCode = addressByGps.result.country.code
      if (addressByGps.result.region?.slug) {
        state.regionOrCityCode = addressByGps.result.region.slug
        if (addressByGps.result.city?.slug) {
          state.regionOrCityCode = addressByGps.result.city.slug
        }
      } else {
        state.regionOrCityCode = ''
      }
    } else {
      state.countryCode = ''
      state.regionOrCityCode = ''
    }
  } else {
    const countries = await fetchCountries(state.language)
    const country = (countries ?? []).find((c) => c.id === state.countryId)
    state.countryCode = country?.isoCode || ''
    if (state.regionId) {
      const regions = await fetchRegions(state.countryId, 'en')
      const region = (regions.result ?? []).find((c) => c.id === state.regionId)
      if (region?.word) {
        state.regionOrCityCode = region?.word
        if (state.cityId) {
          const cities = await fetchCities(state.regionId, 'en')
          const city = (cities.result ?? []).find((c) => c.id === state.cityId)
          if (city?.word) {
            state.regionOrCityCode = city?.word
          }
        }
      }
    } else {
      state.regionOrCityCode = ''
    }
  }

  // address string in search
  if (!cookies.address) {
    if (state.searchBy === 'coords') {
      const position =
        addressByGps ||
        (await getAddressByGPS(state.userLocation, state.language))
      state.address = getShortAddress(position.result)
    } else {
      const address = []
      if (state.countryId) {
        const countries = await fetchCountries(state.language)
        const countryTitle = (countries ?? []).find(
          (c) => c.id === state.countryId,
        )?.title
        if (countryTitle) address.push(countryTitle)
        if (state.regionId) {
          const regions = await fetchRegions(state.countryId, state.language)
          const regionTitle = (regions.result ?? []).find(
            (c) => c.id === state.countryId,
          )?.word
          if (regionTitle) address.push(regionTitle)
          if (state.cityId) {
            const cities = await fetchCities(state.regionId, state.language)
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
      countryId: parseInt(state.countryId, 10),
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

export const getLocationCodes = (): string => {
  const cookies: SerializedCookiesState = parseCookies()
  const result = []
  result.push(cookies.countryCode || 'all')
  result.push(cookies.regionOrCityCode || 'all')
  return result.join('/')
}
