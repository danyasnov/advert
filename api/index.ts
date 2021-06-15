import RestApi, {
  AppStorage,
  LocationModel,
  CACategoryModel,
  defaultFilter,
} from 'front-api'
import axios, {AxiosPromise, AxiosRequestConfig} from 'axios'
import {NextApiRequest} from 'next'
import {RestResponse} from 'front-api/src/api/request'
import {
  AdvertiseListItemModel,
  CountryModel,
  GeoPositionItemModel,
  GeoPositionModel,
} from 'front-api/src/models/index'
import {IncomingMessage} from 'http'
import {NextApiRequestCookies} from 'next/dist/next-server/server/api-utils'
import curlirize from 'axios-curlirize'
import {DummyAnalytics, getSearchByFilter} from '../helpers'
import Storage from '../stores/Storage'

curlirize(axios)

export const getRest = (storage: AppStorage): RestApi =>
  new RestApi({
    isDev: false,
    storage,
    isLogEnabled: false,
    isLogRequest: true,
    isLogResponse: false,
    analyticsService: new DummyAnalytics(),
  })

export const makeRequest = (config: AxiosRequestConfig): AxiosPromise =>
  axios(config)

export const parseIp = (
  req: NextApiRequest | (IncomingMessage & {cookies: NextApiRequestCookies}),
): string =>
  (<string>req.headers['x-forwarded-for'])?.split(',').shift() ||
  req.socket?.remoteAddress

export const getLocationByIp = (ip: string | string[]): AxiosPromise => {
  const headers = {}
  if (ip) headers['X-Real-IP'] = ip
  return makeRequest({
    method: 'get',
    url: `${process.env.API_URL}/v2/geo/mylocation`,
    headers,
  })
}

export const getAddressByGPS = (
  location: LocationModel,
  language: string,
): Promise<RestResponse<GeoPositionModel>> => {
  const storage = new Storage({language})
  const rest = getRest(storage)
  return rest.geo.fetchPositionByGPS(location)
}
export const getProducts = (
  rest: RestApi,
  storage: AppStorage,
  category: CACategoryModel,
): Promise<RestResponse<Array<AdvertiseListItemModel>>> => {
  const locationFilter = getSearchByFilter(storage)

  const filter = {
    ...defaultFilter(storage),
    location: null,
    categoryId: category.id,
    ...locationFilter,
  }

  return rest.advertises.fetchList({
    page: 1,
    limit: 40,
    searchId: '',
    filter,
  })
}
export const getFreeProducts = (
  rest: RestApi,
  storage: AppStorage,
): Promise<RestResponse<Array<AdvertiseListItemModel>>> => {
  const locationFilter = getSearchByFilter(storage)

  const filter = {
    ...defaultFilter(storage),
    location: null,
    priceMin: '0',
    priceMax: '0',
    // @ts-ignore
    ...locationFilter,
  }

  return rest.advertises.fetchList({
    page: 1,
    limit: 40,
    searchId: '',
    filter,
  })
}

export const getCountries = (
  language: string,
): Promise<Array<CountryModel>> => {
  const storage = new Storage({
    language,
  })
  const rest = getRest(storage)
  return rest.oldRest.fetchCountries()
}

export const getRegions = (
  country: string,
  language: string,
): Promise<RestResponse<Array<GeoPositionItemModel>>> => {
  const storage = new Storage({
    language,
  })
  const rest = getRest(storage)
  return rest.geo.fetchRegionByCountry(country)
}

export const getCities = (
  region: string,
  language: string,
): Promise<RestResponse<Array<GeoPositionItemModel>>> => {
  const storage = new Storage({
    language,
  })
  const rest = getRest(storage)
  return rest.geo.fetchCityByRegion(region)
}
