import {FC, useEffect, useState} from 'react'
import {useTranslation} from 'next-i18next'
import IcMyLocation from 'icons/material/MyLocation.svg'
import {parseCookies} from 'nookies'
import {useRouter} from 'next/router'
import {useWindowSize} from 'react-use'
import {Send} from 'react-iconly'
import Button from './Buttons/Button'
import {getLocationCodes, getQueryValue} from '../helpers'
import useDisableBodyScroll from '../hooks/useDisableBodyScroll'
import SearchAutocomplete from './Selects/SearchAutocomplete'
import LocationMobile from './Location/LocationMobile'
import LocationDesktop from './Location/LocationDesktop'
import LocationPopup from './Location/LocationPopup'

const Search: FC = () => {
  const router = useRouter()
  const {width} = useWindowSize()

  const [selectedItem, setSelectedItem] = useState<string>(
    getQueryValue(router.query, 'q'),
  )
  const {t} = useTranslation()
  const [locationModalShow, setLocationModalShow] = useState(false)
  useDisableBodyScroll(locationModalShow)

  return (
    <>
      <div className='flex w-full border rounded-2 border-greyscale-200'>
        <SearchAutocomplete
          selectedItem={selectedItem}
          handleSelectedItemChange={setSelectedItem}
        />
        <div className='flex relative'>
          <Button
            type='submit'
            id='location'
            onClick={() => setLocationModalShow(true)}
            className='text-primary-500 px-5'>
            <Send size={15} />
          </Button>
          <div className='hidden s:block absolute top-14 -right-20'>
            <LocationPopup onOpenLocation={() => setLocationModalShow(true)} />
          </div>
        </div>
      </div>
      {width >= 768 && (
        <LocationDesktop
          isOpen={locationModalShow}
          onClose={() => setLocationModalShow(false)}
        />
      )}
      {width < 768 && (
        <LocationMobile
          isOpen={locationModalShow}
          onClose={() => setLocationModalShow(false)}
        />
      )}
    </>
  )
}

export default Search
