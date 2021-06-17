import {AxiosPromise} from 'axios'
import {getSearchByFilter} from '../../helpers'
import {API_URL, makeRequest} from '../index'
import {CookiesState, Filter} from '../../types'

interface Pagination {
  page: number
  limit: number
  cacheId: string
}

// eslint-disable-next-line import/prefer-default-export
export const fetchProducts = (
  state: CookiesState,
  opts: Partial<Filter>,
  pagination: Partial<Pagination>,
): AxiosPromise => {
  const headers = {
    lang: {
      code: state.language,
    },
    location: state.userLocation,
    user: null,
    security: {
      token: '74323bdc165babb451258da4a7dd046e:1',
    },
    pagination: {
      limit: pagination?.limit ?? 10,
      page: pagination?.page ?? 1,
    },
  }
  const data = {
    ...opts,
    ...getSearchByFilter(state),
    searchId: '',
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
