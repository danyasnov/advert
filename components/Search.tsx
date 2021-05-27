import {FC, useState} from 'react'
import {useTranslation} from 'next-i18next'
import IcMyLocation from 'icons/material/MyLocation.svg'
import Button from './Buttons/Button'
import {notImplementedAlert} from '../helpers'
import LocationModal from './LocationModal'

const Search: FC = () => {
  const {t} = useTranslation()
  const [locationModalShow, setLocationModalShow] = useState(false)

  return (
    <div className='flex h-10 w-full border rounded-2 border-shadow-b divide-x divide-shadow-b'>
      <input
        className='w-full py-2.5 px-3.5 text-body-2 text-black-c rounded-l-2'
        type='text'
        placeholder={t('SEARCH')}
      />
      <Button
        onClick={() => setLocationModalShow(true)}
        className='hidden s:flex text-black-c w-9.5 h-9.5 flex-shrink-0 m:hidden'>
        <IcMyLocation
          width={24}
          height={23}
          className='fill-current text-black-c'
        />
      </Button>
      <Button
        onClick={notImplementedAlert}
        className='text-body-2 capitalize text-black-b py-2.5 px-3.5'>
        {t('FIND')}
      </Button>
      <LocationModal
        isOpen={locationModalShow}
        onClose={() => setLocationModalShow(false)}
      />
    </div>
  )
}

export default Search
