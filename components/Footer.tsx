import {FC} from 'react'
import {useTranslation} from 'next-i18next'
import {observer} from 'mobx-react-lite'
import {toJS} from 'mobx'
import LinkButton from './LinkButton'
import {notImplementedAlert} from '../helpers/alert'
import {useCategoriesStore} from '../providers/RootStoreProvider'
// todo настроить babel-module-resolver для иконок
import IcGooglePlay from '../assets/icons/stores/GooglePlay.svg'
import IcAppStore from '../assets/icons/stores/AppStore.svg'
import IcAppGallery from '../assets/icons/stores/AppGallery.svg'
import IcFB from '../assets/icons/social/FB.svg'
import IcInstagram from '../assets/icons/social/Instagram.svg'
import IcVK from '../assets/icons/social/VK.svg'
import IcYouTube from '../assets/icons/social/YouTube.svg'
import IcTwitter from '../assets/icons/social/Twitter.svg'

const mainCountries: Array<string> = [
  'россия',
  'украина',
  'белоруссия',
  'греция',
  'турция',
  'кипр',
]
const mainCities: Array<string> = [
  'санкт-Петербург',
  'екатеринбург',
  'лимассол',
  'стамбул',
  'никоссия',
  'пафос',
  'афины',
]
const Footer: FC = observer(() => {
  const store = useCategoriesStore()
  const {t} = useTranslation()
  const categories = toJS(store.categories)

  return (
    <footer>
      <div className='hidden py-2 s:flex s:flex-col items-center l:flex-row l:justify-start l:px-20'>
        <div className='flex justify-center space-x-4 mb-2 l:mb-0 l:pr-6'>
          {mainCountries.map((i) => (
            <LinkButton key={i} onClick={notImplementedAlert} label={i} />
          ))}
          <LinkButton
            onClick={notImplementedAlert}
            label={t('ALL_COUNTRIES')}
            className='font-bold'
          />
        </div>
        <div className='flex justify-center space-x-4 border-shadow-b border-t pt-2 w-min l:border-t-0 l:border-l l:pt-0 l:pl-6'>
          {mainCities.map((i) => (
            <LinkButton key={i} onClick={notImplementedAlert} label={i} />
          ))}
          <LinkButton
            onClick={notImplementedAlert}
            label={t('ALL_CITIES')}
            className='font-bold'
          />
        </div>
      </div>
      <div className='pt-6 space-y-6 s:border-t border-shadow-b'>
        <div className='space-y-6 px-4 s:px-8 s:grid s:grid-cols-3 s:space-y-0 s:gap-x-4 s:gap-y-6 m:grid-cols-12 m:px-10 l:px-20'>
          <Section
            title={t('MOBILE_APP')}
            className='s:col-span-2 m:col-span-3 l:col-span-4'
            body={
              <>
                <div className='text-body-3 text-black-b capitalize-first mb-2 l:mb-4'>
                  {t('INSTALL_MOBILE_APP')}
                </div>
                <div className='flex flex-wrap'>
                  <IcGooglePlay
                    width={135}
                    height={40}
                    className='l:mr-2 l:mb-2'
                  />
                  <IcAppStore
                    width={120}
                    height={40}
                    className='hidden l:block'
                  />
                  <IcAppGallery
                    width={133}
                    height={40}
                    className='hidden l:block'
                  />
                </div>
              </>
            }
          />
          <Section
            title={t('SOCIAL_NETWORK')}
            className='m:col-span-3 l:col-span-2'
            body={
              <div className='flex space-x-2'>
                <IcFB width={24} height={24} />
                <IcInstagram width={24} height={24} />
                <IcVK width={24} height={24} />
                <IcYouTube width={24} height={24} />
                <IcTwitter width={24} height={24} />
              </div>
            }
          />
          <Section
            title={t('CATEGORIES')}
            className='s:col-span-2 m:col-span-4 l:col-span-4'
            headerLink={
              <LinkButton onClick={notImplementedAlert} label={t('ALL')} />
            }
            body={
              <div className='grid grid-cols-2 grid-rows-5 grid-flow-col place-items-start gap-y-2'>
                {categories.map((c) => (
                  <LinkButton
                    key={c.id}
                    onClick={notImplementedAlert}
                    label={c.name}
                  />
                ))}
              </div>
            }
          />
          <div className='flex flex-col items-start space-y-2 s:pt-33px s:justify-end m:col-span-2 l:col-span-2'>
            <LinkButton
              onClick={notImplementedAlert}
              label={t('PLACE_AN_AD_FOR_FREE')}
            />
            <LinkButton onClick={notImplementedAlert} label={t('ADS')} />
            <LinkButton onClick={notImplementedAlert} label={t('SAFETY')} />
            <LinkButton onClick={notImplementedAlert} label={t('SHOPS')} />
            <LinkButton onClick={notImplementedAlert} label={t('ABOUT_US')} />
            <LinkButton onClick={notImplementedAlert} label={t('CAREER')} />
          </div>
        </div>
        <div className='flex flex-col items-center border-t border-shadow-b pt-2 m:flex-row m:justify-between m:px-10 l:px-20'>
          <div className='flex flex-col space-y-2 s:flex-row s:space-x-4 s:space-y-0'>
            <LinkButton
              onClick={notImplementedAlert}
              label={t('LICENSE_AGREEMENT')}
            />
            <LinkButton onClick={notImplementedAlert} label={t('PHOTOS')} />
            <LinkButton
              onClick={notImplementedAlert}
              label={t('ADVERTISING_ADVERTO')}
            />
            <LinkButton
              onClick={notImplementedAlert}
              label={t('APPLICATION_HELP')}
            />
          </div>
          <div className='text-body-3 mt-2 s:mt-4 m:mt-0 text-black-b'>
            © 2017—{new Date().getFullYear()} A&D Adverto Services LTD
          </div>
        </div>
      </div>
    </footer>
  )
})

interface Props {
  title?: string
  className?: string
  headerLink?: JSX.Element
  body: JSX.Element
}

const Section: FC<Props> = ({title, body, headerLink, className}) => {
  return (
    <div className={`flex flex-col ${className}`}>
      <div className='flex justify-between pb-2 border-b mb-2 border-shadow-b'>
        {title && (
          <div className='text-body-2 text-black-b font-bold capitalize-first '>
            {title}
          </div>
        )}
        {headerLink && headerLink}
      </div>
      {body}
    </div>
  )
}

export default Footer
