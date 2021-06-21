import {action, makeAutoObservable, toJS} from 'mobx'
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
  resetFilter: () => void
  fetchProducts: (opts: FetchOptions) => Promise<void>
}

interface FetchOptions {
  cancelTokenSource?: CancelTokenSource
  page?: number
  isScroll?: boolean
}
type State = 'done' | 'pending' | 'error' | 'pending-scroll'

export class ProductsStore implements IProductsStore {
  root

  state: State = 'done'

  products = []

  page = 1

  limit = 40

  count = null

  cacheId

  filter: Partial<Filter> = {}

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
    }
  }

  // todo move cancel token here
  fetchProducts = (opts: FetchOptions): Promise<void> => {
    this.state = opts.isScroll ? 'pending-scroll' : 'pending'
    const config: AxiosRequestConfig = {
      url: '/api/products',
      method: 'POST',
      data: {
        filter: {...this.filter},
        pagination: {page: 1, limit: this.limit},
      },
    }

    if (opts.cancelTokenSource) {
      config.cancelToken = opts.cancelTokenSource.token
    }
    if (opts.page) {
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
        } = response.data
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
    this.cacheId = data?.cacheId ?? undefined
  }
}
