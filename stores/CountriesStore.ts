import {makeAutoObservable} from 'mobx'
import {CountryModel} from 'front-api'
import {RootStore} from './RootStore'

export interface ICountriesHydration {
  countries: Array<CountryModel>
}

export interface ICountriesStore {
  root: RootStore
  countries: Array<CountryModel>
  countriesById: Record<string, CountryModel>
  hydrate(data: ICountriesHydration): void
}

export class CountriesStore implements ICountriesStore {
  root

  countries = []

  get countriesById(): Record<string, CountryModel> {
    return this.countries.reduce(
      (acc, val) => ({
        ...acc,
        [val.id]: val,
      }),
      {},
    )
  }

  constructor(root: RootStore) {
    makeAutoObservable(this)
    this.root = root
  }

  hydrate(data?: ICountriesHydration): void {
    this.countries = data?.countries ?? []
  }
}
