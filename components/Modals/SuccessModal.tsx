import React, {FC} from 'react'
import {useTranslation} from 'next-i18next'
import {useRouter} from 'next/router'
import ReactModal from 'react-modal'
import IcClear from 'icons/material/Clear.svg'
import Button from '../Buttons/Button'
import ImageWrapper from '../ImageWrapper'
import PrimaryButton from '../Buttons/PrimaryButton'

interface Props {
  imageSrc: string
  title: string
  isOpen: boolean
  onClose: () => void
}

const SuccessModal: FC<Props> = ({imageSrc, title, isOpen, onClose}) => {
  const {t} = useTranslation()
  const {push} = useRouter()
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      shouldCloseOnOverlayClick={false}
      ariaHideApp={false}
      className='absolute rounded-6 w-[328px] s:w-480px bg-white-a inset-x-0 mx-auto top-1/3 s:top-[162px] flex outline-none drop-shadow-2xl'
      overlayClassName='fixed inset-0 max-h-screen overflow-y-auto z-20 bg-modal-background'>
      <div className='flex flex-col w-full p-8'>
        <div className='pb-4 hidden s:flex justify-end'>
          <Button onClick={onClose}>
            <IcClear className='fill-current text-greyscale-400 h-6 w-6' />
          </Button>
        </div>
        <div className='relative flex flex-col items-center'>
          <div className='relative'>
            <ImageWrapper
              type={imageSrc}
              alt='thank you'
              width={200}
              height={200}
              quality={100}
            />
          </div>
          <span className='text-h-4 text-primary-500 font-bold pb-4'>
            {t('THANKS')}
          </span>
          <span className='text-body-16 text-greyscale-900 font-normal pb-8'>
            {t(title)}
          </span>
          <PrimaryButton onClick={() => push('/')}>
            {t('LANDING_TO_MAIN_PAGE')}
          </PrimaryButton>
        </div>
      </div>
    </ReactModal>
  )
}

export default SuccessModal
