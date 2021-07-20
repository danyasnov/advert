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
import {
  ILanguagesHydration,
  ILanguagesStore,
  LanguagesStore,
} from './LanguagesStore'
import {GeneralStore, IGeneralStore} from './GeneralStore'

export interface IRootStoreHydration {
  categoriesStore: ICategoriesHydration
  productsStore: IProductsHydration
  countriesStore: ICountriesHydration
  languagesStore: ILanguagesHydration
}

export interface IRootStore {
  categoriesStore: ICategoriesStore
  productsStore: IProductsStore
  countriesStore: ICountriesStore
  languagesStore: ILanguagesStore
  generalStore: IGeneralStore
  hydrate(data: IRootStoreHydration): void
}

export class RootStore implements IRootStore {
  categoriesStore

  productsStore

  countriesStore

  languagesStore

  generalStore

  constructor() {
    this.categoriesStore = new CategoriesStore(this)
    this.productsStore = new ProductsStore(this)
    this.countriesStore = new CountriesStore(this)
    this.languagesStore = new LanguagesStore(this)
    this.generalStore = new GeneralStore(this)
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
    if (data.languagesStore) {
      this.languagesStore.hydrate(data.languagesStore)
    }
  }
}
