import {FC} from 'react'
import {observer} from 'mobx-react-lite'
import {useModalsStore} from '../../providers/RootStoreProvider'
import RemoveAdvModal from './RemoveAdvModal'
import DeactivateAdvModal from './DeactivateAdvModal'
import ChangeContactModal from './ChangeContactModal'
import RequestNotificationModal from './RequestNotificationModal'

export const MODAL_TYPES = {
  REMOVE_ADV: 'REMOVE_ADV',
  DEACTIVATE_ADV: 'DEACTIVATE_ADV',
  CHANGE_CONTACT: 'CHANGE_CONTACT',
  REQUEST_NOTIFICATION: 'REQUEST_NOTIFICATION',
}

const MODAL_COMPONENTS: any = {
  [MODAL_TYPES.REMOVE_ADV]: RemoveAdvModal,
  [MODAL_TYPES.DEACTIVATE_ADV]: DeactivateAdvModal,
  [MODAL_TYPES.CHANGE_CONTACT]: ChangeContactModal,
  [MODAL_TYPES.REQUEST_NOTIFICATION]: RequestNotificationModal,
}

const Modals: FC = observer(() => {
  const {modalType, modalProps, setModal} = useModalsStore()
  const ModalComponent = MODAL_COMPONENTS[modalType]
  const hideModal = () => {
    setModal(null, {})
  }

  if (!ModalComponent) return null

  return <ModalComponent onClose={hideModal} isOpen {...modalProps} />
})

export default Modals