import {
  AdvertiseListItemModel,
  CACategoryDataFieldModel,
  LocationModel,
} from 'front-api'
import {CancelTokenSource} from 'axios'
import {FormikErrors} from 'formik'
import {SelectItem} from './components/Selects/Select'

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
  hideNotificationRequest?: boolean
  isCyprus?: boolean
  showBottomSheet?: boolean
  visitMainPageCount?: number
  visitProductTourCount?: number
  visitCurrentUserTourCount?: number
  visitUserTourCount?: number
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
  isCyprus?: string
  sessionId?: string
  token?: string
  authNewToken?: string
  authNewRefreshToken?: string
  aup?: string
  showCreateAdvMapHint?: string
  showBottomSheet?: string
  visitMainPageCount?: string
  visitProductTourCount?: string
  visitCurrentUserTourCount?: string
  visitUserTourCount?: string
  hideNotificationRequest?: string
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
export type TGetOptions = ({
  hash,
  state,
  showRefreshButton,
  title,
  images,
}) => any[]

export interface IFormikSegmented {
  options: SelectItem[]
}
export interface IFormikCheckbox {
  label: string
  labelClassname: string
  hideLabel?: boolean
  labelPosition?: 'left' | 'right'
}
export interface IFormikSelect {
  label: string
  options: SelectItem[]
  other?: SelectItem[]
  placeholder: string
  isFilterable: boolean
  isClearable: boolean
  isMulti: boolean
  filterStyle?: boolean
  isIconSelect?: boolean
  limit?: number
  styles?: Record<any, any>
}
export interface IFormikRange {
  placeholder: string
  minValue?: number
  maxValue?: number
}
export interface IFormikNumber {
  placeholder: string
  value: number
  mask?: string
  maxLength?: number
  format?: string
  thousandSeparator?: string
  allowEmptyFormatting?: boolean
  disableTrack?: boolean
}
export interface IFormikField {
  field: CACategoryDataFieldModel
}
export interface IFormikDependentField {
  onFieldsChange?: (fields: CACategoryDataFieldModel[]) => void
  allFields?: CACategoryDataFieldModel[]
}

export interface FieldOptions {
  options?: SelectItem[]
  other?: SelectItem[]
  placeholder?: string
  label?: string
  isFilterable?: boolean
  isClearable?: boolean
  isMulti?: boolean
  hideLabel?: boolean
  maxLength?: number
  maxValue?: number
  filterStyle?: boolean
  isIconSelect?: boolean
  minValue?: number
  validate?: (value: any) => string
}
