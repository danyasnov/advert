import {FC} from 'react'
import ReactModal from 'react-modal'
import {useTranslation} from 'next-i18next'
import IcClear from 'icons/material/Clear.svg'
import Button from '../Buttons/Button'
import LocationForm from './LocationForm'

interface Props {
  isOpen: boolean
  onClose: () => void
}

const LocationMobile: FC<Props> = ({isOpen, onClose}) => {
  const {t} = useTranslation()

  if (!isOpen) return null

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      shouldCloseOnOverlayClick
      ariaHideApp={false}
      contentLabel='Location Modal'
      className='absolute w-full  bg-white-a inset-x-0 mx-auto flex outline-none'
      overlayClassName='fixed inset-0 bg-shadow-overlay max-h-screen z-20 overflow-y-auto'>
      <div className='flex flex-col w-full absolute bg-white z-10 left-0'>
        <div className='px-4 s:px-6 mt-6 pb-4 flex justify-between border-b border-shadow-b'>
          <span className='text-body-14 text-greyscale-900 font-bold'>
            {t('LOCATION')}
          </span>
          <Button onClick={onClose}>
            <IcClear className='fill-current text-black-d h-6 w-6' />
          </Button>
        </div>
        <LocationForm onClose={onClose} />
      </div>
    </ReactModal>
  )
}

export default LocationMobile
