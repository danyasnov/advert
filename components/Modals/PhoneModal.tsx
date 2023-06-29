import {FC} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import IcClear from 'icons/material/Clear.svg'
import ReactModal from 'react-modal'
import {toast} from 'react-toastify'
import {
  useGeneralStore,
  useModalsStore,
} from '../../providers/RootStoreProvider'
import UserAvatar from '../UserAvatar'
import Button from '../Buttons/Button'
import SecondaryButton from '../Buttons/SecondaryButton'
import PrimaryButton from '../Buttons/PrimaryButton'

interface ModalProps {
  isOpen: boolean
  displayAllowed: boolean
  phone: string
  imageUrl: string
  name: string
  onClose: () => void
}

const PhoneModal: FC<ModalProps> = observer(
  ({isOpen, onClose, imageUrl, name, displayAllowed, phone}) => {
    const {t} = useTranslation()
    const {user} = useGeneralStore()
    const {setModal} = useModalsStore()

    let body
    if (displayAllowed) {
      body = (
        <div className='flex items-center space-x-6'>
          <UserAvatar url={imageUrl} size={22} name={name} />
          <div className='flex flex-col space-y-2'>
            <span className='text-h-5 font-bold text-greyscale-900'>
              {name}
            </span>
            <Button
              onClick={() => {
                navigator.clipboard.writeText(`+${phone}`)
                toast.success(t('COPIED'))
              }}>
              <span className='text-h-5 font-bold text-primary-500'>
                {`+${phone}`}
              </span>
            </Button>
          </div>
        </div>
      )
    } else if (user) {
      body = (
        <div className='text-body-14 text-greyscale-900 space-y-2 font-normal flex flex-col'>
          <span>{t('PHONE_NUMBER_SHOW_LIMIT_REGISTERED')}</span>
        </div>
      )
    } else {
      body = (
        <div className='text-body-14 text-greyscale-900 space-y-2 font-normal flex flex-col'>
          <span>{t('PHONE_NUMBER_SHOW_LIMIT_UNREGISTERED')}</span>
          <span>{t('PHONE_NUMBER_SHOW_LIMIT_UNREGISTERED_TEXT')}</span>
        </div>
      )
    }

    return (
      <ReactModal
        isOpen={isOpen}
        onRequestClose={onClose}
        shouldCloseOnOverlayClick
        ariaHideApp={false}
        className='absolute rounded-3xl overflow-hidden w-full s:w-[480px] bg-white inset-x-0 mx-auto top-24 flex outline-none'
        overlayClassName='fixed inset-0 bg-shadow-overlay max-h-screen overflow-y-auto z-20'>
        <div className='flex flex-col w-full p-6'>
          <div className='pb-4 mb-4 flex justify-between'>
            <span className='text-h-5 text-greyscale-900 font-bold'>
              {t('CALL_TO_USER')}
            </span>
            <Button onClick={onClose}>
              <IcClear className='fill-current text-greyscale-400 h-6 w-6' />
            </Button>
          </div>
          {body}
          <div className='flex mt-8 w-full space-x-2'>
            <SecondaryButton onClick={onClose} className='w-full'>
              {t('CLOSE')}
            </SecondaryButton>
            {(displayAllowed || (!displayAllowed && !user)) && (
              <PrimaryButton
                onClick={() => {
                  if (displayAllowed) {
                    navigator.clipboard.writeText(`+${phone}`)
                    toast.success(t('COPIED'))
                  } else {
                    setModal('LOGIN')
                  }
                }}
                className='w-full'>
                {t(displayAllowed ? 'COPY_PHONE_NUMBER' : 'LOG_IN')}
              </PrimaryButton>
            )}
          </div>
        </div>
      </ReactModal>
    )
  },
)

export default PhoneModal
