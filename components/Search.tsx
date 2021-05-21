import {FC} from 'react'
import {useTranslation} from 'next-i18next'
import IcMyLocation from 'icons/material/MyLocation.svg'
import Button from './Button'
import {notImplementedAlert} from '../helpers'

const Search: FC = () => {
  const {t} = useTranslation()

  return (
    <div className='flex h-10 w-full border rounded-8 border-shadow-b divide-x divide-shadow-b'>
      <input
        className='w-full py-2.5 px-3.5 text-body-2 text-black-c rounded-l-8'
        type='text'
        placeholder={t('SEARCH')}
      />
      <Button
        onClick={notImplementedAlert}
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
    </div>
  )
}

export default Search
