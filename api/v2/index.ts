import {RestResponse} from 'front-api/src/api/request'
import {
  AdvertiseListResponse,
  CatalogFieldDependentResponse,
  CheckPhonePermissions,
  FieldsModel,
  Gender,
  OwnerModel,
  RemoveFromSaleType,
  RestFetchUserProductsPayload,
} from 'front-api/src/models'
import {
  AdvertiseDetail,
  AdvertiseListItemModel,
  CACategoryDataModel,
  CACategoryModel,
  CAParamsModel,
  Unknown,
} from 'front-api'
import {isObject, isNil} from 'lodash'
import {AxiosPromise, AxiosRequestHeaders} from 'axios'
import NodeCache from 'node-cache'
import {
  AuthExistsResponse,
  AuthTokensResponse,
  ChangeContactRequestResolution,
  ChangeContactResponse,
  Credentials,
  Incoming,
  VerifyMode,
} from 'front-api/src/models/auth'
import {getSearchByFilter} from '../../helpers'
import {API_URL, getRest, makeRequest} from '../index'
import {CookiesState, FetchAdvertisesPayload} from '../../types'
import {PAGE_LIMIT} from '../../stores/ProductsStore'
import Storage from '../../stores/Storage'
import {defaultFilter} from '../../utils'

const cache = new NodeCache({stdTTL: 60 * 60 * 24})
export const fetchProducts = (
  state: CookiesState,
  payload: FetchAdvertisesPayload = {},
  storage: Storage,
): Promise<RestResponse<AdvertiseListResponse>> => {
  const {limit = PAGE_LIMIT, page = 1, filter = {}, advHash, cacheId} = payload
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
  storage: Storage,
): Promise<RestResponse<CACategoryModel[]>> => {
  const key = `categories-${storage.language}`

  const cached: RestResponse<CACategoryModel[]> = cache.get(key)

  if (cached) return cached

  const rest = getRest(storage)
  const result = await rest.categories.fetchTree(false)
  if (result.status === 200) cache.set(key, result)

  return result
}

export const fetchCategoryData = async (
  storage: Storage,
  id: number,
  editFields?: FieldsModel,
  excludeDependentFields?: boolean,
): Promise<RestResponse<CACategoryDataModel>> => {
  const key = `category-data-${id}-${storage.language}`
  const cached: RestResponse<CACategoryDataModel> = await cache.get(key)
  if (cached) return cached

  const rest = getRest(storage)
  const categoryData = await rest.categories.fetchCategoryData({
    id,
    editFields,
    excludeDependentFields,
  })
  if (categoryData.status === 200) cache.set(key, categoryData)
  return categoryData
}

export const fetchDependentFields = (
  storage: Storage,
  dependenceSequenceId: number,
  dependenceSequence: Array<number>,
  otherValueWasSelected,
): Promise<RestResponse<CatalogFieldDependentResponse>> => {
  const rest = getRest(storage)
  return rest.categories.fetchCatalogFieldDependent(
    dependenceSequenceId,
    dependenceSequence,
    otherValueWasSelected,
  )
}

export const fetchProductDetails = (
  storage: Storage,
  hash: string,
): Promise<RestResponse<AdvertiseDetail>> => {
  const rest = getRest(storage)
  return rest.advertises.fetchDetail(hash)
}

export const fetchEditAdvertise = (
  storage: Storage,
  hash: string,
): Promise<RestResponse<CAParamsModel>> => {
  const rest = getRest(storage)
  return rest.createAdvertise.fetchEditAdvertise(hash)
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
export const handleClickHouse = ({
  eventType,
  sessionId,
  token,
  data,
}): AxiosPromise<{data: AdvertiseDetail}> => {
  const headers: AxiosRequestHeaders = {}
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  return makeRequest({
    method: 'post',
    url: `${API_URL}/v2/statistics/event`,
    data: {
      eventType,
      data,
      sessionId,
    },
    headers,
  })
}

export const fetchUserSale = (
  payload: RestFetchUserProductsPayload,
  storage: Storage,
): Promise<RestResponse<Array<AdvertiseListItemModel>>> => {
  const rest = getRest(storage)
  return rest.advertises.fetchUserSaleProducts(payload)
}

export const fetchUserSold = (
  payload: RestFetchUserProductsPayload,
  storage: Storage,
): Promise<RestResponse<Array<AdvertiseListItemModel>>> => {
  const rest = getRest(storage)
  return rest.advertises.fetchUserSoldProducts(payload)
}

export const fetchUserFavorites = (
  payload: RestFetchUserProductsPayload,
  storage: Storage,
): Promise<RestResponse<Array<AdvertiseListItemModel>>> => {
  const rest = getRest(storage)
  return rest.advertises.fetchUserFavorites(payload)
}

export const fetchUserOnModeration = (
  payload: RestFetchUserProductsPayload,
  storage: Storage,
): Promise<RestResponse<Array<AdvertiseListItemModel>>> => {
  const rest = getRest(storage)
  return rest.advertises.fetchUserOnModerationProducts(payload)
}

export const fetchUserArchive = (
  payload: RestFetchUserProductsPayload,
  storage: Storage,
): Promise<RestResponse<Array<AdvertiseListItemModel>>> => {
  const rest = getRest(storage)
  return rest.advertises.fetchUserArchiveProducts(payload)
}

export const deleteAdv = (hash: string, storage: Storage) => {
  const rest = getRest(storage)
  return rest.advertises.delete(hash)
}

export const deleteDraft = (hash: string, storage: Storage) => {
  const rest = getRest(storage)
  return rest.createAdvertise.deleteDraft([hash])
}

export const publishAdv = (hash: string, storage: Storage) => {
  const rest = getRest(storage)
  return rest.advertises.activate(hash)
}
export const deactivateAdv = (
  hash: string,
  soldMode: RemoveFromSaleType,
  storage: Storage,
) => {
  const rest = getRest(storage)
  return rest.advertises.deactivate(hash, soldMode)
}

export const submitDraft = (
  storage: Storage,
  params: CAParamsModel,
  shouldUpdate: boolean,
  dependenceSequenceId: number | Unknown,
) => {
  const rest = getRest(storage)
  return rest.createAdvertise.submitAdvertise(
    params,
    shouldUpdate,
    dependenceSequenceId,
  )
}
export const saveDraft = (
  storage: Storage,
  draft: CAParamsModel,
  hash?: string,
) => {
  const rest = getRest(storage)
  return rest.createAdvertise.saveDraft({draft, hash})
}
export const fetchDraft = (hash: string, storage: Storage) => {
  const rest = getRest(storage)
  return rest.createAdvertise.fetchDraft(hash)
}

export const fetchDrafts = (storage: Storage) => {
  const rest = getRest(storage)
  return rest.createAdvertise.fetchListDrafts({limit: 50, page: 1})
}

export const checkExisting = async (
  data: {
    email: string
    phone: string
  },
  storage: Storage,
): Promise<RestResponse<AuthExistsResponse>> => {
  const rest = getRest(storage)
  return rest.user.checkExisting(data)
}
export const authEmail = async (
  email: string,
  password: string,
  storage: Storage,
): Promise<RestResponse<AuthTokensResponse>> => {
  const rest = getRest(storage)
  return rest.auth.authEmail(email, password)
}

export const register = async (
  credentials: Credentials,
  params: {
    name: string
    surname: string
    imageId?: string
    recaptchaToken?: string
  },
  storage: Storage,
): Promise<RestResponse<AuthTokensResponse>> => {
  const rest = getRest(storage)
  return rest.user.register(credentials, params)
}

export const sendCode = async (
  incoming: Incoming,
  verifyMode: VerifyMode,
  storage: Storage,
): Promise<RestResponse<AuthTokensResponse>> => {
  const rest = getRest(storage)
  return rest.auth.sendCode(incoming, verifyMode)
}
export const checkCode = async (
  incoming: Incoming,
  verifyMode: VerifyMode,
  code: string,
  storage: Storage,
): Promise<RestResponse<AuthTokensResponse>> => {
  const rest = getRest(storage)
  return rest.auth.checkCode(incoming, verifyMode, code)
}

export const changeContact = async (
  verifyMode: VerifyMode,
  code: string,
  incoming: Incoming,
  storage: Storage,
  conflictsResolving?: {
    manualResolving: boolean
    resolution?: ChangeContactRequestResolution[]
  },
): Promise<RestResponse<ChangeContactResponse>> => {
  const rest = getRest(storage)
  return rest.user.changeContact(verifyMode, code, incoming, conflictsResolving)
}
export const changePersonalData = async (
  params: {
    name: string
    surname: string
    gender: Gender
    avaHash?: string
  },
  storage,
): Promise<RestResponse<ChangeContactResponse>> => {
  const rest = getRest(storage)
  return rest.user.changePersonalData(params)
}

export const fetchUser = async (
  id: string,
  storage: Storage,
): Promise<RestResponse<OwnerModel>> => {
  const rest = getRest(storage)
  const userData = await rest.user.userInfo(id)
  if (userData.result && userData.result.settings) {
    if (userData.result.settings.personal === undefined) {
      userData.result.settings.personal = null
    }
  }
  return userData
}
export const checkPhonePermissions = (
  id: string,
  ip: string,
  storage: Storage,
): Promise<RestResponse<CheckPhonePermissions>> => {
  const rest = getRest(storage)
  return rest.advertises.checkPhonePermissions(id, ip)
}
export const fetchBanners = (): Promise<any> => {
  return makeRequest({method: 'get', url: `${API_URL}/v2/banners`})
}
