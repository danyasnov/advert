import {action, makeAutoObservable} from 'mobx'
import {AdvertiseListItemModel} from 'front-api'
import {AxiosRequestConfig, CancelTokenSource} from 'axios'
import {RootStore} from './RootStore'
import {makeRequest} from '../api'
import {Filter} from '../types'

export interface IProductsHydration {
  products: Array<AdvertiseListItemModel>
  page: number
  limit: number
  count: number
  cacheId: string
}

export interface IProductsStore {
  root: RootStore
  products: Array<AdvertiseListItemModel>
  hydrate(data: IProductsHydration): void
  state: State
  page: number
  limit: number
  count: number
  cacheId: string
  filter: Partial<Filter>
  setFilter: (filter: Partial<Filter>) => void
  fetchProducts: (opts: FetchOptions) => Promise<void>
}

interface FetchOptions {
  cancelTokenSource?: CancelTokenSource
  page?: number
}
type State = 'done' | 'pending' | 'error'

export class ProductsStore implements IProductsStore {
  root

  state: State = 'done'

  products = []

  page = 1

  limit = null

  count = null

  cacheId = null

  filter: Partial<Filter> = {}

  constructor(root: RootStore) {
    makeAutoObservable(this, {}, {autoBind: true})
    this.root = root
  }

  setFilter = (data: Partial<Filter>): void => {
    this.filter = {...this.filter, ...data}
  }

  fetchProducts = (opts: FetchOptions): Promise<void> => {
    this.state = 'pending'
    const config: AxiosRequestConfig = {
      url: '/api/products',
      method: 'POST',
      data: {
        data: this.filter,
        pagination: {page: 1, limit: 10},
      },
    }

    if (opts.cancelTokenSource) {
      config.cancelToken = opts.cancelTokenSource.token
    }
    if (opts.page) {
      config.data.pagination.page = opts.page
      config.data.data.cacheId = this.cacheId
    }

    return makeRequest(config).then(
      action('fetchSuccess', (response) => {
        const {
          data,
          headers: {
            pagination: {count, page, limit},
            cacheId,
          },
        } = response.data
        console.log(data, count, page)
        if (page === 1) {
          this.products = data
          this.cacheId = cacheId
        } else {
          this.products = [...this.products, ...data]
        }
        this.page = page
        this.limit = limit
        this.count = count
        this.state = 'done'
        return Promise.resolve()
      }),
      action('fetchError', (error) => {
        this.state = 'error'
        return Promise.reject()
      }),
    )
  }

  hydrate(data?: IProductsHydration): void {
    this.products = data?.products ?? []
    this.page = data?.page ?? 1
    this.limit = data?.limit ?? 10
    this.count = data?.count ?? 0
    this.cacheId = data?.cacheId ?? ''
  }
}
