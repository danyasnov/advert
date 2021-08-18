import {
  AnalyticsService,
  CACategoryModel,
  LocationModel,
  CACategoryDataModel,
  CountryModel,
} from 'front-api/src'
import {
  CACategoryDataFieldModel,
  GeoPositionModel,
} from 'front-api/src/models/index'
import {destroyCookie, parseCookies, setCookie} from 'nookies'
import {GetServerSidePropsContext} from 'next'
import {ParsedUrlQuery} from 'querystring'
import {IncomingMessage, ServerResponse} from 'http'
import {pick, omit, toNumber, isEmpty, toString} from 'lodash'
import {NextApiRequestCookies} from 'next/dist/server/api-utils'
import {getAddressByGPS, getLocationByIp, parseIp} from '../api'
import {
  City,
  CookiesState,
  Filter,
  LocationIdFilter,
  SerializedCookiesState,
} from '../types'
import {fetchCities, fetchCountries, fetchRegions} from '../api/v1'
import {clearFalsyValues} from '../utils'

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

export const getLocationQuery = (
  addressObj: GeoPositionModel = {},
): {city: string; country: string} => {
  const {city, region, country} = addressObj
  return {
    city: city?.slug || region?.slug || 'all',
    country: country?.code || 'all',
  }
}

export const setCookiesObject = (data: CookiesState, ctx = null): void => {
  Object.keys(data).forEach((key) => {
    const value =
      typeof data[key] === 'object' && data[key] !== null
        ? JSON.stringify(data[key])
        : data[key]
    const options: Partial<{path: string; maxAge: number; domain: string}> = {
      path: '/',
      maxAge: 30 * 24 * 60 * 60,
    }
    const domain = process.env.DOMAIN || process.env.NEXT_PUBLIC_DOMAIN
    if (domain) options.domain = domain
    setCookie(ctx, key, value, options)
  })
}

export const destroyCookiesWrapper = (ctx = null, name: string): void => {
  const options: Partial<{path: string; maxAge: number; domain: string}> = {
    path: '/',
  }
  const domain = process.env.DOMAIN || process.env.NEXT_PUBLIC_DOMAIN
  if (domain) options.domain = domain
  destroyCookie(ctx, name, options)
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
          latitude: latitude || 34.6841,
          longitude: longitude || 33.0379,
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
    const splitted = slug.split('?')[0]
    const source = (category?.items || categories) ?? []
    category = source.find((c) => c.slug === splitted)
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
):
  | LocationIdFilter
  | {location: LocationModel & {distanceMax: number}}
  | Record<string, never> => {
  if (state.searchBy === 'id') {
    const data: LocationIdFilter = {
      countryId: parseInt(state.countryId, 10),
    }
    if (state.cityId) data.cityId = parseInt(state.cityId, 10)
    if (state.regionId) data.regionId = parseInt(state.regionId, 10)
    return data
  }
  if (state.searchBy === 'coords') {
    return {
      location: {
        ...state.searchLocation,
        distanceMax: state.searchRadius,
      },
    }
  }
  if (state.searchBy === 'onlyCountry') {
    return {
      countryId: parseInt(state.countryId, 10),
    }
  }
  if (state.searchBy === 'countryAndCity') {
    return {
      countryId: parseInt(state.countryId, 10),
      cityId: parseInt(state.cityId, 10),
    }
  }
  if (state.searchBy === 'countryAndRegion') {
    return {
      countryId: parseInt(state.countryId, 10),
      regionId: parseInt(state.regionId, 10),
    }
  }
  return {}
}

export const getUrlQueryFromFilter = (
  filter: Partial<Filter>,
  fieldById: Record<string, CACategoryDataFieldModel>,
): string => {
  const baseFields = [
    'condition',
    'onlyDiscounted',
    'onlyWithPhoto',
    'priceMax',
    'priceMin',
  ]
  const baseData = clearFalsyValues(pick(filter, baseFields))
  const fieldValues = clearFalsyValues(filter.fields)
  const fieldValuesWithSlug = Object.fromEntries(
    Object.entries(fieldValues).map(([key, value]) => {
      let stringValue = ''
      const currentField = fieldById[key]
      switch (currentField.fieldType) {
        case 'select':
        case 'iconselect':
        case 'multiselect': {
          // @ts-ignore
          stringValue = value.map(
            (valueId) =>
              [
                // @ts-ignore
                ...currentField.multiselects.top,
                // @ts-ignore
                ...(currentField.multiselects.other
                  ? // @ts-ignore
                    currentField.multiselects.other
                  : []),
              ].find(({id}) => id === valueId)?.value,
          )
          break
        }
        case 'int': {
          if (Array.isArray(value)) {
            const arr = []
            if (value[0] || value[0] === 0) {
              arr.push(value[0])
            }
            if (value[1] || value[1] === 0) {
              arr.push(value[1])
            }
            if (arr.length) stringValue = arr.join('-')
          }
          break
        }
        default: {
          // eslint-disable-next-line prefer-destructuring
          stringValue = value[0]
        }
      }
      return [
        encodeURIComponent(currentField.slug),
        encodeURIComponent(stringValue),
      ]
    }),
  )

  return new URLSearchParams({...baseData, ...fieldValuesWithSlug} as Record<
    string,
    string
  >).toString()
}

export const getFilterFromQuery = (
  query: ParsedUrlQuery,
  category: CACategoryDataModel,
): Partial<Filter> => {
  const excludedFields = ['country', 'city', 'categories', 'q']
  const baseFields = [
    'condition',
    'onlyDiscounted',
    'onlyWithPhoto',
    'priceMax',
    'priceMin',
    'sortBy',
  ]

  const baseFilter = pick(query, baseFields)
  baseFilter.onlyWithPhoto = baseFilter.onlyWithPhoto === 'true'
  baseFilter.onlyDiscounted = baseFilter.onlyDiscounted === 'true'
  if (baseFilter.priceMax) baseFilter.priceMax = toNumber(baseFilter.priceMax)
  if (baseFilter.priceMin) baseFilter.priceMin = toNumber(baseFilter.priceMin)
  const fieldsFilter = omit(query, [...baseFields, ...excludedFields])
  const result = {...baseFilter}

  if (!isEmpty(fieldsFilter)) {
    result.fieldValues = Object.fromEntries(
      Object.entries(fieldsFilter).map(([key, value]) => {
        // if (key === 'vin-number0') debugger
        const parsedKey = key
        const currentField = category.fields.find((f) => f.slug === parsedKey)

        let parsedValue = decodeURIComponent(value as string).split(',')
        // eslint-disable-next-line default-case
        switch (currentField.fieldType) {
          case 'select':
          case 'iconselect':
          case 'multiselect': {
            // @ts-ignore
            parsedValue = parsedValue.map(
              (valueId) =>
                [
                  // @ts-ignore
                  ...currentField.multiselects.top,
                  // @ts-ignore
                  ...(currentField.multiselects.other
                    ? // @ts-ignore
                      currentField.multiselects.other
                    : []),
                ].find((m) => m.value === valueId)?.id,
            )
            break
          }
          case 'checkbox': {
            // @ts-ignore
            parsedValue = [parsedValue[0] === 'true']
            break
          }
          case 'int': {
            const range = parsedValue[0].split('-')
            const parsed = []
            if (range[0]) {
              parsed.push(toNumber(range[0]))
            }
            if (range[1]) {
              parsed.push(toNumber(range[1]))
            }
            parsedValue = parsed
            break
          }
        }

        return [currentField.id, parsedValue]
      }),
    )
  }

  return result
}

export const getFormikInitialFromQuery = (
  query: ParsedUrlQuery,
  categoryDataFieldsBySlug: Record<string, CACategoryDataFieldModel>,
) => {
  const queryData =
    typeof window === 'undefined'
      ? query
      : Object.fromEntries(new URLSearchParams(window.location.search))
  const excludedFields = ['country', 'city', 'categories', 'q']
  const baseFields = [
    'condition',
    'onlyDiscounted',
    'onlyWithPhoto',
    'priceMax',
    'priceMin',
    'sortBy',
  ]

  const baseFilter = pick(queryData, baseFields)
  baseFilter.onlyWithPhoto = baseFilter.onlyWithPhoto === 'true'
  baseFilter.onlyDiscounted = baseFilter.onlyDiscounted === 'true'
  const priceRange: string[] = [
    baseFilter.priceMin ? toNumber(baseFilter.priceMin) : undefined,
    baseFilter.priceMax ? toNumber(baseFilter.priceMax) : undefined,
  ]
  const fieldsFilter = omit(queryData, [
    ...baseFields,
    ...excludedFields,
    'sortBy',
  ])
  const result = {...baseFilter, priceRange}
  delete result.priceMin
  delete result.priceMax

  if (!isEmpty(fieldsFilter)) {
    result.fields = Object.fromEntries(
      Object.entries(fieldsFilter).map(([key, value]) => {
        const currentField = categoryDataFieldsBySlug[key]

        let parsedValue = decodeURIComponent(value as string).split(',')
        // eslint-disable-next-line default-case
        switch (currentField.fieldType) {
          case 'select':
          case 'iconselect':
          case 'multiselect': {
            // @ts-ignore
            parsedValue = parsedValue.map((valueId) => {
              const option = [
                // @ts-ignore
                ...currentField.multiselects.top,
                // @ts-ignore
                ...(currentField.multiselects.other
                  ? // @ts-ignore
                    currentField.multiselects.other
                  : []),
              ].find((m) => m.value === valueId)
              return {
                value: option.id,
                label: option.value,
              }
            })
            break
          }
          case 'checkbox': {
            // @ts-ignore
            parsedValue = parsedValue[0] === 'true'
            break
          }
          case 'int': {
            const range = parsedValue[0].split('-')
            const parsed = []
            if (range[0]) {
              parsed.push(toNumber(range[0]))
            }
            if (range[1]) {
              parsed.push(toNumber(range[1]))
            }
            parsedValue = parsed
            break
          }
        }

        return [currentField.id, parsedValue]
      }),
    )
  }

  return result
}

export const getLocationCodes = (ctx?): string => {
  const cookies: SerializedCookiesState = parseCookies(ctx)
  const result = []
  result.push(cookies.countryCode || 'all')
  result.push(cookies.regionOrCityCode || 'all')
  return result.join('/')
}

export const withLocationQuery = async (
  state: CookiesState,
  query: ParsedUrlQuery,
  {
    countries,
    cities,
    regions,
  }: {countries: CountryModel[]; cities: City[]; regions: City[]},
): Promise<CookiesState> => {
  const updatedState = state
  const countryCode = getQueryValue(query, 'country')
  const cityCode = getQueryValue(query, 'city')
  const country =
    countryCode && countryCode !== 'all'
      ? countries.find((c) => c.isoCode === countryCode)
      : null
  let region = null
  let city = null
  if (country && cityCode !== 'all') {
    region = regions.find((c) => c.slug === cityCode)
    if (!region) {
      city = cities.find((c) => c.slug === cityCode)
    }
  }

  if (country?.isoCode === state.countryCode && state.searchBy === 'coords') {
    if (state.regionOrCityCode && cityCode !== 'all') {
      if (
        state.regionOrCityCode === region?.slug ||
        state.regionOrCityCode === city?.slug
      ) {
        return updatedState
      }
    } else if (!state.regionOrCityCode && cityCode === 'all') {
      return updatedState
    }
  }

  if (country) {
    if (city) {
      // @ts-ignore
      updatedState.searchBy = 'countryAndCity'
      updatedState.cityId = toString(city.id)
      updatedState.countryId = country.id
    } else if (region) {
      // @ts-ignore
      updatedState.searchBy = 'countryAndRegion'
      updatedState.regionId = toString(region.id)
      updatedState.countryId = country.id
    } else {
      // @ts-ignore
      updatedState.searchBy = 'onlyCountry'
      updatedState.countryId = country.id
    }
  } else {
    delete updatedState.searchBy
  }
  // @ts-ignore
  updatedState.modified = true
  return updatedState
}

export const shallowUpdateQuery = (queryString?: string): void => {
  const newurl = `${window.location.protocol}//${window.location.host}${
    window.location.pathname
  }${queryString ? `?${queryString}` : ''}`
  window.history.pushState({path: newurl}, '', newurl)
}

export const redirect = (
  url: string,
  res: ServerResponse,
): {props: Record<string, never>} => {
  res.setHeader('location', url)
  res.statusCode = 301
  res.end()
  return {
    props: {},
  }
}
