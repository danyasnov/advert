import {RestResponse} from 'front-api/src/api/request'
import {
  AdvertiseListResponse,
  FieldsModel,
  RemoveFromSaleType,
  RestFetchUserProductsPayload,
} from 'front-api/src/models/index'
import {
  AdvertiseDetail,
  AdvertiseListItemModel,
  CACategoryDataModel,
  CACategoryModel,
  CAParamsModel,
  Unknown,
} from 'front-api'
import {isObject, isNil} from 'lodash'
import {AxiosPromise} from 'axios'
import {getSearchByFilter} from '../../helpers'
import {API_URL, getRest, makeRequest} from '../index'
import {
  CookiesState,
  FetchAdvertisesPayload,
  SerializedCookiesState,
} from '../../types'
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
    userHash: state.hash,
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
  editFields?: FieldsModel,
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
  return rest.categories.fetchCategoryData({id, editFields})
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
  userHash?: string,
): AxiosPromise<{data: AdvertiseDetail}> => {
  const data = {
    data: {url},
    headers: {
      lang: {code: lang},
      ...(userHash ? {user: {hash: userHash}} : {}),
    },
  }
  return makeRequest({
    method: 'post',
    url: `${API_URL}/v2/advert/by-url`,
    data,
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

export const deleteAdv = (
  hash: string,
  language: string,
  token: string,
  userHash: string,
) => {
  const storage = new Storage({
    language,
    token,
    userHash,
  })
  const rest = getRest(storage)
  return rest.advertises.delete(hash)
}

export const publishAdv = (
  hash: string,
  language: string,
  token: string,
  userHash: string,
) => {
  const storage = new Storage({
    language,
    token,
    userHash,
  })
  const rest = getRest(storage)
  return rest.advertises.activate(hash)
}
export const deactivateAdv = (
  hash: string,
  soldMode: RemoveFromSaleType,
  language: string,
  token: string,
  userHash: string,
) => {
  const storage = new Storage({
    language,
    token,
    userHash,
  })
  const rest = getRest(storage)
  return rest.advertises.deactivate(hash, soldMode)
}

export const submitDraft = (
  state: CookiesState,
  params: CAParamsModel,
  shouldUpdate: boolean,
  dependenceSequenceId: number | Unknown,
) => {
  const storage = new Storage({
    token: state.token,
    userHash: state.hash,
  })
  const rest = getRest(storage)
  return rest.createAdvertise.submitAdvertise(
    params,
    shouldUpdate,
    dependenceSequenceId,
  )
}
