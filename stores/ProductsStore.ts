import {action, makeAutoObservable} from 'mobx'
import {AdvertiseDetail, AdvertiseListItemModel} from 'front-api'
import axios, {AxiosRequestConfig, CancelTokenSource} from 'axios'
import {CACategoryDataFieldModel} from 'front-api/src/models'
import {isEmpty, omit} from 'lodash'
import {ParsedUrlQuery} from 'querystring'
import {toast} from 'react-toastify'
import {RootStore} from './RootStore'
import {makeRequest} from '../api'
import {Filter, ProductFetchState} from '../types'

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
  sortBy: string
  aggregatedFields: CACategoryDataFieldModel[]
  hideDistanceSort: boolean
  filter: Partial<Filter>
}

export interface IProductsStore {
  root: RootStore
  products: Array<AdvertiseListItemModel>
  otherProducts: Record<string, AdvertiseListItemModel[]>
  newProducts: Array<AdvertiseListItemModel>
  product: AdvertiseDetail
  freeProducts: Array<AdvertiseListItemModel>
  similarProducts: Array<AdvertiseListItemModel>
  discountedProducts: Array<AdvertiseListItemModel>
  hydrate(data: IProductsHydration): void
  state: ProductFetchState
  page: number
  newPage: number
  limit: number
  newLimit: number
  count: number
  newCount: number
  cacheId: string
  newCacheId: string
  aggregatedFields: CACategoryDataFieldModel[]
  newAggregatedFields: CACategoryDataFieldModel[]
  filter: Partial<Filter>
  setFilter: (filter: Partial<Filter>) => Partial<Filter>
  resetFilter: () => void
  fetchProducts: (opts?: Partial<FetchOptions>) => Promise<void>
  sortBy: string
  hideDistanceSort: boolean
  setSortBy: (value: string) => void
  applyFilter: () => void
  isFilterApplied: boolean
  setProducts: (items: AdvertiseListItemModel[], path: string) => void
}

interface FetchOptions {
  page?: number
  isScroll?: boolean
  query?: ParsedUrlQuery
}
export const PAGE_LIMIT = 40

export const defaultFilter = {
  condition: '',
  withPhoto: false,
  onlyDiscounted: false,
  onlyFromSubscribed: false,
  fields: {},
}

export class ProductsStore implements IProductsStore {
  root

  state: ProductFetchState = 'done'

  products = []

  newProducts = []

  product

  otherProducts = {}

  freeProducts = []

  similarProducts = []

  discountedProducts = []

  page = 1

  newPage = 1

  limit = PAGE_LIMIT

  newLimit = PAGE_LIMIT

  count = null

  newCount = null

  cacheId

  newCacheId

  aggregatedFields = []

  newAggregatedFields = []

  isFilterApplied

  filter: Partial<Filter> = {}

  sortBy

  hideDistanceSort = false

  private cancelTokenSource: CancelTokenSource

  constructor(root: RootStore) {
    makeAutoObservable(this, {}, {autoBind: true})
    this.root = root
  }

  setFilter = (data: Partial<Filter>): Partial<Filter> => {
    this.filter = {...this.filter, ...data}
    return this.filter
  }

  resetFilter = (): void => {
    this.filter = {
      ...defaultFilter,
      categoryId: this.filter.categoryId,
    }
  }

  setProducts = (items: AdvertiseListItemModel[], path: string): void => {
    this.otherProducts[path] = items
  }

  fetchProducts = (opts?: Partial<FetchOptions>): Promise<void> => {
    if (this.cancelTokenSource) this.cancelTokenSource.cancel('got_new_request')
    this.cancelTokenSource = cancelToken.source()

    this.state = opts?.isScroll ? 'pending-scroll' : 'pending'
    const [key, direction] = (this.sortBy || 'date_updated-asc').split('-')
    const config: AxiosRequestConfig = {
      url: '/api/products',
      method: 'POST',
      data: {
        filter: {
          ...omit(this.filter, ['fields']),
          sort: {key, direction},
          fieldValues: this.filter.fields,
        },
        limit: this.limit,
        page: 1,
        query: opts?.query,
      },
    }
    config.cancelToken = this.cancelTokenSource.token
    if (opts?.page) {
      config.data.page = opts.page
      config.data.cacheId = this.cacheId
    }

    return makeRequest(config).then(
      action('fetchSuccess', (response) => {
        if (!response.data || isEmpty(response.data) || response?.data?.error) {
          this.state = 'pending'
          if (response?.data?.error) {
            toast.error(response.data.error)
          }
          return Promise.reject(
            !response.data || isEmpty(response.data) || response?.data?.error,
          )
        }
        const {
          result: {aggregatedFields, data},
          headers: {
            pagination: {count, page, limit},
            cacheId,
          },
        } = response.data
        if (page === 1) {
          this.newProducts = data
        } else {
          this.newProducts = [...this.products, ...data]
        }
        this.newCacheId = cacheId

        this.aggregatedFields = aggregatedFields
        this.newPage = page
        this.newLimit = limit
        this.newCount = count
        this.isFilterApplied = false

        this.state = 'done'
        return Promise.resolve()
      }),
      action('fetchError', (error) => {
        if (error?.message !== 'got_new_request') {
          toast.error(error.message)
          this.state = 'error'
        }
        return Promise.reject(error)
      }),
    )
  }

  applyFilter = (): void => {
    this.products = this.newProducts
    this.cacheId = this.newCacheId
    this.page = this.newPage
    this.limit = this.newLimit
    this.count = this.newCount
    this.isFilterApplied = true
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
    this.sortBy = data?.sortBy ?? 'date_updated-asc'
    this.hideDistanceSort = data?.hideDistanceSort ?? false
    this.aggregatedFields = data?.aggregatedFields ?? []
    this.filter = data?.filter ?? {}

    this.newCount = null
    this.isFilterApplied = true
  }
}
