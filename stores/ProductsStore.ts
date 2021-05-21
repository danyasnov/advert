import {makeAutoObservable} from 'mobx'
import {AdvertiseListItemModel} from 'front-api'
import {RootStore} from './RootStore'

export interface IProductsHydration {
  products: Array<AdvertiseListItemModel>
}

export interface IProductsStore {
  root: RootStore
  products: Array<AdvertiseListItemModel>
  hydrate(data: IProductsHydration): void
}

export class ProductsStore implements IProductsStore {
  root

  products = []

  constructor(root: RootStore) {
    makeAutoObservable(this)
    this.root = root
  }

  hydrate(data?: IProductsHydration): void {
    if (data) {
      this.products = data.products
    }
  }
}
