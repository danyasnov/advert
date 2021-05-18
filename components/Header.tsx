import {AccountBalanceWallet, ExitToApp, Language} from '@material-ui/icons'
import {FC} from 'react'
import {useTranslation} from 'next-i18next'
import Button from './Button'
import Logo from './Logo'
import Search from './Search'
import CategoriesSelector from './CategoriesSelector'
import LinkButton from './LinkButton'
import {notImplementedAlert} from '../helpers/alert'

const Header: FC = () => {
  const {t} = useTranslation()

  return (
    <div className='s:px-0 s:mx-8 m:mx-10 l:mx-24'>
      <div className='flex s:justify-between px-4 py-2 border-b border-shadow-b s:px-0'>
        <div className='hidden s:flex space-x-4'>
          <LinkButton onClick={notImplementedAlert} label={t('FOR_BUSINESS')} />
          <LinkButton onClick={notImplementedAlert} label={t('SHOPS')} />
          <LinkButton
            onClick={notImplementedAlert}
            label={t('APPLICATION_HELP')}
          />
        </div>
        <div className='flex justify-end w-full s:w-auto space-x-4'>
          <LinkButton
            onClick={notImplementedAlert}
            label={t('WALLET')}
            className='mr-auto s:ml-4'>
            <AccountBalanceWallet style={{fontSize: 16}} className='mr-2' />
          </LinkButton>
          <LinkButton
            onClick={notImplementedAlert}
            label='RU'
            className='s:order-first'>
            <Language style={{fontSize: 16}} className='mr-2' />
          </LinkButton>
          <LinkButton onClick={notImplementedAlert} label={t('LOGIN')}>
            <ExitToApp style={{fontSize: 16}} className='mr-2' />
          </LinkButton>
        </div>
      </div>
      <div className='flex my-2 mx-4 space-x-4 s:my-4 s:mx-0 s:space-x-6 m:space-x-2'>
        <Logo />
        <div className='flex space-x-4 w-full'>
          <CategoriesSelector />
          <Search />
        </div>
        <Button
          className='hidden s:flex h-10 bg-brand-a1 text-body-2 px-3.5 py-3 rounded-8 whitespace-nowrap'
          onClick={notImplementedAlert}>
          <span className='capitalize-first'>{t('NEW_AD')}</span>
        </Button>
      </div>
    </div>
  )
}

export default Header
