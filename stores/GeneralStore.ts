import {makeAutoObservable} from 'mobx'
import {OwnerModel, SettingsLanguageModel} from 'front-api/src/models/index'
import {CACategoryModel} from 'front-api/src/index'
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
  showSuccessAlert: string
  showErrorAlert: string
  languages: SettingsLanguageModel[]
}
export interface IGeneralStore {
  root: RootStore
  showFooter: boolean
  showCookiesWarn: boolean
  showSuccessAlert: string
  user: OwnerModel
  setUser: (user: OwnerModel) => void
  showErrorAlert: string
  activeUserPage: PagesType
  setActiveUserPage: (page: PagesType) => void
  document: Document
  locationCodes: string
  userHash: string
  setFooterVisibility: (visible: boolean) => void
  toggleCookiesWarnVisibility: () => void
  setShowLogin: (value: boolean) => void
  showLogin: boolean
  languages: SettingsLanguageModel[]
  languagesByIsoCode: Record<string, SettingsLanguageModel>
  hydrate(data: IGeneralsHydration): void
}
export type PagesType = 'adverts' | 'favorites' | 'reviews' | 'drafts'

export class GeneralStore implements IGeneralStore {
  root

  languages = []

  showFooter = true

  showCookiesWarn = false

  showSuccessAlert = ''

  showErrorAlert = ''

  user

  activeUserPage = 'adverts' as PagesType

  setActiveUserPage = (page: PagesType): void => {
    this.activeUserPage = page
  }

  setUser = (user: OwnerModel): void => {
    this.user = user
  }

  userHash = ''

  showLogin = false

  setShowLogin = (value: boolean): void => {
    this.showLogin = value
  }

  document

  locationCodes = ''

  setFooterVisibility = (visible: boolean): void => {
    this.showFooter = visible
  }

  toggleCookiesWarnVisibility = (): void => {
    this.showCookiesWarn = !this.showCookiesWarn
  }

  get languagesByIsoCode(): Record<string, SettingsLanguageModel> {
    return this.languages.reduce((acc, value) => {
      acc[value.code] = value
      return acc
    }, {})
  }

  constructor(root: RootStore) {
    makeAutoObservable(this)
    this.root = root
  }

  hydrate(data?: IGeneralsHydration): void {
    this.locationCodes = data?.locationCodes ?? ''
    this.document = data?.document ?? ''
    this.userHash = data?.userHash ?? ''
    this.showSuccessAlert = data?.showSuccessAlert ?? ''
    this.showErrorAlert = data?.showErrorAlert ?? ''
    this.languages = data?.languages ?? []
  }
}
