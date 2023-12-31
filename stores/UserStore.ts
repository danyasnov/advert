import {action, makeAutoObservable, toJS} from 'mobx'
import {DraftModel, OwnerModel, ReviewModel} from 'front-api/src/models/index'
import axios, {AxiosRequestConfig} from 'axios'
import {toast} from 'react-toastify'
import {isEmpty} from 'lodash'
import {RootStore} from './RootStore'
import {ProductSummary} from '../types'
import {makeRequest} from '../api'

const cancelToken = axios.CancelToken

export interface IUserHydration {
  user: OwnerModel
  userSale: ProductSummary
}

export interface IUserStore {
  root: RootStore
  hydrate(data: IUserHydration): void
  user: OwnerModel
  userSale: Partial<ProductSummary>
  drafts: Partial<ProductSummary>
  userSold: Partial<ProductSummary>
  userFavorite: Partial<ProductSummary>
  userOnModeration: Partial<ProductSummary>
  userArchive: Partial<ProductSummary>
  fetchProducts: (payload: FetchPayload) => Promise<void>
  fetchRatings: () => Promise<void>
  setUserPersonalData: (data: {
    name?: string
    surname?: string
    sex?: string
    phoneNum?: string
  }) => void
  setUserLanguages: (data: {isoCode: string}[]) => void
  ratings: ReviewModel[]
}

interface FetchPayload {
  path: string
  page?: number
  limit?: number
}
const urlMap = {
  userSale: '/api/user-sale',
  userSold: '/api/user-sold',
  userFavorite: '/api/user-favorites',
  userOnModeration: '/api/user-on-moderation',
  userArchive: '/api/user-archive',
  drafts: '/api/fetch-drafts',
}
export class UserStore implements IUserStore {
  root

  user

  userSale: Partial<ProductSummary> = {state: 'pending'}

  userSold: Partial<ProductSummary> = {state: 'pending'}

  userFavorite: Partial<ProductSummary> = {state: 'pending'}

  userOnModeration: Partial<ProductSummary> = {state: 'pending'}

  userArchive: Partial<ProductSummary> = {state: 'pending'}

  drafts: Partial<ProductSummary> = {state: 'pending'}

  ratings: ReviewModel[]

  fetchRatings = (): Promise<void> => {
    const config: AxiosRequestConfig = {
      url: '/api/user-ratings',
      method: 'POST',
      data: {
        userId: this.user.hash,
      },
    }

    return makeRequest(config).then(
      action('fetchSuccess', (response) => {
        if (!response.data || isEmpty(response.data) || response?.data?.error) {
          if (response?.data?.error) {
            toast.error(response.data.error)
          }
          return Promise.reject(
            !response.data || isEmpty(response.data) || response?.data?.error,
          )
        }

        this.ratings = response?.data?.result

        return Promise.resolve()
      }),
      action('fetchError', (error) => {
        if (error?.message !== 'got_new_request') {
          toast.error(error.message)
        }
        return Promise.reject(error)
      }),
    )
  }

  fetchProducts = (payload: FetchPayload): Promise<void> => {
    const {path} = payload
    const currentScope = this[path]
    if (currentScope?.cancelTokenSource) {
      currentScope.cancelTokenSource.cancel('got_new_request')
    }
    currentScope.cancelTokenSource = cancelToken.source()

    currentScope.state = 'pending'
    const config: AxiosRequestConfig = {
      url: urlMap[path],
      method: 'POST',
      data: {
        userId: this.user.hash,
        page: 1,
      },
    }
    config.cancelToken = currentScope.cancelTokenSource.token
    if (payload.page && payload.page !== 1) {
      config.data.page = payload.page
      config.data.cacheId = currentScope.cacheId
    }
    // fetch drafts
    if (payload.limit) {
      config.data.limit = payload.limit
      config.data.userId = undefined
    }

    return makeRequest(config).then(
      action('fetchSuccess', (response) => {
        if (!response.data || isEmpty(response.data) || response?.data?.error) {
          currentScope.state = 'pending'
          if (response?.data?.error) {
            toast.error(response.data.error)
          }
          return Promise.reject(
            !response.data || isEmpty(response.data) || response?.data?.error,
          )
        }
        const {
          result,
          headers: {
            pagination: {count, page, limit},
            cacheId,
          },
        } = response.data
        if (page === 1) {
          currentScope.items = result
        } else {
          currentScope.items = [...(currentScope.items || []), ...result]
        }
        currentScope.cacheId = cacheId

        currentScope.page = page
        currentScope.limit = limit
        currentScope.count = count

        currentScope.state = 'done'
        return Promise.resolve()
      }),
      action('fetchError', (error) => {
        if (error?.message !== 'got_new_request') {
          toast.error(error.message)
          currentScope.state = 'error'
        }
        return Promise.reject(error)
      }),
    )
  }

  setUserPersonalData = (data) => {
    this.user.settings.personal = {...this.user.settings.personal, ...data}
    if (data.name) this.user.name = data.name
    if (data.surname) this.user.surname = data.surname
  }

  setUserLanguages = (data) => {
    this.user.additionalLanguages = data
  }

  constructor(root: RootStore) {
    makeAutoObservable(this)
    this.root = root
  }

  hydrate(data?: IUserHydration): void {
    this.user = data?.user ?? null
    this.userSale = data?.userSale ?? {}
  }
}
