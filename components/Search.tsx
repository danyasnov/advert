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
  const cookies = parseCookies()
  const router = useRouter()
  const {width} = useWindowSize()

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
      <div className='flex w-full border rounded-2 border-greyscale-200'>
        <SearchAutocomplete
          selectedItem={selectedItem}
          handleSelectedItemChange={setSelectedItem}
        />
        {/* <div className='flex'> */}
        {/*  <Button */}
        {/*    id='location' */}
        {/*    onClick={() => setLocationModalShow(true)} */}
        {/*    className='flex min-w-10 shrink-0'> */}
        {/*    <div className='flex flex-row items-center px-3.5'> */}
        {/*      <IcMyLocation */}
        {/*        width={24} */}
        {/*        height={23} */}
        {/*        className='fill-current text-black-c' */}
        {/*      /> */}
        {/*      {!!address && ( */}
        {/*        <span className='text-black-b text-body-2 whitespace-nowrap hidden m:block ml-2'> */}
        {/*          {address} */}
        {/*        </span> */}
        {/*      )} */}
        {/*    </div> */}
        {/*  </Button> */}
        {/*  <div className='hidden m:block absolute top-28'> */}
        {/*    <LocationPopup onOpenLocation={() => setLocationModalShow(true)} /> */}
        {/*  </div> */}
        {/* </div> */}

        <Button
          type='submit'
          onClick={() => {
            router.push({
              pathname: `/${getLocationCodes()}`,
              query: {
                q: selectedItem,
              },
            })
          }}
          className='text-primary-500 px-5'>
          <Send size={15} />
        </Button>
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
