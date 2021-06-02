import RestApi, {AppStorage} from 'front-api/src/index'
import axios, {AxiosPromise, AxiosRequestConfig} from 'axios'
import {DummyAnalytics} from '../helpers'

export const getRest = (storage: AppStorage): RestApi =>
  new RestApi({
    isDev: false,
    storage,
    isLogEnabled: false,
    isLogRequest: false,
    isLogResponse: false,
    analyticsService: new DummyAnalytics(),
  })

export const makeRequest = (config: AxiosRequestConfig): AxiosPromise =>
  axios(config)
