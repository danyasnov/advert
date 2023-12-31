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
    <div className='flex flex-col w-[280px] rounded-2xl p-6 shadow-2xl bg-white break-words items-center z-20'>
      <span className='text-primary-500 mb-4 text-h-4 font-bold text-center'>
        {address}
      </span>
      <span className='text-greyscale-900 text-body-16 font-normal mb-6'>
        {t('LOCATION_MESSAGE_QUESTION')}
      </span>
      <PrimaryButton className='mb-3 w-full' onClick={onClick}>
        {t('LOCATION_YES')}
      </PrimaryButton>
      <SecondaryButton
        onClick={() => {
          onClick()
          onOpenLocation()
        }}
        className='w-full'>
        {t('LOCATION_CHANGE')}
      </SecondaryButton>
    </div>
  )
}

export default LocationPopup
