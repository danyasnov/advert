import RestApi, {AppStorage, LocationModel} from 'front-api'
import axios, {AxiosPromise, AxiosRequestConfig} from 'axios'
import {NextApiRequest} from 'next'
import {RestResponse} from 'front-api/src/api/request'
import {GeoPositionModel} from 'front-api/src/models/index'
import {IncomingMessage} from 'http'
import curlirize from 'axios-curlirize'
import isIp from 'is-ip'
import {NextApiRequestCookies} from 'next/dist/server/api-utils'
import {DummyAnalytics} from '../helpers'
import Storage from '../stores/Storage'

if (!process.env.PRODUCTION) curlirize(axios)
export const {API_URL} = process.env

export const getRest = (storage: AppStorage): RestApi =>
  new RestApi({
    isDev: true,
    storage,
    isLogEnabled: true,
    isLogRequest: true,
    isLogResponse: false,
    sendLog: (msg) =>
      (msg.includes('[request]') || msg.includes('[response]')) &&
      console.log(`\n${msg}\n`),
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
  let url = `${process.env.API_URL}/v2/geo/mylocation`
  if (isIp(ip as string) && ip !== '::1') {
    url += `?ip=${ip}`
  }
  return makeRequest({
    method: 'get',
    url,
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
