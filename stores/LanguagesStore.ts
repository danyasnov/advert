import {makeAutoObservable} from 'mobx'
import {CountryModel, SettingsLanguageModel} from 'front-api'
import {RootStore} from './RootStore'

export interface ILanguagesHydration {
  languages: Array<SettingsLanguageModel>
}

export interface ILanguagesStore {
  root: RootStore
  languages: Array<SettingsLanguageModel>
  byId: Record<string, SettingsLanguageModel>
  hydrate(data: ILanguagesHydration): void
}

export class LanguagesStore implements ILanguagesStore {
  root

  languages = []

  get byId(): Record<string, SettingsLanguageModel> {
    return this.languages.reduce(
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

  hydrate(data?: ILanguagesHydration): void {
    this.languages = data?.languages ?? []
  }
}
