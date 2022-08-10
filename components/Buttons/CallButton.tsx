import {FC, useRef, useState} from 'react'
import IcPhone from 'icons/material/Phone.svg'
import {useTranslation} from 'next-i18next'
import {useLockBodyScroll} from 'react-use'
import IcClear from 'icons/material/Clear.svg'
import ReactModal from 'react-modal'
import {AdvertiseDetail} from 'front-api'
import IcCopy from 'icons/material/Copy.svg'
import {parseCookies} from 'nookies'
import {observer} from 'mobx-react-lite'
import {toast} from 'react-toastify'
import PrimaryButton from './PrimaryButton'
import Button from './Button'
import {makeRequest} from '../../api'
import {SerializedCookiesState} from '../../types'
import {useGeneralStore} from '../../providers/RootStoreProvider'
import OutlineButton from './OutlineButton'
import {trackSingle} from '../../helpers'

interface Props {
  product: AdvertiseDetail
}
const CallButton: FC<Props> = ({product}) => {
  const {owner, advert} = product
  const {phoneNum} = owner

  const [showPhone, setShowPhone] = useState(false)
  const [displayAllow, setDisplayAllow] = useState(true)
  const {t} = useTranslation()
  if (!phoneNum) return null
  return (
    <div className='w-full'>
      {phoneNum && (
        <PrimaryButton
          id='call'
          onClick={() => {
            trackSingle({
              categoryId: advert.rootCategoryId,
              event: 'Contact',
            })

            const state: SerializedCookiesState = parseCookies()
            makeRequest({
              method: 'post',
              url: '/api/check-phone-permissions',
              data: {
                hash: advert.hash,
              },
            }).then((res) => {
              if (res.data.displayAllowed || !state.hash) {
                setShowPhone(true)
                setDisplayAllow(res.data.displayAllowed)
              } else if (state.hash) {
                toast.error(t('PHONE_NUMBER_SHOW_LIMIT_REGISTERED'))
              }
            })
          }}
          className='w-full text-body-14 text-greyscale-900 order-0 '>
          <IcPhone className='fill-current h-4 w-4 mr-2' />
          {t('MAKE_A_CALL')}
        </PrimaryButton>
      )}

      {showPhone && (
        <PhoneModal
          product={product}
          displayAllow={displayAllow}
          isOpen={showPhone}
          onClose={() => setShowPhone(false)}
        />
      )}
    </div>
  )
}

interface ModalProps {
  isOpen: boolean
  displayAllow: boolean
  onClose: () => void
  product: AdvertiseDetail
}

const PhoneModal: FC<ModalProps> = observer(
  ({isOpen, onClose, product, displayAllow}) => {
    const {t} = useTranslation()
    useLockBodyScroll()
    const {setShowLogin} = useGeneralStore()

    const linkRef = useRef(null)

    const {owner} = product
    const {phoneNum} = owner

    const phone = `+${phoneNum}`
    return (
      <ReactModal
        isOpen={isOpen}
        onRequestClose={onClose}
        shouldCloseOnOverlayClick
        ariaHideApp={false}
        className='absolute rounded-6 overflow-hidden w-320px bg-white-a inset-x-0 mx-auto top-24 flex outline-none'
        overlayClassName='fixed inset-0 bg-shadow-overlay max-h-screen overflow-y-auto z-20'>
        <div className='flex flex-col w-full'>
          <div className='px-3 mt-6 pb-4 flex justify-between border-b border-shadow-b'>
            <span className='text-body-14 text-greyscale-900 font-bold'>
              {displayAllow ? owner.name : t('LOG_IN')}
            </span>
            <Button onClick={onClose}>
              <IcClear className='fill-current text-black-d h-6 w-6' />
            </Button>
          </div>
          <div className='py-6 px-3 flex items-center flex-col'>
            {displayAllow ? (
              <>
                <div className='py-2 flex justify-between w-full'>
                  <input
                    type='text'
                    readOnly
                    ref={linkRef}
                    value={phone}
                    className='text-body-14 text-black-c w-full font-bold'
                  />
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(phone)
                      linkRef.current.select()
                    }}>
                    <IcCopy className='fill-current text-black-c h-6 w-6 ml-1' />
                  </Button>
                </div>
                <div className='text-body-14 text-greyscale-900 mt-4'>
                  {t('TELL_YOU_FOUND_AD_ON_VOOXEE')}
                </div>
              </>
            ) : (
              <>
                <div className='text-body-14 text-greyscale-900'>
                  {t('PHONE_NUMBER_SHOW_LIMIT_UNREGISTERED')}
                </div>
                <div className='text-body-14 text-greyscale-900 mt-2 mb-4'>
                  {t('PHONE_NUMBER_SHOW_LIMIT_UNREGISTERED_TEXT')}
                </div>
                <OutlineButton
                  className='flex'
                  onClick={() => {
                    setShowLogin(true)
                  }}>
                  {t('LOG_IN')}
                </OutlineButton>
              </>
            )}
          </div>
        </div>
      </ReactModal>
    )
  },
)
export default CallButton
