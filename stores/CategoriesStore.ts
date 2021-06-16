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
  byId: Record<string, CACategoryModel>
  ids: number[]
  bySlug: Record<string, CACategoryModel>
  readonly categoriesWithoutAll: Array<CACategoryModel>
}

export class CategoriesStore implements ICategoriesStore {
  root

  categories = []

  get byId(): Record<string, CACategoryModel> {
    return this.categories.reduce(
      (acc, val) => ({
        ...acc,
        [val.id]: val,
      }),
      {},
    )
  }

  get ids(): number[] {
    return this.categories.map((c) => c.id)
  }

  get bySlug(): Record<string, CACategoryModel> {
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
