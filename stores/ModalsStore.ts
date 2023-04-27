import {makeAutoObservable} from 'mobx'
import {RootStore} from './RootStore'
import {MODAL_TYPES} from '../components/Modals/Modals'

export interface IModalsHydration {}

type ModalType = keyof typeof MODAL_TYPES | null
type ModalProps = Record<string, unknown>
export interface IModalsStore {
  root: RootStore
  modalType: ModalType
  modalProps: ModalProps
  setModal: (type: ModalType, props?: ModalProps) => void
  hydrate(data: IModalsHydration): void
}

export class ModalsStore implements IModalsStore {
  root

  modalType = null

  modalProps = {}

  setModal = (type: ModalType, props?: ModalProps) => {
    this.modalType = type || null
    this.modalProps = props || {}
  }

  constructor(root: RootStore) {
    makeAutoObservable(this)
    this.root = root
  }

  hydrate(data?: IModalsHydration): void {}
}
