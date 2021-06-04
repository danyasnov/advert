import {AppStorage, emptyLocation, LocationModel} from 'front-api'

export type StorageKey =
  | 'authType'
  | 'email'
  | 'password'
  | 'promo'
  | 'hash'
  | 'phone'
  | 'socialId'
  | 'fcmToken'
  | 'language'
  | 'withPhoto'
  | 'addressText'
  | 'defaultAddressText'
  | 'location'
  | 'defaultLocation'
  | 'userLocation'
  | 'searchRadius'
  | 'appVersion'
  | 'firstStartApp'
  | 'categories'
  | 'categoryVersion'
  | 'isOnboardShown'
  | 'degradationType'
  | 'countryId'
  | 'regionId'
  | 'cityId'
  | 'searchBy'

interface StorageOptions {
  language: string
  location?: LocationModel
  userLocation?: LocationModel
  searchRadius?: number
  countryId?: number | string
  regionId?: number | string
  cityId?: number | string
  searchBy?: 'coords' | 'id'
}

export class Storage implements AppStorage {
  constructor(data: StorageOptions) {
    const {
      language,
      location,
      userLocation,
      searchRadius,
      countryId,
      cityId,
      regionId,
      searchBy,
    } = data
    this.store = {
      language,
      location,
      userLocation,
      searchRadius,
      countryId,
      cityId,
      regionId,
      searchBy,
    }
  }

  fcmToken: string

  get language(): string {
    return this.value<string>('language') ?? 'en'
  }

  saveAppVersion = (version: any) => {
    throw new Error('Method not implemented.')
  }

  setUserLocation = (location: LocationModel) => {
    throw new Error('Method not implemented.')
  }

  setLocation = (location: LocationModel) => {
    throw new Error('Method not implemented.')
  }

  saveAddressText = (address: string) => {
    throw new Error('Method not implemented.')
  }

  platform: 'ios' | 'android' | 'web' = 'web'

  get location(): LocationModel {
    return this.value<LocationModel>('location')
  }

  get userLocation(): LocationModel | null {
    return this.value<LocationModel>('userLocation')
  }

  store = {}

  value = <T>(key: StorageKey): T | null => {
    const value = this.store[key]
    if (value === undefined || value === null) return null
    return value as T
  }

  required = <T>(key: StorageKey): T => {
    if (!this.store) throw new Error('profile is not set')
    const value = this.store[key]
    if (!value) throw new Error(`value for key: ${key} is not set`)
    return value as T
  }

  get searchAddress(): string | null {
    return this.value<string>('addressText')
  }

  get userHash(): string | null {
    return this.value<string>('hash')
  }
}
