import {FC} from 'react'
import {observer} from 'mobx-react-lite'
import {useModalsStore} from '../../providers/RootStoreProvider'
import RemoveAdvModal from './RemoveAdvModal'
import DeactivateAdvModal from './DeactivateAdvModal'

export const MODAL_TYPES = {
  REMOVE_ADV: 'REMOVE_ADV',
  DEACTIVATE_ADV: 'DEACTIVATE_ADV',
}

const MODAL_COMPONENTS: any = {
  [MODAL_TYPES.REMOVE_ADV]: RemoveAdvModal,
  [MODAL_TYPES.DEACTIVATE_ADV]: DeactivateAdvModal,
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
