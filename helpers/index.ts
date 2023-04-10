/* eslint-disable global-require */
import {
  CACategoryModel,
  LocationModel,
  CACategoryDataModel,
  CountryModel,
} from 'front-api/src'
import {
  AuthType,
  CACategoryDataFieldModel,
  GeoPositionModel,
} from 'front-api/src/models'
import {destroyCookie, parseCookies, setCookie} from 'nookies'
import {GetServerSidePropsContext} from 'next'
import {ParsedUrlQuery} from 'querystring'
import {IncomingMessage} from 'http'
import {pick, omit, toNumber, isEmpty, toString} from 'lodash'
import {NextApiRequestCookies} from 'next/dist/server/api-utils'
import crypto from 'crypto'
import jwtDecode from 'jwt-decode'
import {NextRouter} from 'next/router'
import {
  API_URL,
  getAddressByGPS,
  getLocationByIp,
  makeRequest,
  parseIp,
} from '../api'
import {
  City,
  CookiesState,
  Filter,
  LocationIdFilter,
  SerializedCookiesState,
} from '../types'
import {fetchCities, fetchCountries, fetchRegions} from '../api/v1'
import {clearFalsyValues} from '../utils'
import PublicKey from '../PublicKey'
import Storage from '../stores/Storage'

const PIXEL_ID = '678216410546433'

export const notImplementedAlert = () => {
  // eslint-disable-next-line no-alert
  window.alert('NotImplemented')
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const noop = (): void => {}

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
  return addressArray[0] || ''
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

export const destroyCookiesWrapper = (name: string, ctx?): void => {
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
      state.userLocation = {
        latitude: 34.6841,
        longitude: 33.0379,
      }
    }
  } else {
    state.userLocation = JSON.parse(cookies.userLocation)
  }
  state.searchLocation =
    !cookies.searchLocation && state.userLocation
      ? state.userLocation
      : JSON.parse(cookies.searchLocation)

  state.searchRadius = cookies.searchRadius ? Number(cookies.searchRadius) : 200
  state.searchBy = cookies.searchBy ?? 'coords'

  if (cookies.countryId) state.countryId = cookies.countryId
  if (cookies.regionId) state.regionId = cookies.regionId
  if (cookies.cityId) state.cityId = cookies.cityId

  // URL search params eg RU/moscow
  if (state.searchBy === 'coords') {
    addressByGps = await getAddressByGPS(state.searchLocation, state.language)
    if (addressByGps.result) {
      state.countryCode = addressByGps.result.country.code
      state.userCountryId = addressByGps.result.country.id
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
    state.userCountryId = country?.id
    if (state.regionId) {
      const regions = await fetchRegions(state.countryId, 'en')
      const region = (regions.result ?? []).find((c) => c.id === state.regionId)
      if (region?.slug) {
        state.regionOrCityCode = region?.slug
        if (state.cityId) {
          const cities = await fetchCities(state.regionId, 'en')
          const city = (cities.result ?? []).find((c) => c.id === state.cityId)
          if (city?.slug) {
            state.regionOrCityCode = city?.slug
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
  if (cookies.hash) state.hash = cookies.hash
  if (cookies.token) state.token = cookies.token
  if (cookies.authNewRefreshToken)
    state.authNewRefreshToken = cookies.authNewRefreshToken
  if (cookies.authNewToken) state.authNewToken = cookies.authNewToken
  if (cookies.authType) state.authType = toNumber(cookies.authType)
  if (!cookies.aup && state.hash && state.token && state.authType) {
    const data = Buffer.from(
      JSON.stringify({
        hash: state.hash,
        auth_type: state.authType === AuthType.phone ? 'phone' : 'email',
        time_auth: Math.floor(new Date().getTime() / 1000),
      }),
    )
    const encrypted = crypto.publicEncrypt(
      {
        key: PublicKey,
        padding: crypto.constants.RSA_PKCS1_PADDING,
      },
      data,
    )
    const base64 = encrypted.toString('base64')
    state.aup = base64.match(new RegExp(`.{0,${76}}`, 'g')).join('\r\n')
  }
  if (!cookies.sessionId) {
    state.sessionId = Date.now().toString()
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
    'withPhoto',
    'priceMax',
    'priceMin',
  ]
  const baseData = clearFalsyValues(pick(filter, baseFields))
  const fieldValues = clearFalsyValues(filter.fields)
  const fieldValuesWithSlug = Object.fromEntries(
    Object.entries(fieldValues).map(([key, value]) => {
      let stringValue = ''
      const currentField = fieldById[key]
      // debugger
      switch (currentField?.fieldType) {
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
    'withPhoto',
    'priceMax',
    'priceMin',
    'sortBy',
  ]

  const baseFilter: any = pick(query, baseFields)
  baseFilter.withPhoto = baseFilter.withPhoto === 'true'
  baseFilter.onlyDiscounted = baseFilter.onlyDiscounted === 'true'
  if (baseFilter.priceMax) baseFilter.priceMax = toNumber(baseFilter.priceMax)
  if (baseFilter.priceMin) baseFilter.priceMin = toNumber(baseFilter.priceMin)
  const fieldsFilter = omit(query, [...baseFields, ...excludedFields])
  const result = {...baseFilter}

  if (!isEmpty(fieldsFilter) && category) {
    result.fieldValues = Object.fromEntries(
      Object.entries(fieldsFilter).map(([key, value]) => {
        // if (key === 'vin-number0') debugger
        const parsedKey = key
        const fieldsDict = getFieldsDictByParam(
          flatArrayFields(category.fields),
          'slug',
        )

        // const currentField = category.fields.find((f) => f.slug === parsedKey)
        const currentField = fieldsDict[key]

        let parsedValue = decodeURIComponent(value as string).split(',')
        // eslint-disable-next-line default-case
        switch (currentField?.fieldType) {
          case 'select':
          case 'iconselect':
          case 'multiselect': {
            // @ts-ignore
            parsedValue = parsedValue
              .map(
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
              .filter((v) => !!v)
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

        return [currentField?.id, parsedValue]
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
    'withPhoto',
    'priceMax',
    'priceMin',
    'sortBy',
  ]

  const baseFilter: any = pick(queryData, baseFields)
  baseFilter.withPhoto = baseFilter.withPhoto === 'true'
  baseFilter.onlyDiscounted = baseFilter.onlyDiscounted === 'true'
  const priceRange: number[] = [
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
      Object.entries(fieldsFilter)
        .map(([key, value]) => {
          const currentField = categoryDataFieldsBySlug[key]

          let parsedValue = decodeURIComponent(value as string).split(',')
          // eslint-disable-next-line default-case
          switch (currentField?.fieldType) {
            case 'select':
            case 'iconselect':
            case 'multiselect': {
              // @ts-ignore
              parsedValue = parsedValue
                .map((valueId) => {
                  const option = [
                    // @ts-ignore
                    ...currentField.multiselects.top,
                    // @ts-ignore
                    ...(currentField.multiselects.other
                      ? // @ts-ignore
                        currentField.multiselects.other
                      : []),
                  ].find((m) => m.value === valueId)
                  if (!option) {
                    return null
                  }
                  return {
                    value: option.id,
                    label: option.value,
                  }
                })
                .filter((v) => !!v)
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

          return [currentField?.id, parsedValue]
        })
        .filter(([key]) => !!key),
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

export const withLocationQuery = (
  state: CookiesState,
  query: ParsedUrlQuery,
  {countries, locations}: {countries: CountryModel[]; locations: City[]},
): CookiesState => {
  const updatedState = state
  const countryCode = getQueryValue(query, 'country')
  const cityCode = getQueryValue(query, 'city')
  const country =
    countryCode && countryCode !== 'all'
      ? countries.find((c) => c.isoCode === countryCode)
      : null
  let region = null
  let city = null
  if (country && cityCode !== 'all' && !isEmpty(locations)) {
    if (locations[0].type === 'region') {
      // eslint-disable-next-line prefer-destructuring
      region = locations[0]
    }
    if (locations[0].type === 'city') {
      // eslint-disable-next-line prefer-destructuring
      city = locations[0]
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

export const robustShallowUpdateQuery = (router: NextRouter, query) => {
  router.replace(
    {
      pathname: router.asPath.split('?')[0],
      query,
    },
    undefined,
    {shallow: true},
  )
}

export const getCategoriesSlugsPathFromIds = (
  ids: string[],
  categories: Array<CACategoryModel>,
): string[] => {
  const slugs = []
  let currentSearchItems = categories
  ids.some((id) => {
    const currentCategory = currentSearchItems.find(
      (c) => c.id === parseInt(id, 10),
    )
    if (currentCategory) {
      slugs.push(currentCategory.slug)
      currentSearchItems = currentCategory.items
      return false
    }
    return true
  })

  return slugs
}

export const trackSingle = (event, data?) => {
  if (typeof window === 'undefined') return
  const ReactPixel = require('react-facebook-pixel').default

  // ReactPixel.init(PIXEL_ID)
  ReactPixel.trackSingle(PIXEL_ID, event, data)
}

export const startTracking = () => {
  if (typeof window === 'undefined') return
  const ReactPixel = require('react-facebook-pixel').default

  ReactPixel.init(PIXEL_ID)
  ReactPixel.pageView()
}

export const getStorageFromCookies = (
  ctx?: Partial<GetServerSidePropsContext> & {
    req: IncomingMessage & {cookies: NextApiRequestCookies; locale?: string}
  },
) => {
  const state = parseCookies(ctx)
  if (!state.language) {
    state.language = ctx.req.locale || 'en'
  }
  const deserializedState = deserializeCookies(state)

  return new Storage({
    ...deserializedState,
    location: deserializedState.searchLocation,
    userHash: deserializedState.hash,
  })
}

export const checkToken = async (authNewToken: string): Promise<string> => {
  if (!authNewToken) {
    return 'NOT_AUTHORIZED'
  }
  let decoded
  try {
    decoded = jwtDecode(authNewToken)
  } catch (e) {
    console.error(e)
  }
  if (!decoded) {
    // DECODE_FAILED
    return 'LOGIN_REDIRECT'
  }
  const date = new Date().valueOf()
  const exp = decoded.exp * 1000
  // refresh before 24h
  const gap = 1000 * 60 * 60 * 24
  if (exp - gap > date) {
    return 'STILL_VALID'
  }
  return 'REFRESH_REDIRECT'
}

export const deserializeCookies = (
  state: SerializedCookiesState,
): CookiesState => {
  let userLocation: LocationModel = null
  if (state.userLocation) {
    try {
      userLocation = JSON.parse(state.userLocation)
    } catch (e) {
      userLocation = null
    }
  }
  const searchLocation: LocationModel = null
  if (state.searchLocation) {
    try {
      userLocation = JSON.parse(state.searchLocation)
    } catch (e) {
      userLocation = null
    }
  }
  return {
    ...state,
    userLocation,
    searchLocation,
    searchRadius: state.searchRadius ? toNumber(state.searchRadius) : null,
    showDevBanner: state.showDevBanner !== 'false',
    cookieAccepted: state.cookieAccepted !== 'false',
    showLocationPopup: state.showLocationPopup !== 'false',
    showCreateAdvMapHint: state.showCreateAdvMapHint !== 'false',
    showBottomSheet: state.showBottomSheet !== 'false',
    authType: state.authType ? toNumber(state.authType) : null,
    visitMainPageCount: state.visitMainPageCount
      ? toNumber(state.visitMainPageCount)
      : null,
    visitProductTourCount: state.visitProductTourCount
      ? toNumber(state.visitProductTourCount)
      : null,
    visitCurrentUserTourCount: state.visitCurrentUserTourCount
      ? toNumber(state.visitCurrentUserTourCount)
      : null,
    visitUserTourCount: state.visitUserTourCount
      ? toNumber(state.visitUserTourCount)
      : null,
  }
}

export const getMappedFieldsByKey = (fieldsById, key = 'id') => {
  return Object.keys(fieldsById).reduce((acc, val) => {
    if (fieldsById[val].fieldType === 'array') {
      return {
        ...acc,
        ...fieldsById[val].arrayTypeFields.reduce((nAcc, nVal) => {
          return {...nAcc, [nVal.id]: nVal}
        }, {}),
      }
    }
    return {...acc, [val]: fieldsById[val]}
  }, {})
}

export const getFieldsDictByParam = (fields, param = 'id') => {
  return Array.isArray(fields)
    ? fields.reduce(
        (acc, val) => ({
          ...acc,
          [val[param]]: val,
        }),
        {},
      )
    : null
}

export const redirectToLogin = (fallbackUrl) => {
  const param = fallbackUrl === '/' ? '' : `?from=${fallbackUrl}`
  return {
    redirect: {
      destination: `/login${param}`,
      permanent: false,
    },
  }
}

export const redirectToRefresh = (fallbackUrl) => {
  const param = fallbackUrl === '/' ? '' : `?from=${fallbackUrl}`
  return {
    redirect: {
      destination: `/refresh${param}`,
      permanent: false,
    },
  }
}

export const flatArrayFields = (fields) => {
  const newFields = []
  fields.forEach((f) => {
    if (f.fieldType === 'array') {
      newFields.push(...f.arrayTypeFields)
    } else {
      newFields.push(f)
    }
  })
  return newFields
}
export const handleMetrics = (eventType, data?) => {
  trackSingle(eventType, data)
  if (window.dataLayer) {
    window.dataLayer.push({eventType, data})
  } else {
    window.dataLayer = [{eventType, data}]
  }
  makeRequest({
    url: '/api/clickhouse',
    method: 'post',
    data: {eventType, data},
  })
}
