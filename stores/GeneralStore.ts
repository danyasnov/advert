import {makeAutoObservable} from 'mobx'
import {RootStore} from './RootStore'

interface Document {
  title: string
  description: string
  content: string
}
export interface IGeneralsHydration {
  locationCodes: string
  document: Document
}
export interface IGeneralStore {
  root: RootStore
  showFooter: boolean
  showCookiesWarn: boolean
  showContent: boolean
  document: Document
  locationCodes: string
  setFooterVisibility: (visible: boolean) => void
  setShowContent: (visible: boolean) => void
  toggleCookiesWarnVisibility: () => void
  hydrate(data: IGeneralsHydration): void
}

export class GeneralStore implements IGeneralStore {
  root

  showFooter = true

  showCookiesWarn = false

  showContent = true

  document

  locationCodes = ''

  setFooterVisibility = (visible: boolean): void => {
    this.showFooter = visible
  }

  setShowContent = (visible: boolean): void => {
    this.showContent = visible
  }

  toggleCookiesWarnVisibility = (): void => {
    this.showCookiesWarn = !this.showCookiesWarn
  }

  constructor(root: RootStore) {
    makeAutoObservable(this)
    this.root = root
  }

  hydrate(data?: IGeneralsHydration): void {
    this.locationCodes = data?.locationCodes ?? ''
    this.document = data?.document ?? ''
  }
}
