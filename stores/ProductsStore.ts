import {action, makeAutoObservable} from 'mobx'
import {AdvertiseDetail, AdvertiseListItemModel} from 'front-api'
import axios, {AxiosRequestConfig, CancelTokenSource} from 'axios'
import {CACategoryDataFieldModel} from 'front-api/src/models/index'
import {isEmpty} from 'lodash'
import {RootStore} from './RootStore'
import {makeRequest} from '../api'
import {Filter} from '../types'

const cancelToken = axios.CancelToken

export interface IProductsHydration {
  products: Array<AdvertiseListItemModel>
  product: AdvertiseDetail
  freeProducts: Array<AdvertiseListItemModel>
  similarProducts: Array<AdvertiseListItemModel>
  discountedProducts: Array<AdvertiseListItemModel>
  page: number
  limit: number
  count: number
  cacheId: string
  aggregatedFields: CACategoryDataFieldModel[]
}

export interface IProductsStore {
  root: RootStore
  products: Array<AdvertiseListItemModel>
  product: AdvertiseDetail
  freeProducts: Array<AdvertiseListItemModel>
  similarProducts: Array<AdvertiseListItemModel>
  discountedProducts: Array<AdvertiseListItemModel>
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

  product

  freeProducts = []

  similarProducts = []

  discountedProducts = []

  page = 1

  limit = PAGE_LIMIT

  count = null

  cacheId

  aggregatedFields = []

  filter: Partial<Filter> = {}

  sortBy = 'date_updated-asc'

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
    this.sortBy = 'date_updated-asc'
  }

  fetchProducts = (opts?: FetchOptions): Promise<void> => {
    if (this.cancelTokenSource) this.cancelTokenSource.cancel('got_new_request')
    this.cancelTokenSource = cancelToken.source()

    this.state = opts?.isScroll ? 'pending-scroll' : 'pending'
    const [key, direction] = this.sortBy.split('-')
    const config: AxiosRequestConfig = {
      url: '/api/products',
      method: 'POST',
      data: {
        filter: {
          ...this.filter,
          sort: {key, direction},
          fieldValues: this.filter.fields,
        },
        limit: this.limit,
        page: 1,
      },
    }
    config.cancelToken = this.cancelTokenSource.token
    if (opts?.page) {
      config.data.page = opts.page
      config.data.cacheId = this.cacheId
    }

    return makeRequest(config).then(
      action('fetchSuccess', (response) => {
        if (!response.data || isEmpty(response.data)) {
          this.state = 'done'
          return Promise.resolve()
        }
        const {
          result: {aggregatedFields, data},
          headers: {
            pagination: {count, page, limit},
            cacheId,
          },
        } = response.data
        if (page === 1) {
          this.products = data
          this.cacheId = cacheId
        } else {
          this.products = [...this.products, ...data]
        }
        this.aggregatedFields = aggregatedFields
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
    this.product = data?.product ?? []
    this.freeProducts = data?.freeProducts ?? []
    this.similarProducts = data?.similarProducts ?? []
    this.discountedProducts = data?.discountedProducts ?? []
    this.page = data?.page ?? 1
    this.limit = data?.limit ?? 10
    this.count = data?.count ?? 0
    this.cacheId = data?.cacheId ?? undefined
    this.aggregatedFields = data?.aggregatedFields ?? []
  }
}
