import {FC} from 'react'
import {useTranslation} from 'next-i18next'
import {observer} from 'mobx-react-lite'
import Logo from '../Logo'
import Auth from '../Auth'

const Header: FC = observer(() => {
  const {t} = useTranslation()

  return (
    <header className='hidden s:block relative z-10 header-width mx-auto py-8'>
      <div className='w-full l:w-1208px flex items-center justify-between'>
        <div className='flex items-center'>
          <Logo variant='small' />
          <span className='ml-6 text-h-4 font-bold'>{t('NEW_AD')}</span>
        </div>
        <div className='flex items-center px-6'>
          <Auth />
        </div>
      </div>
    </header>
  )
})

export default Header
