import {makeAutoObservable} from 'mobx'
import {CACategoryModel} from 'front-api'
import {RootStore} from './RootStore'

export interface ICategoriesHydration {
  categories: Array<CACategoryModel>
}

export interface ICategoriesStore {
  root: RootStore
  categories: Array<CACategoryModel>
  hydrate(data: ICategoriesHydration): void
  readonly categoriesWithoutAll: Array<CACategoryModel>
}

export class CategoriesStore implements ICategoriesStore {
  root

  categories = []

  get categoriesWithoutAll(): Array<CACategoryModel> {
    return this.categories.filter((c) => c.slug !== 'all')
  }

  constructor(root: RootStore) {
    makeAutoObservable(this)
    this.root = root
  }

  hydrate(data?: ICategoriesHydration): void {
    if (data) {
      this.categories = data.categories
    }
  }
}
