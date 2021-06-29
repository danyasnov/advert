import {action, makeAutoObservable} from 'mobx'
import {AdvertiseListItemModel} from 'front-api'
import axios, {AxiosRequestConfig, CancelTokenSource} from 'axios'
import {CACategoryDataFieldModel} from 'front-api/src/models/index'
import {RootStore} from './RootStore'
import {makeRequest} from '../api'
import {Filter} from '../types'

const cancelToken = axios.CancelToken

export interface IProductsHydration {
  products: Array<AdvertiseListItemModel>
  freeProducts: Array<AdvertiseListItemModel>
  page: number
  limit: number
  count: number
  timestamp: number
  cacheId: string
  aggregatedFields: CACategoryDataFieldModel[]
}

export interface IProductsStore {
  root: RootStore
  products: Array<AdvertiseListItemModel>
  freeProducts: Array<AdvertiseListItemModel>
  hydrate(data: IProductsHydration): void
  state: State
  page: number
  limit: number
  count: number
  cacheId: string
  aggregatedFields: CACategoryDataFieldModel[]
  filter: Partial<Filter>
  setFilter: (filter: Partial<Filter>) => void
  resetFilter: () => void
  fetchProducts: (opts?: FetchOptions) => Promise<void>
  timestamp: number
  sortBy: string
  setSortBy: (value: string) => void
}

interface FetchOptions {
  page?: number
  isScroll?: boolean
}
type State = 'done' | 'pending' | 'error' | 'pending-scroll'
export const PAGE_LIMIT = 40
export class ProductsStore implements IProductsStore {
  root

  state: State = 'done'

  products = []

  freeProducts = []

  page = 1

  limit = PAGE_LIMIT

  count = null

  cacheId

  aggregatedFields = []

  timestamp = Date.now()

  filter: Partial<Filter> = {}

  sortBy = 'date_published-asc'

  private cancelTokenSource: CancelTokenSource

  constructor(root: RootStore) {
    makeAutoObservable(this, {}, {autoBind: true})
    this.root = root
  }

  setFilter = (data: Partial<Filter>): void => {
    this.filter = {...this.filter, ...data}
  }

  resetFilter = (): void => {
    this.filter = {
      condition: '',
      categoryId: this.filter.categoryId,
      onlyWithPhoto: false,
      onlyDiscounted: false,
      onlyFromSubscribed: false,
      fields: {},
    }
    this.sortBy = 'date_published-asc'
  }

  fetchProducts = (opts?: FetchOptions): Promise<void> => {
    if (this.cancelTokenSource) this.cancelTokenSource.cancel('got_new_request')
    this.cancelTokenSource = cancelToken.source()

    this.state = opts?.isScroll ? 'pending-scroll' : 'pending'
    const [sortField, sortDirection] = this.sortBy.split('-')
    const config: AxiosRequestConfig = {
      url: '/api/products',
      method: 'POST',
      data: {
        filter: {...this.filter, sortField, sortDirection},
        pagination: {page: 1, limit: this.limit},
      },
    }
    config.cancelToken = this.cancelTokenSource.token
    if (opts?.page) {
      config.data.pagination.page = opts.page
      config.data.filter.cacheId = this.cacheId
    }

    return makeRequest(config).then(
      action('fetchSuccess', (response) => {
        const {
          data,
          headers: {
            pagination: {count, page, limit},
            cacheId,
          },
          aggregatedFields,
        } = response.data
        if (page === 1) {
          this.products = data
          this.cacheId = cacheId
        } else {
          this.products = [...this.products, ...data]
        }
        this.aggregatedFields = aggregatedFields
        this.timestamp = Date.now()
        this.page = page
        this.limit = limit
        this.count = count
        this.state = 'done'
        return Promise.resolve()
      }),
      action('fetchError', (error) => {
        if (error?.message !== 'got_new_request') this.state = 'error'
        return Promise.reject(error)
      }),
    )
  }

  setSortBy = (value: string): void => {
    this.sortBy = value
  }

  hydrate(data?: IProductsHydration): void {
    this.products = data?.products ?? []
    this.freeProducts = data?.freeProducts ?? []
    this.page = data?.page ?? 1
    this.limit = data?.limit ?? 10
    this.count = data?.count ?? 0
    this.cacheId = data?.cacheId ?? undefined
    this.aggregatedFields = data?.aggregatedFields ?? []
    this.timestamp = data?.timestamp ?? Date.now()
  }
}
