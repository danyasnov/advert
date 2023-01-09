import {FC, ReactNode, useState} from 'react'
import {useTranslation} from 'next-i18next'
import {useLockBodyScroll} from 'react-use'
import IcClear from 'icons/material/Clear.svg'
import ReactModal from 'react-modal'
import {observer} from 'mobx-react-lite'
import {Call} from 'react-iconly'
import {OwnerModel} from 'front-api/src/models'
import Button from './Button'
import {makeRequest} from '../../api'
import {useGeneralStore} from '../../providers/RootStoreProvider'
import {trackSingle} from '../../helpers'
import UserAvatar from '../UserAvatar'
import SecondaryButton from './SecondaryButton'
import PrimaryButton from './PrimaryButton'

interface Props {
  hash: string
  ownerHash: string
  className: string
  rootCategoryId: number
  icon?: ReactNode
}
const CallButton: FC<Props> = ({
  hash,
  rootCategoryId,
  ownerHash,
  icon,
  className,
}) => {
  const [phone, setPhone] = useState()
  const [user, setUser] = useState<OwnerModel>()
  const [showModal, setShowModal] = useState(false)
  const [displayAllowed, setDisplayAllowed] = useState()
  const {t} = useTranslation()
  return (
    <div>
      <Button
        id='call'
        onClick={async (e) => {
          e.preventDefault()
          trackSingle('Contact')
          const {data: permissionData} = await makeRequest({
            method: 'post',
            url: '/api/check-phone-permissions',
            data: {
              hash,
            },
          })

          setDisplayAllowed(permissionData.result.displayAllowed)
          setPhone(permissionData.result.num)
          const {data: userData} = await makeRequest({
            method: 'post',
            url: '/api/user-info',
            data: {
              hash: ownerHash,
            },
          })
          setUser(userData.result)
          setShowModal(true)
        }}
        className={className}>
        {!!icon && icon}
        <span className='text-body-16'>{t('CONTACT_SELLER')}</span>
      </Button>

      {showModal && (
        <PhoneModal
          user={user}
          phone={phone}
          displayAllowed={displayAllowed}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}

interface ModalProps {
  isOpen: boolean
  displayAllowed: boolean
  phone: string
  user: OwnerModel
  onClose: () => void
}

const PhoneModal: FC<ModalProps> = observer(
  ({isOpen, onClose, user, displayAllowed, phone}) => {
    const {t} = useTranslation()
    useLockBodyScroll()
    const {setShowLogin, user: currentUser} = useGeneralStore()

    let body
    if (displayAllowed) {
      body = (
        <div className='flex items-center space-x-6'>
          <UserAvatar url={user.imageUrl} size={22} name={user.name} />
          <div className='flex flex-col space-y-2'>
            <span className='text-h-5 font-bold text-greyscale-900'>
              {user.name}
            </span>
            <span className='text-h-5 font-bold text-primary-500'>
              {`+${phone}`}
            </span>
          </div>
        </div>
      )
    } else if (currentUser) {
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
            {(displayAllowed || (!displayAllowed && !currentUser)) && (
              <PrimaryButton
                onClick={() => {
                  if (displayAllowed) {
                    navigator.clipboard.writeText(`+${phone}`)
                  } else {
                    setShowLogin(true)
                    onClose()
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
export default CallButton
