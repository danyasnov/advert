import {FC, useEffect, useRef, useState} from 'react'
import {useTranslation} from 'next-i18next'
import IcMyLocation from 'icons/material/MyLocation.svg'
import {parseCookies} from 'nookies'
import {useRouter} from 'next/router'
import Button from './Buttons/Button'
import {getQueryValue} from '../helpers'
import LocationModal from './LocationModal'
import useDisableBodyScroll from '../hooks/useDisableBodyScroll'
import SearchAutocomplete from './Selects/SearchAutocomplete'

const Search: FC = () => {
  const cookies = parseCookies()
  const router = useRouter()

  const [selectedItem, setSelectedItem] = useState<string>(
    getQueryValue(router.query, 'q'),
  )
  const {t} = useTranslation()
  const [locationModalShow, setLocationModalShow] = useState(false)
  useDisableBodyScroll(locationModalShow)
  const [address, setAddress] = useState(null)
  useEffect(() => {
    setAddress(cookies.address ? cookies.address : null)
  }, [cookies])

  return (
    <>
      <div className='flex h-10 w-full border rounded-2 border-shadow-b divide-x divide-shadow-b '>
        <SearchAutocomplete
          placeholder={t('SEARCH')}
          selectedItem={selectedItem}
          handleSelectedItemChange={setSelectedItem}
        />
        <Button
          onClick={() => setLocationModalShow(true)}
          className='hidden s:flex min-w-10 flex-shrink-0'>
          <div className='flex flex-row items-center px-3.5'>
            <IcMyLocation
              width={24}
              height={23}
              className='fill-current text-black-c'
            />
            {!!address && (
              <span className='text-black-b text-body-2 whitespace-nowrap hidden m:block ml-2'>
                {address}
              </span>
            )}
          </div>
        </Button>
        <Button
          type='submit'
          className='text-body-2 capitalize text-black-b py-2.5 px-3.5'>
          {t('FIND')}
        </Button>
      </div>
      <LocationModal
        isOpen={locationModalShow}
        onClose={() => setLocationModalShow(false)}
      />
    </>
  )
}

export default Search
