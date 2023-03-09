import {AdvertiseListItemModel, LocationModel} from 'front-api/src/index'
import {CancelTokenSource} from 'axios'
import {FormikErrors} from 'formik'

export interface LocationIdFilter {
  cityId?: number
  regionId?: number
  countryId: number
}

export interface LocationFilter {
  location: LocationModel
}
export interface Country {
  label: string
  value: string
  phonePrefix: string
  phoneMask: string
  phoneLength: number
  isoCode?: string
}
export interface CookiesState {
  userLocation?: LocationModel
  searchLocation?: LocationModel
  searchRadius?: number
  countryId?: string
  regionId?: string
  cityId?: string
  searchBy?: 'coords' | 'id'
  address?: string
  language?: string
  countryCode?: string
  regionOrCityCode?: string
  showDevBanner?: boolean
  cookieAccepted?: boolean
  showLocationPopup?: boolean
  userCountryId?: string
  hash?: string
  promo?: string
  authType?: number
  phone?: string
  sessionId?: string
  token?: string
  authNewToken?: string
  authNewRefreshToken?: string
  aup?: string
  showCreateAdvMapHint?: boolean
  showBottomSheet?: boolean
}

export type ProductFetchState = 'done' | 'pending' | 'error' | 'pending-scroll'

export interface SerializedCookiesState {
  userLocation?: string
  searchLocation?: string
  searchRadius?: string
  countryId?: string
  regionId?: string
  cityId?: string
  searchBy?: 'coords' | 'id'
  address?: string
  language?: string
  countryCode?: string
  regionOrCityCode?: string
  showDevBanner?: string
  cookieAccepted?: string
  showLocationPopup?: string
  userCountryId?: string
  hash?: string
  promo?: string
  authType?: string
  phone?: string
  sessionId?: string
  token?: string
  authNewToken?: string
  authNewRefreshToken?: string
  aup?: string
  showCreateAdvMapHint?: string
  showBottomSheet?: string
}

export interface Filter {
  condition: string
  sortField: string
  sortDirection: string
  priceMin: number
  priceMax: number
  categoryId: number
  withPhoto: boolean
  onlyDiscounted: boolean
  onlyFromSubscribed: boolean
  search: string
  sort: {key: string; direction: string}
  fields: Record<string, unknown>
}

export interface Size {
  width: number | undefined
  height: number | undefined
}
export interface FetchAdvertisesPayload {
  limit?: number
  page?: number
  filter?: Partial<Filter>
  advHash?: string
  cacheId?: string
}

export interface City {
  id: number
  word: string
  // eslint-disable-next-line camelcase
  has_adverts: '0' | '1'
  slug: string
  type?: string
}
export interface CoverLink {
  // eslint-disable-next-line camelcase
  hash_link: string
  // eslint-disable-next-line camelcase
  firebase_link: string
  // eslint-disable-next-line camelcase
  date_off: number
}
export interface ProductSummary {
  items: AdvertiseListItemModel[]
  cacheId: string
  count: number
  page: number
  limit: number
  state: ProductFetchState
  cancelTokenSource?: CancelTokenSource
}

export interface ThumbObject {
  src: string
  type: 'image' | 'video'
}

export type PhotoFile = File & {url: string; hash: number}
export type VideoFile = File & {loading: boolean; url: string; hash: number}
export interface NavItem {
  key: string
  validate: (values: any, silently?: boolean) => FormikErrors<any>
  status?: 'done' | 'pending'
  visible?: boolean
  required?: boolean
  filled?: boolean
  state?: FormikErrors<any>
}
