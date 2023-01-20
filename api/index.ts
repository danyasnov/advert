import RestApi, {AppStorage, LocationModel} from 'front-api'
import axios, {AxiosPromise, AxiosRequestConfig} from 'axios'
import {NextApiRequest} from 'next'
import {RestResponse} from 'front-api/src/api/request'
import {GeoPositionModel} from 'front-api/src/models'
import {IncomingMessage} from 'http'
import curlirize from 'axios-curlirize'
import isIp from 'is-ip'
import {NextApiRequestCookies} from 'next/dist/server/api-utils'
import axiosRetry, {IAxiosRetryConfig} from 'axios-retry'
import Storage from '../stores/Storage'

if (!process.env.PRODUCTION) curlirize(axios)

export const {API_URL} = process.env

export const getRest = (storage: AppStorage): RestApi =>
  new RestApi({
    newAuth: {
      onLogin() {
        console.log('LOGIN REQUEST')
      },
    },
    isDev: true,
    storage,
    isLogRequest: true,
    isLogResponse: false,
    sendLog: (msg) => msg.includes('curl ') && console.log(`\n${msg}\n`),
    endpoint: API_URL,
  })

export const makeRequest = (
  config: AxiosRequestConfig,
  retryConfig?: IAxiosRetryConfig,
): AxiosPromise => {
  const client = axios.create()
  // curlirize(client)
  axiosRetry(client, retryConfig)
  return client(config)
}

export const parseIp = (
  req: NextApiRequest | (IncomingMessage & {cookies: NextApiRequestCookies}),
): string =>
  (<string>req.headers['x-forwarded-for'])?.split(',').shift() ||
  req.socket?.remoteAddress

export const getLocationByIp = (ip: string | string[]): AxiosPromise => {
  let url = `${API_URL}/v2/geo/mylocation`
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
