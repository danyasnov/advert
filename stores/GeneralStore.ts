import {makeAutoObservable} from 'mobx'
import {RootStore} from './RootStore'

export interface IGeneralStore {
  root: RootStore
  showFooter: boolean
  setFooterVisibility: (visible: boolean) => void
}

export class GeneralStore implements IGeneralStore {
  root

  showFooter = true

  setFooterVisibility = (visible: boolean): void => {
    this.showFooter = visible
  }

  constructor(root: RootStore) {
    makeAutoObservable(this)
    this.root = root
  }
}
