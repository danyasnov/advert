import {FC, useState} from 'react'
import {useTranslation} from 'next-i18next'
import {observer} from 'mobx-react-lite'
import IcGooglePlay from 'icons/stores/GooglePlay.svg'
import IcAppStore from 'icons/stores/AppStore.svg'
import IcAppGallery from 'icons/stores/AppGallery.svg'
import IcFB from 'icons/social/FB.svg'
import IcInstagram from 'icons/social/Instagram.svg'
import IcVK from 'icons/social/VK.svg'
import IcYouTube from 'icons/social/YouTube.svg'
import IcTwitter from 'icons/social/Twitter.svg'
import {head} from 'lodash'
import {useRouter} from 'next/router'
import {CountryModel} from 'front-api'
import {
  useCategoriesStore,
  useCountriesStore,
  useGeneralStore,
} from '../providers/RootStoreProvider'
import {notImplementedAlert} from '../helpers'
import LinkButton from './Buttons/LinkButton'
import LinkWrapper from './Buttons/LinkWrapper'
import LocationSelector from './LocationSelector'

const mainCountriesIds = ['643', '804', '112', '300', '792', '196']
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
  const {ids, byId: categoriesById} = useCategoriesStore()
  const {byId: countriesById} = useCountriesStore()
  const [showCountries, setShowCountries] = useState(false)
  const {t} = useTranslation()
  const {push} = useRouter()
  const {showFooter} = useGeneralStore()
  const {countries} = useCountriesStore()
  const countriesByAlphabet = countries.reduce((acc, value) => {
    if (value.has_adverts === '0') return acc
    const result: CountryModel & {href: string} = {
      ...value,
      href: `/cities/${value.isoCode}`,
    }
    if (acc[head(result.title)]) {
      acc[head(result.title)].push(result)
    } else {
      acc[head(result.title)] = [result]
    }

    return acc
  }, {})
  return (
    <footer className={`mx-auto ${showFooter ? '' : 'hidden m:block'}`}>
      <div className='hidden py-2 s:flex s:flex-col items-center l:flex-row l:justify-start l:px-20 fixed-breakpoints-width mx-auto'>
        <div className='flex justify-center space-x-4 mb-2 l:mb-0 l:pr-6'>
          {mainCountriesIds.map((id) => (
            <LinkButton
              key={id}
              onClick={notImplementedAlert}
              label={countriesById[id]?.title}
            />
          ))}
          <LinkButton
            onClick={() => setShowCountries(!showCountries)}
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
      <div
        className={`fixed-breakpoints-width mx-auto px-4 s:px-8 m:px-10 l:px-20 ${
          showCountries ? 'flex' : 'hidden'
        }`}>
        <LocationSelector
          items={countriesByAlphabet}
          title={t('COUNTRY_SELECTION')}
          showAllLink='/all/all'
          onSelect={(item) => {
            push(`/cities/${item.isoCode}`)
          }}
        />
      </div>

      <div className='pt-6 space-y-6 s:border-t border-shadow-b'>
        <div className='space-y-6 px-4 s:px-8 s:grid s:grid-cols-3 s:space-y-0 s:gap-x-4 s:gap-y-6 m:grid-cols-12 m:px-10 l:px-20 fixed-breakpoints-width mx-auto'>
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
              <div className='grid grid-cols-2 grid-rows-6 grid-flow-col place-items-start gap-y-2'>
                {ids.map((id) => (
                  <LinkWrapper
                    title={categoriesById[id]?.name}
                    className='text-body-3 text-brand-b1 whitespace-nowrap'
                    href={`/all/all/${categoriesById[id]?.slug}`}
                    key={id}>
                    {categoriesById[id]?.name}
                  </LinkWrapper>
                ))}
              </div>
            }
          />
          {/* <div className='flex flex-col items-start space-y-2 s:pt-33px s:justify-end m:col-span-2 l:col-span-2'> */}
          {/*  <LinkButton */}
          {/*    onClick={notImplementedAlert} */}
          {/*    label={t('PLACE_AN_AD_FOR_FREE')} */}
          {/*  /> */}
          {/*  <LinkButton onClick={notImplementedAlert} label={t('ADS')} /> */}
          {/*  <LinkButton onClick={notImplementedAlert} label={t('SAFETY')} /> */}
          {/*  <LinkButton onClick={notImplementedAlert} label={t('SHOPS')} /> */}
          {/*  <LinkButton onClick={notImplementedAlert} label={t('ABOUT_US')} /> */}
          {/*  <LinkButton onClick={notImplementedAlert} label={t('CAREER')} /> */}
          {/* </div> */}
        </div>
        <div className='border-t border-shadow-b pt-2'>
          <div className='flex flex-col m:flex-row m:justify-between items-center  m:px-10 l:px-20 fixed-breakpoints-width mx-auto'>
            <div className='flex flex-col space-y-2 s:flex-row s:space-x-4 s:space-y-0'>
              <LinkWrapper
                title={t('TERMS_AND_CONDITIONS')}
                className='text-brand-b1 text-body-3'
                href='/p/terms-and-conditions'>
                {t('TERMS_AND_CONDITIONS')}
              </LinkWrapper>
              <LinkWrapper
                title={t('PRIVACY_POLICY')}
                className='text-brand-b1 text-body-3'
                href='/p/privacy-policy'>
                {t('PRIVACY_POLICY')}
              </LinkWrapper>
              <LinkWrapper
                title={t('RULES')}
                className='text-brand-b1 text-body-3'
                href='/p/rooles/general-requirements-for-adverts'>
                {t('RULES')}
              </LinkWrapper>
              <LinkWrapper
                title={t('COOKIES_POLICY')}
                className='text-brand-b1 text-body-3'
                href='/p/cookies-policy'>
                {t('COOKIES_POLICY')}
              </LinkWrapper>
              <LinkWrapper
                href='https://old.adverto.com'
                title='old.adverto.com'
                className='text-brand-b1 text-body-3'>
                old.adverto.com
              </LinkWrapper>
            </div>
            <div className='text-body-3 my-2 s:my-4 text-black-b'>
              © 2017—{new Date().getFullYear()} A&D Adverto Services LTD
            </div>
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
    <div className={`flex flex-col ${className || ''}`}>
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
