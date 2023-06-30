import {FC, useCallback, useState} from 'react'
import ReactModal from 'react-modal'
import {useTranslation} from 'next-i18next'
import IcClear from 'icons/material/Clear.svg'
import {ArrowLeft} from 'react-iconly'
import Button from '../Buttons/Button'
import LoginWizard from '../Auth/Login/LoginWizard'

interface Props {
  isOpen: boolean
  onClose: () => void
  onFinish?: () => void
}

const LoginModal: FC<Props> = ({isOpen, onClose, onFinish}) => {
  const {t} = useTranslation()
  const [header, setHeader] = useState({
    title: t('LOG_IN'),
    backButtonHandler: null,
  })

  const setTitleWrapper = useCallback((newTitle, backButtonHandler) => {
    setHeader({title: newTitle, backButtonHandler})
  }, [])

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      shouldCloseOnOverlayClick={false}
      ariaHideApp={false}
      contentLabel={header.title}
      className='absolute rounded-6 w-11/12 s:w-480px bg-white-a inset-x-0 mx-auto top-1/3 s:top-[162px] flex outline-none drop-shadow-2xl'
      overlayClassName='fixed inset-0 max-h-screen overflow-y-auto z-20 bg-modal-background'>
      <div className='flex flex-col w-full'>
        <div className='px-6 pt-6 pb-4 flex justify-between'>
          <div className='flex space-x-2 w-full'>
            {header.backButtonHandler && (
              <Button onClick={header.backButtonHandler}>
                <ArrowLeft />
              </Button>
            )}
            <span
              className={`font-bold ${
                header.title.toString() !== t('LOG_IN')
                  ? 'text-h-5 text-grayscale-900'
                  : 'text-h-3 text-primary-500'
              }`}>
              {header.title}
            </span>
          </div>
          <Button onClick={onClose}>
            <IcClear className='fill-current text-greyscale-400 h-6 w-6' />
          </Button>
        </div>

        <LoginWizard
          setTitle={setTitleWrapper}
          onClose={onClose}
          onFinish={onFinish}
        />
      </div>
    </ReactModal>
  )
}
export default LoginModal
