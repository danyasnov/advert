import {FC, useState} from 'react'
import {useTranslation} from 'next-i18next'
import {observer} from 'mobx-react-lite'
import {head} from 'lodash'
import {useRouter} from 'next/router'
import {CountryModel} from 'front-api'
import {parseCookies} from 'nookies'
import IcAppGallery from 'icons/stores/AppGallery.svg'
import {
  useCategoriesStore,
  useCountriesStore,
  useGeneralStore,
} from '../providers/RootStoreProvider'
import LinkButton from './Buttons/LinkButton'
import LinkWrapper from './Buttons/LinkWrapper'
import LocationSelector from './LocationSelector'
import {SerializedCookiesState} from '../types'
import Socials from './Socials'

const mainCountriesIds = ['643', '804', '112', '300', '792', '196']

const Footer: FC = observer(() => {
  const {ids, byId: categoriesById} = useCategoriesStore()
  const {byId: countriesById} = useCountriesStore()
  const [showCountries, setShowCountries] = useState(false)
  const {t} = useTranslation()
  const {push} = useRouter()
  const {showFooter} = useGeneralStore()
  const {countries} = useCountriesStore()
  const state: SerializedCookiesState = parseCookies()
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
    <footer
      className={`mx-auto relative z-10 ${showFooter ? '' : 'hidden m:block'}`}>
      <div className='hidden py-2 s:flex s:flex-col items-center l:flex-row l:justify-start l:px-20 fixed-breakpoints-width mx-auto'>
        <div className='flex justify-center items-center space-x-4 l:mb-0 l:pr-6'>
          {mainCountriesIds.map((id) => (
            <LinkWrapper
              key={id}
              className='text-brand-b1 text-body-12'
              href={`/${countriesById[id]?.isoCode}/all`}
              title={countriesById[id]?.title}>
              {countriesById[id]?.title}
            </LinkWrapper>
          ))}
          <LinkButton
            onClick={() => setShowCountries(!showCountries)}
            label={t('ALL_COUNTRIES')}
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
            title={t('CATEGORIES')}
            className='m:col-span-4 l:col-span-6'
            body={
              <div className='grid s:grid-cols-1 m:grid-cols-2 l:grid-cols-3 gap-y-2'>
                {ids.map((id) => (
                  <LinkWrapper
                    title={categoriesById[id]?.name}
                    className='text-body-16 text-greyscale-800 whitespace-nowrap truncate'
                    href={`/all/all/${categoriesById[id]?.slug}`}
                    key={id}>
                    {categoriesById[id]?.name}
                  </LinkWrapper>
                ))}
              </div>
            }
          />
          <Section
            title={t('MOBILE_APP')}
            className='m:col-span-4 l:col-span-3'
            body={
              <>
                <div className='text-body-14 text-greyscale-800 capitalize-first mb-2 l:mb-4'>
                  {t('INSTALL_MOBILE_APP')}
                </div>
                <div className='flex flex-wrap items-center justify-around s:justify-start'>
                  {/* <a */}
                  {/*  href='https://play.google.com/store/apps/details?id=adverto.sale&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1' */}
                  {/*  className='l:mr-2 inline-flex m:-ml-2' */}
                  {/*  style={{width: '135px', height: '55px'}}> */}
                  {/*  <img */}
                  {/*    alt='Get it on Google Play' */}
                  {/*    src='https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png' */}
                  {/*  /> */}
                  {/* </a> */}
                  {/* <a */}
                  {/*  className='inline-flex' */}
                  {/*  href='https://apps.apple.com/ru/app/adverto/id1287862488?itsct=apps_box_badge&amp;itscg=30200' */}
                  {/*  style={{ */}
                  {/*    borderRadius: '13px', */}
                  {/*    width: '130px', */}
                  {/*  }}> */}
                  {/*  <img */}
                  {/*    src='https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us?size=250x83&amp;releaseDate=1513555200&h=328ae9fa89f9b000ff0df1a0bd814025' */}
                  {/*    alt='Download on the App Store' */}
                  {/*    style={{ */}
                  {/*      borderRadius: '13px', */}
                  {/*      width: '120px', */}
                  {/*      height: '40px', */}
                  {/*    }} */}
                  {/*  /> */}
                  {/* </a> */}
                  {/* <a */}
                  {/*  className='m:pt-1 l:pt-0' */}
                  {/*  href='https://appgallery.huawei.com/app/C104708185'> */}
                  {/*  <IcAppGallery className='h-10 w-30' /> */}
                  {/* </a> */}
                </div>
              </>
            }
          />
          <Section
            title={t('SOCIAL_NETWORK')}
            className='m:col-span-3 l:col-span-2'
            body={<Socials />}
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
                className='text-brand-b1 text-body-12'
                href='/p/terms-and-conditions'>
                {t('TERMS_AND_CONDITIONS')}
              </LinkWrapper>
              <LinkWrapper
                title={t('PRIVACY_POLICY')}
                className='text-brand-b1 text-body-12'
                href='/p/privacy-policy'>
                {t('PRIVACY_POLICY')}
              </LinkWrapper>
              <LinkWrapper
                title={t('RULES')}
                className='text-brand-b1 text-body-12'
                href='/p/rooles/general-requirements-for-adverts'>
                {t('RULES')}
              </LinkWrapper>
              <LinkWrapper
                title={t('COOKIES_POLICY')}
                className='text-brand-b1 text-body-12'
                href='/p/cookies-policy'>
                {t('COOKIES_POLICY')}
              </LinkWrapper>
              <LinkWrapper
                title={t('SAFETY')}
                className='text-brand-b1 text-body-12'
                href='/safety'>
                {t('SAFETY')}
              </LinkWrapper>
              <LinkWrapper
                title={t('SUPPORT')}
                className='text-brand-b1 text-body-12'
                href='/support'>
                {t('SUPPORT')}
              </LinkWrapper>
              {/* <LinkWrapper */}
              {/*  href='https://old.adverto.sale' */}
              {/*  title='old.adverto.sale' */}
              {/*  className='text-brand-b1 text-body-12'> */}
              {/*  old.adverto.sale */}
              {/* </LinkWrapper> */}
            </div>
            <div className='text-body-12 my-2 s:my-4 text-greyscale-900'>
              © 2022—{new Date().getFullYear()} Vooxee
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
      <div className='flex justify-between mb-5'>
        {title && (
          <div className='text-body-18 text-greyscale-800 font-bold capitalize-first '>
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
