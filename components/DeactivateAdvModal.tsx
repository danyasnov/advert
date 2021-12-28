import {FC} from 'react'
import ReactModal from 'react-modal'
import {useLockBodyScroll} from 'react-use'
import IcClear from 'icons/material/Clear.svg'
import {
  AdvertiseFullModel,
  RemoveFromSaleType,
} from 'front-api/src/models/index'
import {useTranslation} from 'next-i18next'
import Button from './Buttons/Button'
import ImageWrapper from './ImageWrapper'
import PrimaryButton from './Buttons/PrimaryButton'
import SecondaryButton from './Buttons/SecondaryButton'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSelect: (value: RemoveFromSaleType) => void
  advert: AdvertiseFullModel
}

const DeactivateAdvModal: FC<Props> = ({isOpen, onClose, onSelect, advert}) => {
  const {t} = useTranslation()
  useLockBodyScroll()
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
          <span className='text-h-2 text-black-b font-bold'>
            {t('REMOVE_FROM_SALE')}
          </span>
          <Button onClick={onClose}>
            <IcClear className='fill-current text-black-d h-6 w-6' />
          </Button>
        </div>
        <div className='px-3 py-4'>
          <div className='flex space-x-4'>
            <ImageWrapper
              type={advert.images[0]}
              alt='Product'
              objectFit='contain'
              width={163}
              height={105}
            />
            <span className='text-black-b text-body-3 font-bold'>
              {advert.title}
            </span>
          </div>
          <div className='space-y-2 my-2'>
            <PrimaryButton
              className='w-full'
              onClick={() => onSelect('soldAdverto')}>
              {t('SOLD_IN_ADVERTO')}
            </PrimaryButton>
            <SecondaryButton
              className='w-full'
              onClick={() => onSelect('soldOther')}>
              {t('SOLD_IN_ANOTHER_SERVICE')}
            </SecondaryButton>
            <SecondaryButton
              className='w-full'
              onClick={() => onSelect('changedMind')}>
              {t('CHANGE_MIND_TO_SELL')}
            </SecondaryButton>
          </div>
        </div>
      </div>
    </ReactModal>
  )
}

export default DeactivateAdvModal
