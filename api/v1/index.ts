import {RestResponse} from 'front-api/src/api/request'
import {
  CountryModel,
  GeoPositionItemModel,
  OwnerModel,
  ReviewModel,
  CoverLinkType,
  RegistrationType,
  AuthType,
  AuthUserResponse,
} from 'front-api/src/models/index'
import {SettingsLanguageModel} from 'front-api'
import {API_URL, getRest, makeRequest} from '../index'
import Storage from '../../stores/Storage'

// const API_V1_URL = 'https://api.adverto.sale'

export const fetchCountries = (
  language: string,
): Promise<Array<CountryModel>> => {
  const storage = new Storage({
    language,
  })
  const rest = getRest(storage)
  return rest.oldRest.fetchCountries()
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

export const fetchUser = async (
  id: string,
  language: string,
): Promise<RestResponse<OwnerModel>> => {
  const storage = new Storage({
    language,
  })
  const rest = getRest(storage)
  const userData = await rest.oldRest.userInfo(id)
  if (userData.result && userData.result.settings) {
    if (userData.result.settings.personal === undefined) {
      userData.result.settings.personal = null
    }
  }
  return userData
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
  return rest.oldRest.remindPassword(email)
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
  operation: 1 | 2,
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
