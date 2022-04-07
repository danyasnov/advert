import {RestResponse} from 'front-api/src/api/request'
import {
  CountryModel,
  GeoPositionItemModel,
  ReviewModel,
  CoverLinkType,
  RegistrationType,
  AuthType,
  AuthUserResponse,
  CurrencyModel,
} from 'front-api/src/models'
import {SettingsLanguageModel, LocationModel} from 'front-api'
import NodeCache from 'node-cache'
import {size} from 'lodash'
import {API_URL, getRest, makeRequest} from '../index'
import Storage from '../../stores/Storage'

const cache = new NodeCache({stdTTL: 60 * 60 * 24})

// const API_V1_URL = 'https://api.adverto.sale'

export const fetchCountries = async (
  language: string,
): Promise<Array<CountryModel>> => {
  const key = `countries-${language}`

  const cached: Array<CountryModel> = await cache.get(key)

  if (size(cached)) {
    return cached
  }
  const storage = new Storage({
    language,
  })
  const rest = getRest(storage)
  const result = await rest.oldRest.fetchCountries()
  if (size(result)) cache.set(key, result)
  return result
}

export const fetchRegions = (
  country: string,
  language: string,
): Promise<RestResponse<Array<GeoPositionItemModel>>> => {
  const storage = new Storage({
    language,
  })
  const rest = getRest(storage)
  return rest.geo.fetchRegionByCountry(country)
}

export const fetchCities = (
  region: string,
  language: string,
): Promise<RestResponse<Array<GeoPositionItemModel>>> => {
  const storage = new Storage({
    language,
  })
  const rest = getRest(storage)
  return rest.geo.fetchCityByRegion(region)
}

export const restCoverLink = (
  link: string,
  hashLink: string,
  type: CoverLinkType,
  language: string,
): Promise<string> => {
  const storage = new Storage({
    language,
  })
  const rest = getRest(storage)
  return rest.systemApi.restCoverLink(link, hashLink, type)
}

export const fetchSearchSuggestion = async (
  phrase: string,
  lang: string,
  // @ts-ignore
): Promise<any> => {
  const payload = {
    phrase,
    lang,
  }
  return makeRequest({
    method: 'post',
    url: `${API_URL}/v1/search_suggestions.php`,
    data: `query=${JSON.stringify(payload)}`,
  })
}

export const fetchCategorySuggestion = (
  phrase: string,
  language: string,
): Promise<RestResponse<any>> => {
  const storage = new Storage({
    language,
  })
  const rest = getRest(storage)
  return rest.categories.suggestSearchCategories(phrase)
}

export const fetchLanguages = (
  language: string,
): Promise<RestResponse<Array<SettingsLanguageModel>>> => {
  const storage = new Storage({
    language,
  })
  const rest = getRest(storage)
  return rest.oldRest.fetchLanguages(language)
}

export const fetchUserRatings = async (
  id: string,
  language: string,
): Promise<RestResponse<ReviewModel[]>> => {
  const storage = new Storage({
    language,
  })
  const rest = getRest(storage)
  return rest.oldRest.fetchUserRatings(id, null)
}

export const checkPhoneNumber = async (
  type: number,
  incoming: string,
): Promise<RestResponse<string>> => {
  const storage = new Storage({})
  const rest = getRest(storage)
  // @ts-ignore
  return rest.oldRest.checkPhoneNumber(type, incoming)
}

export const sendCode = async (
  type: number,
  incoming: string,
): Promise<RestResponse<string>> => {
  const storage = new Storage({})
  const rest = getRest(storage)
  // @ts-ignore
  return rest.oldRest.resendCode(type, incoming)
}
export const authWithCode = async (
  phone: string,
  code: string,
): Promise<RestResponse<string>> => {
  const storage = new Storage({})
  const rest = getRest(storage)
  // @ts-ignore
  return rest.oldRest.authWithCode(phone, code)
}
export const activateWithCode = async (
  code: string,
  checkId: string,
): Promise<RestResponse<AuthUserResponse>> => {
  const storage = new Storage({})
  const rest = getRest(storage)
  return rest.oldRest.activateWithCode(code, Number(checkId))
}

export const authWithPassword = async (
  incoming: string,
  password: string,
): Promise<RestResponse<AuthUserResponse>> => {
  const storage = new Storage({})
  const rest = getRest(storage)
  return rest.oldRest.authWithPassword(incoming, password)
}

export const remindPassword = async (
  email: string,
): Promise<RestResponse<unknown>> => {
  const storage = new Storage({})
  const rest = getRest(storage)
  return rest.auth.remindPassword(email)
}

export const createUser = async (payload: {
  incoming: string
  name: string
  surname: string
  accountType: RegistrationType
  authType: AuthType
  pass: string
  url?: string
  referLink?: string
  image?: string
  language: string
  latitude: number
  longitude: number
}): Promise<RestResponse<number>> => {
  const {
    incoming,
    name,
    surname,
    accountType,
    authType,
    pass,
    url,
    referLink,
    image,
    language,
    latitude,
    longitude,
  } = payload
  const storage = new Storage({
    language,
    location: {latitude, longitude},
  })
  const rest = getRest(storage)
  return rest.oldRest.createUser(
    incoming,
    name,
    surname,
    accountType,
    authType,
    pass,
    url,
    referLink,
    image,
  )
}

export const toggleFavorite = async (
  hash: string,
  operation: 'add' | 'delete',
  token: string,
  userHash: string,
): Promise<RestResponse<number>> => {
  const storage = new Storage({
    token,
    userHash,
  })
  const rest = getRest(storage)
  return rest.advertises.toggleFavorite(hash, operation)
}

export const fetchCurrenciesByGPS = async (
  location: LocationModel,
  language: string,
): Promise<{result: CurrencyModel[]; error: string}> => {
  const storage = new Storage({language})
  const rest = getRest(storage)
  return rest.geo.fetchCurrencyByLocation(location)
}
