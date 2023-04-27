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
import {IModalsStore, ModalsStore} from './ModalsStore'

export interface IRootStoreHydration {
  categoriesStore: ICategoriesHydration
  productsStore: IProductsHydration
  countriesStore: ICountriesHydration
  languagesStore: ILanguagesHydration
  generalStore: IGeneralsHydration
  userStore: IUserHydration
  modalsStore: IModalsStore
}

export interface IRootStore {
  categoriesStore: ICategoriesStore
  productsStore: IProductsStore
  countriesStore: ICountriesStore
  userStore: IUserStore
  languagesStore: ILanguagesStore
  generalStore: IGeneralStore
  modalsStore: IModalsStore
  hydrate(data: IRootStoreHydration): void
}

export class RootStore implements IRootStore {
  categoriesStore

  productsStore

  countriesStore

  languagesStore

  generalStore

  userStore

  modalsStore

  constructor() {
    this.categoriesStore = new CategoriesStore(this)
    this.productsStore = new ProductsStore(this)
    this.countriesStore = new CountriesStore(this)
    this.languagesStore = new LanguagesStore(this)
    this.generalStore = new GeneralStore(this)
    this.userStore = new UserStore(this)
    this.modalsStore = new ModalsStore(this)
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
    if (data.modalsStore) {
      this.modalsStore.hydrate(data.modalsStore)
    }
  }
}
