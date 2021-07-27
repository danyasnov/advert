import {makeAutoObservable} from 'mobx'
import {RootStore} from './RootStore'

export interface IGeneralsHydration {
  locationCodes: string
}
export interface IGeneralStore {
  root: RootStore
  showFooter: boolean
  locationCodes: string
  setFooterVisibility: (visible: boolean) => void
  hydrate(data: IGeneralsHydration): void
}

export class GeneralStore implements IGeneralStore {
  root

  showFooter = true

  locationCodes = ''

  setFooterVisibility = (visible: boolean): void => {
    this.showFooter = visible
  }

  constructor(root: RootStore) {
    makeAutoObservable(this)
    this.root = root
  }

  hydrate(data?: IGeneralsHydration): void {
    this.locationCodes = data?.locationCodes ?? ''
  }
}
