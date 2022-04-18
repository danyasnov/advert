import {FC, useState} from 'react'
import {parseCookies} from 'nookies'
import TextForm from './TextForm'
import Tabs from '../Tabs'
import MapForm from './MapForm'

interface Props {
  onClose: () => void
}

const tabs = [
  {id: 0, title: 'ON_THE_MAP'},
  {id: 1, title: 'ENTER_TEXT'},
]

const LocationForm: FC<Props> = ({onClose}) => {
  const cookies = parseCookies()
  const [activeTab, setActiveTab] = useState(() => {
    return cookies.searchBy === 'id' ? 1 : 0
  })

  return (
    <div
      className='flex flex-col w-full bg-white z-10 left-0 h-full'
      data-test-id='location-modal-form'>
      <div className='h-full flex flex-col'>
        <div className='px-4 s:px-0'>
          <Tabs
            items={tabs}
            value={activeTab}
            onChange={(id) => setActiveTab(id)}
          />
        </div>

        {activeTab === 0 && <MapForm onClose={onClose} />}
        {activeTab === 1 && <TextForm onClose={onClose} />}
      </div>
    </div>
  )
}

export default LocationForm
