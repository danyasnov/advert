import {
  ICategoriesHydration,
  CategoriesStore,
  ICategoriesStore,
} from './CategoriesStore'
import {
  IProductsHydration,
  IProductsStore,
  ProductsStore,
} from './ProductsStore'

export interface IRootStoreHydration {
  categoriesStore: ICategoriesHydration
  productsStore: IProductsHydration
}

export interface IRootStore {
  categoriesStore: ICategoriesStore
  productsStore: IProductsStore
  hydrate(data: IRootStoreHydration): void
}

export class RootStore implements IRootStore {
  categoriesStore

  productsStore

  constructor() {
    this.categoriesStore = new CategoriesStore(this)
    this.productsStore = new ProductsStore(this)
  }

  hydrate(data: IRootStoreHydration): void {
    if (data.categoriesStore) {
      this.categoriesStore.hydrate(data.categoriesStore)
    }
    if (data.productsStore) {
      this.productsStore.hydrate(data.productsStore)
    }
  }
}
