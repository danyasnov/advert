import {RestResponse} from 'front-api/src/api/request'
import {CountryModel, GeoPositionItemModel} from 'front-api/src/models/index'
import axios, {AxiosPromise} from 'axios'
import {SettingsLanguageModel} from 'front-api'
import {API_URL, getRest} from '../index'
import Storage from '../../stores/Storage'

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
    url: `${API_URL}/v1/search_suggestions.php`,
    data: `query=${JSON.stringify(payload)}`,
  })
}

export const fetchCategorySuggestion = (
  phrase: string,
  lang: string,
): AxiosPromise => {
  const payload = {
    phrase,
    lang,
  }
  return axios({
    method: 'post',
    url: `${API_URL}/v1/search_suggestions_category.php`,
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
