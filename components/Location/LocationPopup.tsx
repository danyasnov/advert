import {FC, useEffect, useState} from 'react'
import {parseCookies} from 'nookies'
import {useTranslation} from 'next-i18next'
import PrimaryButton from '../Buttons/PrimaryButton'
import SecondaryButton from '../Buttons/SecondaryButton'
import {SerializedCookiesState} from '../../types'
import {setCookiesObject} from '../../helpers'

interface Props {
  onOpenLocation: () => void
}

const LocationPopup: FC<Props> = ({onOpenLocation}) => {
  const [show, setShow] = useState(false)

  const {t} = useTranslation()
  useEffect(() => {
    const state: SerializedCookiesState = parseCookies()

    setShow(state.showLocationPopup !== 'false')
  }, [])
  const cookies = parseCookies()

  const [address, setAddress] = useState(null)
  useEffect(() => {
    setAddress(cookies.address ? cookies.address : null)
  }, [cookies])
  const onClick = () => {
    setCookiesObject({showLocationPopup: false})
    setShow(false)
  }

  if (!show) return null
  return (
    <div className='flex flex-col w-40 rounded-2xl p-4 text-body-14 shadow-2xl bg-white break-words location-popup-arrow-top items-center'>
      <span className='text-black-b mb-4'>{address}</span>
      <span className='text-black-b mb-4'>
        {t('LOCATION_MESSAGE_QUESTION')}
      </span>
      <PrimaryButton className='mb-2 w-full' onClick={onClick}>
        {t('LOCATION_YES')}
      </PrimaryButton>
      <SecondaryButton
        onClick={() => {
          onClick()
          onOpenLocation()
        }}
        className='text-black-b w-full'>
        {t('LOCATION_CHANGE')}
      </SecondaryButton>
    </div>
  )
}

export default LocationPopup
