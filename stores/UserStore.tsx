import {action, makeAutoObservable} from 'mobx'
import {OwnerModel, ReviewModel} from 'front-api/src/models/index'
import {AdvertiseListItemModel} from 'front-api'
import axios, {AxiosRequestConfig, CancelTokenSource} from 'axios'
import {toast} from 'react-toastify'
import {isEmpty} from 'lodash'
import {RootStore} from './RootStore'
import {ProductFetchState} from '../types'
import {makeRequest} from '../api'

const cancelToken = axios.CancelToken

export interface IUserHydration {
  user: OwnerModel
  products: Record<string, Partial<ProductSummary>>
}

export interface IUserStore {
  root: RootStore
  hydrate(data: IUserHydration): void
  user: OwnerModel
  products: Record<string, Partial<ProductSummary>>
  fetchProducts: (payload: FetchPayload) => Promise<void>
  fetchRatings: () => Promise<void>
  ratings: ReviewModel[]
}

interface ProductSummary {
  items: AdvertiseListItemModel[]
  cacheId: string
  count: number
  page: number
  limit: number
  state: ProductFetchState
  cancelTokenSource?: CancelTokenSource
}

interface FetchPayload {
  path: string
  page?: number
}
const urlMap = {
  userSale: '/api/user-sale',
  userSold: '/api/user-sold',
}
export class UserStore implements IUserStore {
  root

  user

  products: Record<string, Partial<ProductSummary>> = {
    userSale: {},
    userSold: {},
  }

  ratings: ReviewModel[] = []

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
    const currentScope = this.products[path]
    if (currentScope?.cancelTokenSource) {
      currentScope.cancelTokenSource.cancel('got_new_request')
    }
    currentScope.cancelTokenSource = cancelToken.source()

    currentScope.state = 'pending-scroll'
    const config: AxiosRequestConfig = {
      url: urlMap[path],
      method: 'POST',
      data: {
        userId: this.user.hash,
        page: 1,
      },
    }
    config.cancelToken = currentScope.cancelTokenSource.token
    if (payload.page) {
      config.data.page = payload.page
      config.data.cacheId = currentScope.cacheId
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

  constructor(root: RootStore) {
    makeAutoObservable(this)
    this.root = root
  }

  hydrate(data?: IUserHydration): void {
    this.user = data?.user ?? null
    this.products = data?.products ?? {userSale: {}, userSold: {}}
  }
}
