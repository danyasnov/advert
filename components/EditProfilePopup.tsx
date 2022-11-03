import {FC, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {Edit} from 'react-iconly'
import {useTranslation} from 'next-i18next'
import ReactModal from 'react-modal'
import IcClear from 'icons/material/Clear.svg'
import {useUserStore} from '../providers/RootStoreProvider'
import Button from './Buttons/Button'
import LocationForm from './Location/LocationForm'

const EditProfilePopup: FC = observer(() => {
  const {user} = useUserStore()
  const {t} = useTranslation()
  const [show, setShow] = useState(false)

  return (
    <div>
      <Button className='hover:text-primary-500 text-greyscale-500'>
        <div className='flex justify-center items-center space-x-2'>
          <Edit filled size={16} />
          <span className='text-body-14'>{t('EDIT')}</span>
        </div>
      </Button>
      {show && (
        <ReactModal
          isOpen={show}
          onRequestClose={() => setShow(false)}
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
      )}
    </div>
  )
})
export default EditProfilePopup
