import {makeAutoObservable} from 'mobx'
import {CountryModel} from 'front-api'
import {GeoPositionItemModel} from 'front-api/src/models/index'
import {RootStore} from './RootStore'

export interface ICountriesHydration {
  countries: Array<CountryModel>
  regions: Array<CountryModel>
  locationsByAlphabet: Record<string, GeoPositionItemModel>
}

export interface ICountriesStore {
  root: RootStore
  countries: Array<CountryModel>
  countriesWithAdverts: Array<CountryModel>
  regions: Array<CountryModel>
  byId: Record<string, CountryModel>
  locationsByAlphabet: Record<string, GeoPositionItemModel>
  hydrate(data: ICountriesHydration): void
}

export class CountriesStore implements ICountriesStore {
  root

  countries = []

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
    this.locationsByAlphabet = data?.locationsByAlphabet ?? {}
  }
}
