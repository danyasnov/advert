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
import {GeneralStore, IGeneralsHydration, IGeneralStore} from './GeneralStore'
import {IUserHydration, IUserStore, UserStore} from './UserStore'

export interface IRootStoreHydration {
  categoriesStore: ICategoriesHydration
  productsStore: IProductsHydration
  countriesStore: ICountriesHydration
  languagesStore: ILanguagesHydration
  generalStore: IGeneralsHydration
  userStore: IUserHydration
}

export interface IRootStore {
  categoriesStore: ICategoriesStore
  productsStore: IProductsStore
  countriesStore: ICountriesStore
  userStore: IUserStore
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

  userStore

  constructor() {
    this.categoriesStore = new CategoriesStore(this)
    this.productsStore = new ProductsStore(this)
    this.countriesStore = new CountriesStore(this)
    this.languagesStore = new LanguagesStore(this)
    this.generalStore = new GeneralStore(this)
    this.userStore = new UserStore(this)
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
    if (data.generalStore) {
      this.generalStore.hydrate(data.generalStore)
    }
    if (data.userStore) {
      this.userStore.hydrate(data.userStore)
    }
  }
}
