import {FC} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import IcClear from 'icons/material/Clear.svg'
import ReactModal from 'react-modal'
import {toast} from 'react-toastify'
import {useRouter} from 'next/router'
import IcCopy from 'icons/Copy.svg'
import {useGeneralStore} from '../../providers/RootStoreProvider'
import UserAvatar from '../UserAvatar'
import Button from '../Buttons/Button'
import SecondaryButton from '../Buttons/SecondaryButton'
import PrimaryButton from '../Buttons/PrimaryButton'

interface ModalProps {
  isOpen: boolean
  displayAllowed: boolean
  hideNumber: boolean
  phone: string
  imageUrl: string
  name: string
  userHash: string
  onClose: () => void
}

const PhoneModal: FC<ModalProps> = observer(
  ({
    isOpen,
    onClose,
    imageUrl,
    name,
    displayAllowed,
    phone,
    userHash,
    hideNumber,
  }) => {
    const {t} = useTranslation()
    const {user} = useGeneralStore()
    const router = useRouter()

    let body
    if (displayAllowed) {
      body = (
        <div className='flex items-center space-x-6'>
          <UserAvatar url={imageUrl} size={22} name={name} />
          <div className='flex flex-col space-y-2'>
            <span className='text-h-5 font-bold text-greyscale-900'>
              {name}
            </span>
            {hideNumber ? (
              <span className='text-h-5 font-bold text-greyscale-500'>
                {t('NUMBER_HIDDEN')}
              </span>
            ) : (
              <Button
                className='space-x-2'
                onClick={() => {
                  navigator.clipboard.writeText(`+${phone}`)
                  toast.success(t('COPIED_TO_CLIPBOARD'))
                }}>
                <span className='text-h-5 font-bold text-primary-500'>
                  {`+${phone}`}
                </span>
                <IcCopy className='w-6 h-6' />
              </Button>
            )}
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
            <PrimaryButton
              onClick={() => {
                router.push(`/user/${userHash}`)
                onClose()
              }}
              className='w-full'>
              {t('GO_TO_PROFILE')}
            </PrimaryButton>
          </div>
        </div>
      </ReactModal>
    )
  },
)

export default PhoneModal
