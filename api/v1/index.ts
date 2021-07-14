import {RestResponse} from 'front-api/src/api/request'
import {CountryModel, GeoPositionItemModel} from 'front-api/src/models/index'
import axios from 'axios'
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

export const fetchSearchSuggestion = () => {
  return axios({
    method: 'post',
    url: `${API_URL}/v1/search_suggestions.php`,
    data: {
      lang: 'ru',
      phrase: 'iphone',
    },
  })
}
