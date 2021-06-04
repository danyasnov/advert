import RestApi, {AppStorage, LocationModel} from 'front-api/src/index'
import axios, {AxiosPromise, AxiosRequestConfig} from 'axios'
import {NextApiRequest} from 'next'
import {RestResponse} from 'front-api/src/api/request'
import {
  AdvertiseListItemModel,
  BASIC_RADIUS,
  sortTypes,
} from 'front-api/src/models/index'
import {IncomingMessage} from 'http'
import {NextApiRequestCookies} from 'next/dist/next-server/server/api-utils'
import {DummyAnalytics} from '../helpers'

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

export const getFreeProducts = (
  storage: AppStorage,
): Promise<RestResponse<Array<AdvertiseListItemModel>>> => {
  const rest = getRest(storage)
  const locationFilter: {
    cityId?: number
    regionId?: number
    countryId?: number
    location?: LocationModel
  } = {}
  if (storage.value<string>('searchBy') === 'id') {
    locationFilter.cityId = storage.value<number>('cityId')
    locationFilter.regionId = storage.value<number>('regionId')
    locationFilter.countryId = storage.value<number>('countryId')
  } else {
    locationFilter.location = storage.location
  }
  const filter = {
    onlyFavorite: false,
    search: '',
    fieldValues: new Map(),
    sort: sortTypes[0],
    distanceMax: storage.value<number>('searchRadius') ?? BASIC_RADIUS,
    locationAddress: storage.searchAddress ?? undefined,
    secureDeal: false,
    withDiscount: false,
    withPhoto: false,
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
