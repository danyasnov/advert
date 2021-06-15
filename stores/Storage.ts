import {AppStorage, AuthType, LocationModel, emptyLocation} from 'front-api'
import {BASIC_RADIUS} from 'front-api/src/models/index'

interface CurrentProfile {
  authType?: AuthType
  email?: string
  password?: string
  promo?: string
  hash?: string
  phone?: string
  socialId?: string
  fcmToken?: string
  language?: string
  countryId?: string
  regionId?: string
  cityId?: string
  searchBy?: 'coords' | 'id'
  withPhoto: boolean
  addressText?: string
  location: LocationModel | null
  userLocation: LocationModel | null
  searchRadius?: number
}
interface StorageOptions {
  language: string
  location?: LocationModel
  userLocation?: LocationModel
  searchRadius?: number
  countryId?: string
  regionId?: string
  cityId?: string
  searchBy?: 'coords' | 'id'
}

export default class Storage implements AppStorage {
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
    this.memoryState = {
      withPhoto: false,
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

  memoryState: CurrentProfile | undefined

  get language(): string {
    let lang = this.memoryState?.language
    if (!lang) {
      lang = 'en'
    }
    return lang
  }

  get location(): LocationModel {
    return (
      this.memoryState?.location ??
      this.memoryState?.userLocation ??
      emptyLocation
    )
  }

  get countryId(): number | null {
    return this.memoryState.countryId
      ? Number(this.memoryState.countryId)
      : null
  }

  get regionId(): number | null {
    return this.memoryState.regionId ? Number(this.memoryState.regionId) : null
  }

  get cityId(): number | null {
    return this.memoryState.cityId ? Number(this.memoryState.cityId) : null
  }

  get searchBy(): 'coords' | 'id' {
    return this.memoryState.searchBy
  }

  get searchRadius(): number {
    return this.memoryState.searchRadius ?? BASIC_RADIUS
  }

  searchAddress: string

  get userLocation(): LocationModel | null {
    return this.memoryState?.userLocation ?? null
  }

  userHash: string

  phone: string

  withPhoto: boolean

  authType: AuthType

  fcmToken: string

  password: string

  socialId: string

  promo: string

  email: string

  appVersion: number

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
}
