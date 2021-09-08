import {FC} from 'react'
import ReactModal from 'react-modal'
import {useTranslation} from 'next-i18next'
import IcClear from 'icons/material/Clear.svg'
import {useWindowSize} from 'react-use'
import Button from './Buttons/Button'
import ProductPhotos from './ProductPhotos'

interface Props {
  isOpen: boolean
  onClose: () => void
}

const PhotosModal: FC<Props> = ({isOpen, onClose}) => {
  const {width} = useWindowSize()
  const {t} = useTranslation()
  if (width < 768) return null

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      shouldCloseOnOverlayClick
      ariaHideApp={false}
      contentLabel='Location Modal'
      className='absolute rounded-6 overflow-hidden w-480px h-680px bg-white-a inset-x-0 mx-auto top-24 flex outline-none'
      overlayClassName='fixed inset-0 bg-shadow-overlay max-h-screen overflow-y-auto z-20'>
      <div className='flex flex-col w-full'>
        <div className='px-6 mt-6 pb-4 flex justify-between border-b border-shadow-b'>
          <span className='text-h-2 text-black-b font-bold'>
            {t('LOCATION')}
          </span>
          <Button onClick={onClose}>
            <IcClear className='fill-current text-black-d h-6 w-6' />
          </Button>
        </div>
        <ProductPhotos />
      </div>
    </ReactModal>
  )
}

export default PhotosModal
