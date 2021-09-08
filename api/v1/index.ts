import {RestResponse} from 'front-api/src/api/request'
import {
  CountryModel,
  GeoPositionItemModel,
  OwnerModel,
  ReviewModel,
  CoverLinkType,
} from 'front-api/src/models/index'
import axios, {AxiosPromise} from 'axios'
import {SettingsLanguageModel} from 'front-api'
import {getRest} from '../index'
import Storage from '../../stores/Storage'

const API_V1_URL = 'https://api.adverto.sale'

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

export const fetchSearchSuggestion = (
  phrase: string,
  lang: string,
): AxiosPromise => {
  const payload = {
    phrase,
    lang,
  }
  return axios({
    method: 'post',
    url: `${API_V1_URL}/v1/search_suggestions.php`,
    data: `query=${JSON.stringify(payload)}`,
  })
}

export const fetchCategorySuggestion = (
  phrase: string,
  language: string,
): AxiosPromise => {
  const payload = {
    phrase,
    lang: language,
  }
  // const storage = new Storage({
  //   language,
  // })
  // const rest = getRest(storage)
  // return rest.categories.suggestSearchCategories(phrase)
  return axios({
    method: 'post',
    url: `${API_V1_URL}/v1/search_suggestions_category.php`,
    data: `query=${JSON.stringify(payload)}`,
  })
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
