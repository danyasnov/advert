import {
  ICategoriesHydration,
  CategoriesStore,
  ICategoriesStore,
} from './CategoriesStore'

export interface IRootStoreHydration {
  categoriesStore: ICategoriesHydration
}

export interface IRootStore {
  categoriesStore: ICategoriesStore
  hydrate(data: IRootStoreHydration): void
}

export class RootStore implements IRootStore {
  categoriesStore

  constructor() {
    this.categoriesStore = new CategoriesStore(this)
  }

  hydrate(data: IRootStoreHydration): void {
    if (data.categoriesStore) {
      this.categoriesStore.hydrate(data.categoriesStore)
    }
  }
}
