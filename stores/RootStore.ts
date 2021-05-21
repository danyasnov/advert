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
import {
  CountriesStore,
  ICountriesHydration,
  ICountriesStore,
} from './CountriesStore'

export interface IRootStoreHydration {
  categoriesStore: ICategoriesHydration
  productsStore: IProductsHydration
  countriesStore: ICountriesHydration
}

export interface IRootStore {
  categoriesStore: ICategoriesStore
  productsStore: IProductsStore
  countriesStore: ICountriesStore
  hydrate(data: IRootStoreHydration): void
}

export class RootStore implements IRootStore {
  categoriesStore

  productsStore

  countriesStore

  constructor() {
    this.categoriesStore = new CategoriesStore(this)
    this.productsStore = new ProductsStore(this)
    this.countriesStore = new CountriesStore(this)
  }

  hydrate(data: IRootStoreHydration): void {
    if (data.categoriesStore) {
      this.categoriesStore.hydrate(data.categoriesStore)
    }
    if (data.productsStore) {
      this.productsStore.hydrate(data.productsStore)
    }
    if (data.countriesStore) {
      this.countriesStore.hydrate(data.countriesStore)
    }
  }
}
