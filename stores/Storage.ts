import {AppStorage, AuthType, LocationModel, emptyLocation} from 'front-api'
import {BASIC_RADIUS} from 'front-api/src/models'
import {GetServerSidePropsContext} from 'next'
import {IncomingMessage} from 'http'
import {NextApiRequestCookies} from 'next/dist/server/api-utils'
import {ParsedUrlQuery} from 'querystring'

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
  authNewRefreshToken?: string
  authNewToken?: string
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
  authNewRefreshToken?: string
  authNewToken?: string
}

export default class Storage implements AppStorage {
  private saveTokenToCookies: any

  constructor(data: StorageOptions, saveTokenToCookies?) {
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
      authNewToken,
      authNewRefreshToken,
    } = data
    this.saveTokenToCookies = saveTokenToCookies

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
      authNewToken,
      authNewRefreshToken,
    }
  }

  get authNewRefreshToken(): string {
    return this.memoryState.authNewRefreshToken
  }

  get authNewToken(): string {
    return this.memoryState.authNewToken
  }

  memoryState: CurrentProfile | undefined

  saveNewTokens: (params: {
    id?: string
    accessToken: string
    refreshToken: string
  }) => void = ({accessToken, refreshToken}) => {
    console.log('saveNewTokens', accessToken, refreshToken)
    this.memoryState.authNewRefreshToken = refreshToken
    this.memoryState.authNewToken = accessToken
    if (this.saveTokenToCookies) {
      this.saveTokenToCookies({refreshToken, accessToken})
    }
  }

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

  platform: 'ios' | 'android' | 'web' = 'web'

  saveAddressText(address: string): void {}

  saveAppVersion(version: number): void {}

  setLocation(location: LocationModel | null): void {}

  setUserLocation(location: LocationModel | null): void {}
}
