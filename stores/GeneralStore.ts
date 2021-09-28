import {makeAutoObservable} from 'mobx'
import {OwnerModel} from 'front-api/src/models/index'
import {RootStore} from './RootStore'

interface Document {
  title: string
  description: string
  content: string
}
export interface IGeneralsHydration {
  locationCodes: string
  userHash: string
  document: Document
  showActivationAlert: boolean
  showErrorActivationAlert: boolean
}
export interface IGeneralStore {
  root: RootStore
  showFooter: boolean
  showCookiesWarn: boolean
  showContent: boolean
  showActivationAlert: boolean
  user: OwnerModel
  setUser: (user: OwnerModel) => void
  showErrorActivationAlert: boolean
  activeUserPage: PagesType
  setActiveUserPage: (page: PagesType) => void
  triggerUpdate: () => void
  trigger: boolean
  document: Document
  locationCodes: string
  userHash: string
  setFooterVisibility: (visible: boolean) => void
  setShowContent: (visible: boolean) => void
  toggleCookiesWarnVisibility: () => void
  hydrate(data: IGeneralsHydration): void
}
export type PagesType = 'adverts' | 'favorites' | 'reviews' | 'drafts'

export class GeneralStore implements IGeneralStore {
  root

  showFooter = true

  showCookiesWarn = false

  showActivationAlert = false

  showErrorActivationAlert = false

  user

  activeUserPage = 'adverts' as PagesType

  setActiveUserPage = (page: PagesType): void => {
    this.activeUserPage = page
  }

  triggerUpdate = (): void => {
    this.trigger = !this.trigger
  }

  setUser = (user: OwnerModel): void => {
    this.user = user
  }

  userHash = ''

  trigger

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
    this.userHash = data?.userHash ?? ''
    this.showActivationAlert = data?.showActivationAlert ?? false
    this.showErrorActivationAlert = data?.showErrorActivationAlert ?? false
  }
}
