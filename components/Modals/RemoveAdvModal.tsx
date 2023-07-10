import {FC} from 'react'
import ReactModal from 'react-modal'
import IcClear from 'icons/material/Clear.svg'
import {useTranslation} from 'next-i18next'
import Button from '../Buttons/Button'
import PrimaryButton from '../Buttons/PrimaryButton'
import SecondaryButton from '../Buttons/SecondaryButton'

interface Props {
  isOpen: boolean
  onClose: () => void
  onRemove: () => void
}

const RemoveAdvModal: FC<Props> = ({isOpen, onClose, onRemove}) => {
  const {t} = useTranslation()
  document.body.style.overflow = 'auto'

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      shouldCloseOnOverlayClick
      ariaHideApp={false}
      className='absolute rounded-6 overflow-hidden w-320px s:w-480px bg-white-a inset-x-0 mx-auto top-24 flex outline-none'
      overlayClassName='fixed inset-0 bg-shadow-overlay max-h-screen overflow-y-auto z-20'>
      <div className='flex flex-col w-full p-6'>
        <div className='pb-3 flex justify-end'>
          <Button onClick={onClose}>
            <IcClear className='fill-current text-greyscale-400 h-6 w-6' />
          </Button>
        </div>
        <div className='flex flex-col items-center'>
          <span className='text-primary-500 text-h-4 font-bold mb-3'>
            {t('DELETE_AD')}
          </span>
          <span className='text-greyscale-900 text-body-16 mb-9'>
            {t('ARE_YOU_SURE_YOU_WANT_TO_DELETE_ADVERT')}
          </span>
          <div className='flex space-x-2 w-full'>
            <SecondaryButton className='w-full' onClick={onClose}>
              {t('CANCEL')}
            </SecondaryButton>
            <PrimaryButton
              className='w-full'
              onClick={() => {
                onRemove()
                onClose()
              }}>
              {t('DELETE')}
            </PrimaryButton>
          </div>
        </div>
      </div>
    </ReactModal>
  )
}

export default RemoveAdvModal
