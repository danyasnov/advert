import {FC, useState} from 'react'
import ReactModal from 'react-modal'
import {useTranslation} from 'next-i18next'
import IcClear from 'icons/material/Clear.svg'
import Button from '../Buttons/Button'
import {notImplementedAlert} from '../../helpers'
import TextForm from './TextForm'
import Tabs from './Tabs'
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
  const {t} = useTranslation()
  const [activeTab, setActiveTab] = useState(0)

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      shouldCloseOnOverlayClick
      contentLabel='Location Modal'
      className='absolute rounded-6 w-480px h-680px bg-white-a inset-x-0 mx-auto top-24 flex'
      overlayClassName='fixed inset-0 bg-shadow-overlay'>
      <div className='flex flex-col w-full'>
        <div className='px-6 mt-6 pb-4 flex justify-between border-b border-shadow-b'>
          <span className='text-h-2 text-black-b font-bold'>
            {t('LOCATION')}
          </span>
          <Button onClick={onClose}>
            <IcClear className='fill-current text-black-d h-6 w-6' />
          </Button>
        </div>
        <div className='px-6 h-full'>
          <Tabs
            items={tabs}
            value={activeTab}
            onChange={(id) => setActiveTab(id)}
          />
          {activeTab === 0 && <MapForm />}
          {activeTab === 1 && <TextForm />}
        </div>
        <div className='px-6 mb-6 pt-4 flex justify-end border-t border-shadow-b'>
          <Button
            onClick={notImplementedAlert}
            className='rounded-2xl py-3 px-3.5 border border-shadow-b text-body-2 text-black-b'>
            {t('CLEAN')}
          </Button>
          <Button
            onClick={notImplementedAlert}
            className='ml-4 rounded-2xl py-3 px-3.5 text-body-2 bg-brand-a1 text-white-a'>
            {t('APPLY')}
          </Button>
        </div>
      </div>
    </ReactModal>
  )
}

export default LocationModal
