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
class Storage {
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
