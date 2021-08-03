import {LocationModel} from 'front-api/src/index'

export interface LocationIdFilter {
  cityId?: number
  regionId?: number
  countryId: number
}

export interface LocationFilter {
  location: LocationModel
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
}

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
}

export interface Filter {
  condition: string
  sortField: string
  sortDirection: string
  priceMin: number
  priceMax: number
  categoryId: number
  onlyWithPhoto: boolean
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
}
