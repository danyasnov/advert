import RestApi, {AppStorage, LocationModel} from 'front-api'
import axios, {AxiosPromise, AxiosRequestConfig} from 'axios'
import {NextApiRequest} from 'next'
import {RestResponse} from 'front-api/src/api/request'
import {GeoPositionModel} from 'front-api/src/models/index'
import {IncomingMessage} from 'http'
import {NextApiRequestCookies} from 'next/dist/next-server/server/api-utils'
import curlirize from 'axios-curlirize'
import {DummyAnalytics} from '../helpers'
import Storage from '../stores/Storage'

curlirize(axios)
export const {API_URL} = process.env

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
