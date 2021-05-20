import {AppStorage, LocationModel} from 'front-api'

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
  | 'searchRadius'
  | 'appVersion'
  | 'firstStartApp'
  | 'categories'
  | 'categoryVersion'
  | 'isOnboardShown'
  | 'degradationType'

class Storage implements AppStorage {
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

  language = 'en'

  location: LocationModel = {
    latitude: 37.785834,
    longitude: -122.406417,
  }

  userLocation: LocationModel

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
}

export const storage = new Storage()
