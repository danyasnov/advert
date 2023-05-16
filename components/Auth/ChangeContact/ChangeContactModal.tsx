import {FC, useState} from 'react'
import ReactModal from 'react-modal'
import {useTranslation} from 'next-i18next'
import IcClear from 'icons/material/Clear.svg'
import Button from '../../Buttons/Button'
import useDisableBodyScroll from '../../../hooks/useDisableBodyScroll'
import ChangeContactWizard from './ChangeContactWizard'

interface Props {
  isOpen: boolean
  onClose: () => void
  onFinish: (phoneNum: string) => void
  type: 'phone' | 'email'
}

const ChangeContactModal: FC<Props> = ({isOpen, onClose, onFinish, type}) => {
  const {t} = useTranslation()
  const [title, setTitle] = useState(t('LOG_IN'))
  useDisableBodyScroll(isOpen)
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      shouldCloseOnOverlayClick={false}
      ariaHideApp={false}
      contentLabel={title}
      className='absolute rounded-6 w-11/12 s:w-[460px] bg-white-a inset-x-0  mx-auto top-1/3 s:top-24 flex outline-none drop-shadow-2xl'
      overlayClassName='fixed inset-0 bg-shadow-overlay max-h-screen overflow-y-auto z-20'>
      <div className='flex flex-col w-full'>
        <div className='px-6 pt-6 pb-4 flex justify-between'>
          <span className='text-h-5 text-greyscale-900 font-bold leading-8	'>
            {title}
          </span>
          <Button onClick={onClose}>
            <IcClear className='fill-current text-black-d h-6 w-6' />
          </Button>
        </div>
        <ChangeContactWizard
          type={type}
          setTitle={setTitle}
          onClose={onClose}
          onFinish={onFinish}
        />
      </div>
    </ReactModal>
  )
}
export default ChangeContactModal
