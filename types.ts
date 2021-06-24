import {LocationModel} from 'front-api/src/index'
import {SelectItem} from './components/Selects/Select'

export interface LocationIdFilter {
  cityId?: number
  regionId?: number
  countryISO: number
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
}

export interface Filter {
  condition: string
  priceMin: number
  priceMax: number
  categoryId: number
  onlyWithPhoto: boolean
  onlyDiscounted: boolean
  onlyFromSubscribed: boolean
  fields: Record<string, unknown>
}

export interface Size {
  width: number | undefined
  height: number | undefined
}
