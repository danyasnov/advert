import {FC, useState} from 'react'
import ReactModal from 'react-modal'
import {useTranslation} from 'next-i18next'
import IcClear from 'icons/material/Clear.svg'
import {parseCookies} from 'nookies'
import Button from '../Buttons/Button'
import TextForm from './TextForm'
import Tabs from '../Tabs'
import MapForm from './MapForm'

interface Props {
  isOpen: boolean
  onClose: () => void
}

const tabs = [
  {id: 0, title: 'ON_THE_MAP'},
  {id: 1, title: 'ENTER_TEXT'},
]

const LocationModal: FC<Props> = ({isOpen, onClose}) => {
  const cookies = parseCookies()
  const {t} = useTranslation()
  const [activeTab, setActiveTab] = useState(() => {
    return cookies.searchBy === 'id' ? 1 : 0
  })

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      shouldCloseOnOverlayClick
      ariaHideApp={false}
      contentLabel='Location Modal'
      className='absolute rounded-6 w-480px h-680px bg-white-a inset-x-0 mx-auto top-24 flex outline-none'
      overlayClassName='fixed inset-0 bg-shadow-overlay max-h-screen overflow-y-auto'>
      <div className='flex flex-col w-full'>
        <div className='px-6 mt-6 pb-4 flex justify-between border-b border-shadow-b'>
          <span className='text-h-2 text-black-b font-bold'>
            {t('LOCATION')}
          </span>
          <Button onClick={onClose}>
            <IcClear className='fill-current text-black-d h-6 w-6' />
          </Button>
        </div>
        <div className='h-full flex flex-col'>
          <Tabs
            items={tabs}
            value={activeTab}
            onChange={(id) => setActiveTab(id)}
          />
          {activeTab === 0 && <MapForm onClose={onClose} />}
          {activeTab === 1 && <TextForm onClose={onClose} />}
        </div>
      </div>
    </ReactModal>
  )
}

export default LocationModal
