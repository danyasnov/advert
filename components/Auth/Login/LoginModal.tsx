import {FC, useState} from 'react'
import ReactModal from 'react-modal'
import {useTranslation} from 'next-i18next'
import IcClear from 'icons/material/Clear.svg'
import Button from '../../Buttons/Button'
import LoginWizard from './LoginWizard'

interface Props {
  isOpen: boolean
  onClose: () => void
  onFinish?: () => void
}

const LoginModal: FC<Props> = ({isOpen, onClose, onFinish}) => {
  const {t} = useTranslation()
  const [title, setTitle] = useState(t('LOG_IN'))
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      shouldCloseOnOverlayClick={false}
      ariaHideApp={false}
      contentLabel={title}
      className='absolute rounded-6 w-11/12 s:w-480px bg-white-a inset-x-0  mx-auto top-1/3 s:top-24 flex outline-none drop-shadow-2xl'
      overlayClassName='fixed inset-0 bg-advert-background bg-repeat max-h-screen overflow-y-auto z-20'>
      <div className='flex flex-col w-full'>
        <div className='px-6 pt-6 pb-4 flex mb-3 justify-between'>
          <span className='text-h-3 text-primary-500 font-bold'>{title}</span>
          <Button onClick={onClose}>
            <IcClear className='fill-current text-greyscale-400 h-6 w-6' />
          </Button>
        </div>

        <LoginWizard
          setTitle={setTitle}
          onClose={onClose}
          onFinish={onFinish}
        />
      </div>
    </ReactModal>
  )
}
export default LoginModal
