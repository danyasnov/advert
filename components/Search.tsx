import {FC, useState} from 'react'
import {useTranslation} from 'next-i18next'
import {useRouter} from 'next/router'
import {useWindowSize} from 'react-use'
import IcMap from 'icons/FindMap.svg'
import Button from './Buttons/Button'
import {getQueryValue} from '../helpers'
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
      <div className='flex w-full border rounded-2 border-greyscale-200 relative'>
        <SearchAutocomplete
          selectedItem={selectedItem}
          handleSelectedItemChange={setSelectedItem}
        />
        <div className='flex absolute right-0 inset-y-0'>
          <Button
            type='submit'
            id='location'
            onClick={() => setLocationModalShow(true)}
            className='text-primary-500 px-5'>
            <IcMap width={20} height={20} />
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
