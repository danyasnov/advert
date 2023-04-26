import {FC, useState, useRef, useEffect} from 'react'
import {useTranslation} from 'next-i18next'
import {observer} from 'mobx-react-lite'
import {useRouter} from 'next/router'
import {parseCookies} from 'nookies'
import IcBurger from 'icons/material/Burger.svg'
import IcClose from 'icons/material/Close.svg'
import IcWorldPurple from 'icons/material/WorldPurple.svg'
import {User, Work, Lock} from 'react-iconly'
import {slide as Menu} from 'react-burger-menu'
import {components} from 'react-select'
import {setCookiesObject} from '../helpers'
import useDisableBodyScroll from '../hooks/useDisableBodyScroll'
import LoginModal from './Auth/Login/LoginModal'
import Button from './Buttons/Button'
import LinkWrapper from './Buttons/LinkWrapper'
import {useGeneralStore} from '../providers/RootStoreProvider'
import {SerializedCookiesState} from '../types'
import LinkSelect from './Selects/LinkSelect'
import {SelectItem} from './Selects/Select'
import Select from './Selects/Select'
import LanguageSelect from './LanguageSelect'

const styles = {
  bmBurgerButton: {
    width: '24px',
    height: '24px',
    position: 'relative',
  },
  bmMenuWrap: {
    height: '100%',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  bmOverlay: {
    background: '#09101D',
    opacity: '0.7',
    height: '100%',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
}

const languageOptions = [
  {
    value: 'el',
    label: 'Eλληνική',
  },
  {value: 'en', label: 'English'},
  {value: 'uk', label: 'Українська'},
  {value: 'ru', label: 'Русский'},
]

const Burger: FC = observer(() => {
  const {t} = useTranslation()
  const {showLogin, setShowLogin, user} = useGeneralStore()
  const [isOpen, setOpen] = useState(false)
  const [showLanguage, setShowLanguage] = useState(false)
  const {reload} = useRouter()
  useDisableBodyScroll(showLogin)
  const cookies: SerializedCookiesState = parseCookies()

  const handleIsOpen = () => {
    setOpen(!isOpen)
  }

  const closeSideBar = () => {
    setOpen(false)
  }

  return (
    <>
      <Menu
        isOpen={isOpen}
        onOpen={handleIsOpen}
        onClose={handleIsOpen}
        styles={styles}
        customBurgerIcon={
          <IcBurger className='fill-current text-greyscale-900 h-6 w-6' />
        }
        customCloseIcon={false}
        width={280}
        left>
        <div className='flex flex-col pt-10 px-4 h-full bg-white'>
          <Button
            onClick={closeSideBar}
            className='text-greyscale-500 text-body-14 flex items-center'>
            <IcClose className='fill-current h-4 w-4 mr-2' />
            {t('CLOSE')}
          </Button>
          <div className='mt-6 flex flex-col items-start space-y-6'>
            <div>
              {user ? (
                <LinkWrapper
                  title='user'
                  href={`/user/${user.hash}`}
                  className='flex justify-center items-center'>
                  <div className='fill-current text-primary-500 mr-2'>
                    <User set='bold' size={16} />
                  </div>
                  <div className='text-greyscale-900 text-body-16'>
                    {t('MY_PROFILE')}
                  </div>
                </LinkWrapper>
              ) : (
                <Button
                  className='flex justify-center items-center'
                  onClick={() => {
                    setOpen(false)
                    setShowLogin(true)
                  }}>
                  <div className='fill-current text-primary-500 mr-2'>
                    <User set='bold' size={16} />
                  </div>
                  <span className='text-greyscale-900 text-body-16'>
                    {t('LOG_IN_ICON')}
                  </span>
                </Button>
              )}
            </div>
            <div>
              <Button
                className='flex justify-center items-center'
                onClick={() => setShowLanguage(!showLanguage)}>
                <IcWorldPurple className='fill-current text-primary-500 mr-2 h-4 w-4' />
                <div className='text-greyscale-800 text-body-16'>
                  {t('LANGUAGES')}
                </div>
              </Button>
              {showLanguage && (
                <div className='ml-[36px] mt-4'>
                  {languageOptions.map((lang) => (
                    <Button
                      className={`${
                        cookies.language === lang.value
                          ? 'text-primary-500'
                          : 'text-greyscale-900'
                      } mt-4  text-body-16`}
                      onClick={() => {
                        setCookiesObject({language: lang.value as string})
                        reload()
                      }}>
                      <span>{t(lang.label)}</span>
                    </Button>
                  ))}
                </div>
              )}
            </div>

            <LinkWrapper
              title='business'
              href='/business'
              className='flex justify-center items-center'>
              <div className='fill-current text-primary-500 mr-2'>
                <Work set='bold' size={16} />
              </div>
              <div className='text-greyscale-800 text-body-16'>
                {t('FOR_BUSINESS')}
              </div>
            </LinkWrapper>
            <LinkWrapper
              title='security'
              href='/security'
              className='flex justify-center items-center'>
              <div className='fill-current text-primary-500 mr-2'>
                <Lock set='bold' size={16} />
              </div>
              <div className='text-greyscale-800 text-body-16'>
                {t('SECURITY')}
              </div>
            </LinkWrapper>
          </div>
        </div>
      </Menu>
      {showLogin && (
        <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
      )}
    </>
  )
})

export default Burger
