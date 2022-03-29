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
  userHash?: string
  token?: string
  cityId?: string
  searchBy?: 'coords' | 'id'
  withPhoto: boolean
  addressText?: string
  location: LocationModel | null
  userLocation: LocationModel | null
  searchRadius?: number
}
export interface StorageOptions {
  language?: string
  location?: LocationModel
  userLocation?: LocationModel
  searchRadius?: number
  countryId?: string
  regionId?: string
  cityId?: string
  searchBy?: 'coords' | 'id'
  authType?: AuthType
  userHash?: string
  email?: string
  password?: string
  phone?: string
  promo?: string
  socialId?: string
  token?: string
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
      authType,
      userHash,
      email,
      password,
      phone,
      promo,
      socialId,
      token,
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
      authType,
      userHash,
      email,
      password,
      phone,
      promo,
      socialId,
      token,
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

  get authType(): AuthType | null {
    return this.memoryState?.authType ?? null
  }

  get userHash(): string | null {
    return this.memoryState?.userHash ?? null
  }

  get email(): string | null {
    return this.memoryState?.email ?? null
  }

  get password(): string | null {
    return this.memoryState?.password ?? null
  }

  get phone(): string | null {
    return this.memoryState?.phone ?? null
  }

  get promo(): string | null {
    return this.memoryState?.promo ?? null
  }

  get socialId(): string | null {
    return this.memoryState?.socialId ?? null
  }

  get token(): string | null {
    return this.memoryState?.token ?? null
  }

  withPhoto: boolean

  fcmToken: string

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
