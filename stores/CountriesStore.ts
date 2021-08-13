import {makeAutoObservable} from 'mobx'
import {CountryModel} from 'front-api'
import {GeoPositionItemModel} from 'front-api/src/models/index'
import {RootStore} from './RootStore'
import {City} from '../types'

export interface ICountriesHydration {
  countries: Array<CountryModel>
  cities: Array<City>
  regions: Array<CountryModel>
  locationsByAlphabet: Record<string, GeoPositionItemModel>
}

export interface ICountriesStore {
  root: RootStore
  countries: Array<CountryModel>
  cities: Array<City>
  countriesWithAdverts: Array<CountryModel>
  regions: Array<CountryModel>
  byId: Record<string, CountryModel>
  citiesBySlug: Record<string, City>
  locationsByAlphabet: Record<string, GeoPositionItemModel>
  hydrate(data: ICountriesHydration): void
}

export class CountriesStore implements ICountriesStore {
  root

  countries = []

  cities = []

  regions = []

  locationsByAlphabet = {}

  get byId(): Record<string, CountryModel> {
    return this.countries.reduce(
      (acc, val) => ({
        ...acc,
        [val.id]: val,
      }),
      {},
    )
  }

  get citiesBySlug(): Record<string, City> {
    return this.cities.reduce((acc, val) => ({...acc, [val.slug]: val}), {})
  }

  get countriesWithAdverts(): Array<CountryModel> {
    return this.countries.filter((c) => c.has_adverts)
  }

  constructor(root: RootStore) {
    makeAutoObservable(this)
    this.root = root
  }

  hydrate(data?: ICountriesHydration): void {
    this.countries = data?.countries ?? []
    this.regions = data?.regions ?? []
    this.cities = data?.cities ?? []
    this.locationsByAlphabet = data?.locationsByAlphabet ?? {}
  }
}
