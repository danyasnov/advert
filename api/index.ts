import RestApi, {AppStorage, defaultFilter} from 'front-api/src/index'
import axios, {AxiosPromise, AxiosRequestConfig} from 'axios'
import {NextApiRequest} from 'next'
import {RestResponse} from 'front-api/src/api/request'
import {AdvertiseListItemModel} from 'front-api/src/models/index'
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
  const location = {
    cityId: storage.value<number>('cityId'),
    regionId: storage.value<number>('regionId'),
    countryId: storage.value<number>('countryId'),
  }
  const filter = {
    ...defaultFilter(storage),
    withPhoto: true,
    priceMin: '0',
    priceMax: '0',
    // @ts-ignore
    ...location,
  }

  return rest.advertises.fetchList({
    page: 1,
    limit: 40,
    searchId: '',
    filter,
  })
}
