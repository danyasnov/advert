import {makeAutoObservable} from 'mobx'
import {CountryModel} from 'front-api'
import {RootStore} from './RootStore'

export interface ICountriesHydration {
  countries: Array<CountryModel>
}

export interface ICountriesStore {
  root: RootStore
  countries: Array<CountryModel>
  hydrate(data: ICountriesHydration): void
}

export class CountriesStore implements ICountriesStore {
  root

  countries = []

  constructor(root: RootStore) {
    makeAutoObservable(this)
    this.root = root
  }

  hydrate(data?: ICountriesHydration): void {
    this.countries = data?.countries ?? []
  }
}
