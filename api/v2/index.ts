import {RestResponse} from 'front-api/src/api/request'
import {
  AdvertiseListResponse,
  RestFetchUserProductsPayload,
} from 'front-api/src/models/index'
import {
  AdvertiseDetail,
  AdvertiseListItemModel,
  CACategoryDataModel,
  CACategoryModel,
} from 'front-api'
import {isObject, isNil} from 'lodash'
import {AxiosPromise} from 'axios'
import {getSearchByFilter} from '../../helpers'
import {API_URL, getRest, makeRequest} from '../index'
import {CookiesState, FetchAdvertisesPayload} from '../../types'
import {PAGE_LIMIT} from '../../stores/ProductsStore'
import Storage from '../../stores/Storage'
import {defaultFilter} from '../../utils'

const cache = new Map()
export const fetchProducts = (
  state: CookiesState,
  payload: FetchAdvertisesPayload = {},
): Promise<RestResponse<AdvertiseListResponse>> => {
  const {limit = PAGE_LIMIT, page = 1, filter = {}, advHash, cacheId} = payload
  const storage = new Storage({
    language: state.language,
    location: state.searchLocation,
    userLocation: state.userLocation,
    searchRadius: state.searchRadius,
    countryId: state.countryId,
    regionId: state.regionId,
    cityId: state.cityId,
    searchBy: state.searchBy,
  })
  const rest = getRest(storage)

  const payloadFilter = {
    ...defaultFilter,
    ...getSearchByFilter(state),
    ...filter,
  }
  if (isObject(payloadFilter.fieldValues)) {
    payloadFilter.fieldValues = new Map(
      Object.entries(payloadFilter.fieldValues),
    )
  }
  if (!isNil(filter.priceMax)) {
    payloadFilter.priceMax = payloadFilter.priceMax.toString()
  }
  if (!isNil(filter.priceMin)) {
    payloadFilter.priceMin = payloadFilter.priceMin.toString()
  }
  const payloadData = {
    limit,
    page,
    advHash,
    cacheId,
    filter: payloadFilter,
  }

  // @ts-ignore
  return rest.advertises.fetchList(payloadData)
}

export const fetchCategories = async (
  language: string,
): Promise<RestResponse<CACategoryModel[]>> => {
  const key = `categories-${language}`

  const cached: RestResponse<CACategoryModel[]> = cache.get(key)
  if (cached) return cached
  const storage = new Storage({
    language,
  })
  const rest = getRest(storage)
  const result = rest.categories.fetchTree(false)
  cache.set(key, result)

  return result
}

export const fetchCategoryData = (
  state: CookiesState,
  id: number,
): Promise<RestResponse<CACategoryDataModel>> => {
  const storage = new Storage({
    language: state.language,
    location: state.searchLocation,
    userLocation: state.userLocation,
    searchRadius: state.searchRadius,
    countryId: state.countryId,
    regionId: state.regionId,
    cityId: state.cityId,
    searchBy: state.searchBy,
  })
  const rest = getRest(storage)
  return rest.categories.fetchCategoryData(id)
}

export const fetchProductDetails = (
  state: CookiesState,
  hash: string,
): Promise<RestResponse<AdvertiseDetail>> => {
  const storage = new Storage({
    language: state.language,
    location: state.searchLocation,
    userLocation: state.userLocation,
    searchRadius: state.searchRadius,
    countryId: state.countryId,
    regionId: state.regionId,
    cityId: state.cityId,
    searchBy: state.searchBy,
  })
  const rest = getRest(storage)
  return rest.advertises.fetchDetail(hash)
}

export const fetchProductByUrl = (
  lang: string,
  url: string,
): AxiosPromise<{data: AdvertiseDetail}> => {
  return makeRequest({
    method: 'post',
    url: `${API_URL}/v2/advert/by-url`,
    data: {
      data: {url},
      headers: {lang: {code: lang}},
    },
  })
}

export const fetchUserSale = (
  payload: RestFetchUserProductsPayload,
  language: string,
): Promise<RestResponse<Array<AdvertiseListItemModel>>> => {
  const storage = new Storage({
    language,
  })
  const rest = getRest(storage)
  return rest.advertises.fetchUserSaleProducts(payload)
}

export const fetchUserSold = (
  payload: RestFetchUserProductsPayload,
  language: string,
): Promise<RestResponse<Array<AdvertiseListItemModel>>> => {
  const storage = new Storage({
    language,
  })
  const rest = getRest(storage)
  return rest.advertises.fetchUserSoldProducts(payload)
}

export const fetchUserFavorites = (
  payload: RestFetchUserProductsPayload,
  language: string,
  token: string,
  userHash: string,
): Promise<RestResponse<Array<AdvertiseListItemModel>>> => {
  const storage = new Storage({
    language,
    token,
    userHash,
  })
  const rest = getRest(storage)
  return rest.advertises.fetchUserFavorites(payload)
}

export const fetchUserOnModeration = (
  payload: RestFetchUserProductsPayload,
  language: string,
  token: string,
  userHash: string,
): Promise<RestResponse<Array<AdvertiseListItemModel>>> => {
  const storage = new Storage({
    language,
    token,
    userHash,
  })
  const rest = getRest(storage)
  return rest.advertises.fetchUserOnModerationProducts(payload)
}

export const fetchUserArchive = (
  payload: RestFetchUserProductsPayload,
  language: string,
  token: string,
  userHash: string,
): Promise<RestResponse<Array<AdvertiseListItemModel>>> => {
  const storage = new Storage({
    language,
    token,
    userHash,
  })
  const rest = getRest(storage)
  return rest.advertises.fetchUserArchiveProducts(payload)
}
