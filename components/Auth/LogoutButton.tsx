import {FC, useState} from 'react'
import {observer} from 'mobx-react-lite'
import localforage from 'localforage'
import {useRouter} from 'next/router'
import {useTranslation} from 'next-i18next'
import {useLockBodyScroll} from 'react-use'
import ReactModal from 'react-modal'
import IcClear from 'icons/material/Clear.svg'
import {destroyCookiesWrapper} from '../../helpers'
import Button from '../Buttons/Button'
import PrimaryButton from '../Buttons/PrimaryButton'
import SecondaryButton from '../Buttons/SecondaryButton'

const LogoutButton: FC<{
  className?: string
  onClose?: () => void
  onOpen?: () => void
}> = observer(({children, className, onClose, onOpen}) => {
  const [show, setShow] = useState(false)
  return (
    <>
      <Button
        className={className}
        onClick={() => {
          setShow(true)
          if (onOpen) onOpen()
        }}>
        {children}
      </Button>
      {show && (
        <DeactivateAdvModal
          isOpen={show}
          onClose={() => {
            setShow(false)
            if (onClose) onClose()
          }}
        />
      )}
    </>
  )
})

const DeactivateAdvModal: FC<{isOpen: boolean; onClose: () => void}> = ({
  isOpen,
  onClose,
}) => {
  const {t} = useTranslation()
  const router = useRouter()
  useLockBodyScroll()
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      shouldCloseOnOverlayClick
      ariaHideApp={false}
      className='absolute rounded-6 overflow-hidden w-full s:w-480px bg-white inset-x-0 mx-auto top-24 flex outline-none'
      overlayClassName='fixed inset-0 bg-shadow-overlay max-h-screen overflow-y-auto z-20'>
      <div className='flex flex-col w-full p-6 items-center'>
        <Button onClick={onClose} className='self-end'>
          <IcClear className='fill-current text-black-d h-6 w-6' />
        </Button>
        <span className='text-h-4 font-bold text-primary-500 mb-3'>
          {t('EXIT')}
        </span>
        <span className='text-body-16 font-normal text-greyscale-900 mb-9'>
          {t('EXIT_REGISTRATION')}
        </span>
        <div className='flex w-full space-x-2'>
          <SecondaryButton className='w-full' onClick={onClose}>
            {t('CANCEL')}
          </SecondaryButton>
          <PrimaryButton
            className='w-full'
            onClick={() => {
              destroyCookiesWrapper('hash')
              destroyCookiesWrapper('promo')
              destroyCookiesWrapper('authType')
              destroyCookiesWrapper('aup')
              destroyCookiesWrapper('authNewRefreshToken')
              destroyCookiesWrapper('authNewToken')
              destroyCookiesWrapper('sessionId')
              localforage.clear()
              router.reload()
              onClose()
            }}>
            {t('EXIT')}
          </PrimaryButton>
        </div>
      </div>
    </ReactModal>
  )
}

export default LogoutButton
