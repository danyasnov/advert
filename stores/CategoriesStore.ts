import {makeAutoObservable} from 'mobx'
import {CACategoryModel, CountryModel} from 'front-api'
import {RootStore} from './RootStore'

export interface ICategoriesHydration {
  categories: Array<CACategoryModel>
}

export interface ICategoriesStore {
  root: RootStore
  categories: Array<CACategoryModel>
  hydrate(data: ICategoriesHydration): void
  byId: Record<string, CountryModel>
  bySlug: Record<string, CountryModel>
  readonly categoriesWithoutAll: Array<CACategoryModel>
}

export class CategoriesStore implements ICategoriesStore {
  root

  categories = []

  get byId(): Record<string, CountryModel> {
    return this.categories.reduce(
      (acc, val) => ({
        ...acc,
        [val.id]: val,
      }),
      {},
    )
  }

  get bySlug(): Record<string, CountryModel> {
    return this.categories.reduce(
      (acc, val) => ({
        ...acc,
        [val.slug]: val,
      }),
      {},
    )
  }

  get categoriesWithoutAll(): Array<CACategoryModel> {
    return this.categories.filter((c) => c.slug !== 'all')
  }

  constructor(root: RootStore) {
    makeAutoObservable(this)
    this.root = root
  }

  hydrate(data?: ICategoriesHydration): void {
    this.categories = data?.categories ?? []
  }
}
