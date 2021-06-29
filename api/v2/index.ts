import {AxiosPromise} from 'axios'
import {getSearchByFilter} from '../../helpers'
import {API_URL, makeRequest} from '../index'
import {CookiesState, Filter} from '../../types'
import {PAGE_LIMIT} from '../../stores/ProductsStore'

interface Pagination {
  page: number
  limit: number
  cacheId: string
}

// eslint-disable-next-line import/prefer-default-export
export const fetchProducts = (
  state: CookiesState,
  filter: Partial<Filter>,
  pagination?: Partial<Pagination>,
): AxiosPromise => {
  const headers = {
    lang: {
      code: state.language,
    },
    location: state.userLocation,
    pagination: {
      limit: pagination?.limit ?? PAGE_LIMIT,
      page: pagination?.page ?? 1,
    },
  }
  const sort: Partial<Filter> = {}
  if (!filter?.sortField) sort.sortField = 'date_published'
  if (!filter?.sortDirection) sort.sortDirection = 'asc'
  const data = {
    ...filter,
    ...sort,
    // location
    ...getSearchByFilter(state),
    search: '',
    appId: 'web',
  }
  return makeRequest({
    url: `${API_URL}/v2/products/search`,
    method: 'post',
    data: {
      headers,
      data,
    },
  })
}
