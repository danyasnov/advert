import {FC} from 'react'
import {observer} from 'mobx-react-lite'
import {useLockBodyScroll} from 'react-use'
import {useModalsStore} from '../../providers/RootStoreProvider'
import RemoveAdvModal from './RemoveAdvModal'
import DeactivateAdvModal from './DeactivateAdvModal'
import ChangeContactModal from './ChangeContactModal'
import RequestNotificationModal from './RequestNotificationModal'
import LoginModal from './LoginModal'
import PhoneModal from './PhoneModal'
import useDisableBodyScroll from '../../hooks/useDisableBodyScroll'

export const MODAL_TYPES = {
  REMOVE_ADV: 'REMOVE_ADV',
  DEACTIVATE_ADV: 'DEACTIVATE_ADV',
  CHANGE_CONTACT: 'CHANGE_CONTACT',
  REQUEST_NOTIFICATION: 'REQUEST_NOTIFICATION',
  LOGIN: 'LOGIN',
  PHONE_MODAL: 'PHONE_MODAL',
}

const MODAL_COMPONENTS: any = {
  [MODAL_TYPES.REMOVE_ADV]: RemoveAdvModal,
  [MODAL_TYPES.DEACTIVATE_ADV]: DeactivateAdvModal,
  [MODAL_TYPES.CHANGE_CONTACT]: ChangeContactModal,
  [MODAL_TYPES.REQUEST_NOTIFICATION]: RequestNotificationModal,
  [MODAL_TYPES.LOGIN]: LoginModal,
  [MODAL_TYPES.PHONE_MODAL]: PhoneModal,
}

const Modals: FC = observer(() => {
  const {modalType, modalProps, setModal} = useModalsStore()
  const ModalComponent = MODAL_COMPONENTS[modalType]
  const hideModal = () => {
    setModal(null, {})
  }
  useDisableBodyScroll(!!ModalComponent)

  if (!ModalComponent) return null

  return <ModalComponent onClose={hideModal} isOpen {...modalProps} />
})

export default Modals
