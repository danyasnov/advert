import {FC, useState} from 'react'
import ReactModal from 'react-modal'
import {useLockBodyScroll} from 'react-use'
import {isEmpty} from 'lodash'
import IcClear from 'icons/material/Clear.svg'
import {useTranslation} from 'next-i18next'
import {RemoveFromSaleType} from 'front-api/src/models'
import Button from '../Buttons/Button'
import ImageWrapper from '../ImageWrapper'
import PrimaryButton from '../Buttons/PrimaryButton'
import SecondaryButton from '../Buttons/SecondaryButton'
import RadioButtons from '../RadioButtons'
import EmptyProductImage from '../EmptyProductImage'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSelect: (value: RemoveFromSaleType) => void
  images: string[]
  title: string
  price: string
}

const DeactivateAdvModal: FC<Props> = ({
  isOpen,
  onClose,
  onSelect,
  images,
  title,
  price,
}) => {
  const {t} = useTranslation()
  const [selectedValue, setSelectedValue] = useState()

  const handleRadioChange = (value) => {
    setSelectedValue(value)
    // onSelect(value)
  }

  const handleRemove = () => {
    if (selectedValue) {
      onSelect(selectedValue)
      onClose()
    }
  }

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      shouldCloseOnOverlayClick
      ariaHideApp={false}
      className='absolute rounded-6 px-6 overflow-hidden w-[320px] s:w-[480px] bg-white-a inset-x-0 mx-auto top-24 flex outline-none'
      overlayClassName='fixed inset-0 bg-shadow-overlay max-h-screen overflow-y-auto z-20'>
      <div className='flex flex-col w-full'>
        <div className='mt-6 pb-4 flex flex-col'>
          <Button onClick={onClose} className='self-end'>
            <IcClear className='fill-current text-black-d h-6 w-6' />
          </Button>
          <h4 className='text-h-4 text-primary-500 font-bold self-center'>
            {t('REMOVE_FROM_SALE')}
          </h4>
        </div>
        <div className='py-4 px-4'>
          <div className='flex space-x-4 mb-4'>
            {isEmpty(images) ? (
              <div className='w-[40px]'>
                <EmptyProductImage size={40} />
              </div>
            ) : (
              <div className='w-[80px] h-[80px] rounded-[10px] overflow-hidden'>
                <ImageWrapper
                  type={images[0]}
                  alt='Product'
                  objectFit='cover'
                  width={80}
                  height={80}
                />
              </div>
            )}

            <div className='flex flex-col justify-center'>
              <span className='text-greyscale-900 text-body-16 font-semibold'>
                {price}
              </span>
              <span className='text-greyscale-600 text-body-14 font-medium'>
                {title}
              </span>
            </div>
          </div>
          <div className='space-y-4 my-2'>
            <span className='text-body-16 text-greyscale-900 font-semibold'>
              {t('CHOOSE_REASON')}
            </span>
            <RadioButtons
              options={[
                {title: t('SOLD_IN_VOOXEE'), value: 'soldAdverto'},
                {title: t('SOLD_IN_ANOTHER_SERVICE'), value: 'soldOther'},
                {title: t('CHANGE_MIND_TO_SELL'), value: 'changedMind'},
              ]}
              value={selectedValue}
              name='soldOptions'
              onChange={handleRadioChange}
            />
            <div className='flex justify-between space-x-2'>
              <SecondaryButton
                className='w-full'
                onClick={() => {
                  onClose()
                }}>
                {t('CANCEL')}
              </SecondaryButton>
              <PrimaryButton
                className='w-full'
                onClick={handleRemove}
                disabled={!selectedValue}>
                {t('REMOVE')}
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </ReactModal>
  )
}

export default DeactivateAdvModal
