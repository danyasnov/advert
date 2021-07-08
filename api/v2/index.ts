import {RestResponse} from 'front-api/src/api/request'
import {AdvertiseListResponse} from 'front-api/src/models/index'
import {AdvertiseDetail, CACategoryDataModel, CACategoryModel} from 'front-api'
import {isObject, isNil} from 'lodash'
import {getSearchByFilter} from '../../helpers'
import {getRest} from '../index'
import {CookiesState, FetchAdvertisesPayload} from '../../types'
import {PAGE_LIMIT} from '../../stores/ProductsStore'
import Storage from '../../stores/Storage'
import {defaultFilter} from '../../utils'

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

export const fetchCategories = (
  language: string,
): Promise<RestResponse<CACategoryModel[]>> => {
  const storage = new Storage({
    language,
  })
  const rest = getRest(storage)
  return rest.categories.fetchTree()
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
