import {FC} from 'react'
import ReactModal from 'react-modal'
import {useLockBodyScroll} from 'react-use'
import IcClear from 'icons/material/Clear.svg'
import {useTranslation} from 'next-i18next'
import Button from '../Buttons/Button'
import ImageWrapper from '../ImageWrapper'
import PrimaryButton from '../Buttons/PrimaryButton'
import SecondaryButton from '../Buttons/SecondaryButton'

interface Props {
  isOpen: boolean
  onClose: () => void
  onAccept: () => void
  onReject: () => void
}

const RequestNotificationModal: FC<Props> = ({
  isOpen,
  onClose,
  onAccept,
  onReject,
}) => {
  const {t} = useTranslation()
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      shouldCloseOnOverlayClick
      ariaHideApp={false}
      className='absolute rounded-6 overflow-hidden w-320px s:w-[480px] bg-white-a inset-x-0 mx-auto top-24 flex outline-none'
      overlayClassName='fixed inset-0 bg-shadow-overlay max-h-screen overflow-y-auto z-30'>
      <div className='flex flex-col w-full p-6 items-center'>
        <div className='flex justify-between items-start w-full'>
          <div />
          <ImageWrapper
            type='/img/notifications.png'
            alt='notifications'
            width={120}
            height={120}
            quality={100}
          />
          <Button onClick={onClose}>
            <IcClear className='fill-current text-black-d h-6 w-6' />
          </Button>
        </div>
        <span className='text-h-4 font-bold text-primary-500 mb-3'>
          {t('ENABLE_NOTIFICATIONS')}
        </span>
        <span className='text-body-16 text-greyscale-900 mb-10'>
          {t('ENABLE_NOTIFICATIONS_DESCRIPTION')}
        </span>
        <div className='space-x-2 flex w-full'>
          <SecondaryButton
            className='w-full'
            onClick={() => {
              onReject()
              onClose()
            }}>
            {t('NOT_NOW')}
          </SecondaryButton>
          <PrimaryButton
            className='w-full'
            onClick={() => {
              onAccept()
              onClose()
            }}>
            {t('ENABLE')}
          </PrimaryButton>
        </div>
      </div>
    </ReactModal>
  )
}

export default RequestNotificationModal
