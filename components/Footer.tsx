import {FC} from 'react'
import {useTranslation} from 'next-i18next'
import {observer} from 'mobx-react-lite'
import {
  useCategoriesStore,
  useGeneralStore,
} from '../providers/RootStoreProvider'
import LinkWrapper from './Buttons/LinkWrapper'
import Socials from './Socials'

const Footer: FC = observer(() => {
  const {ids, byId: categoriesById} = useCategoriesStore()
  const {t} = useTranslation()
  const {showFooter} = useGeneralStore()

  return (
    <footer
      className={`mx-auto header-width ${showFooter ? '' : 'hidden m:block'}`}>
      <div className='pt-7 space-y-6 s:border-t border-greyscale-200'>
        <div className='space-y-6 px-4 s:px-0 s:grid s:grid-cols-3 s:space-y-0 s:gap-x-4 s:gap-y-6 m:grid-cols-12 mx-auto'>
          <Section
            title={t('CATEGORIES')}
            className='m:col-span-4 l:col-span-6'
            body={
              <div className='grid s:grid-cols-1 m:grid-cols-2 l:grid-cols-3 gap-y-4 s:gap-y-2'>
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
                <div className='text-body-16 text-greyscale-800 capitalize-first mb-2 l:mb-4'>
                  {t('INSTALL_MOBILE_APP')}
                </div>
                <div className='flex flex-wrap items-center justify-around s:justify-start'>
                  <a
                    href='https://play.google.com/store/apps/details?id=vooxee.com&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1'
                    className='l:mr-2 inline-flex m:-ml-2'
                    style={{width: '135px', height: '55px'}}>
                    <img
                      alt='Get it on Google Play'
                      src='https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png'
                    />
                  </a>
                  <a
                    className='inline-flex'
                    href='https://apps.apple.com/ru/app/vooxee/id6443601677'
                    style={{
                      borderRadius: '13px',
                      width: '130px',
                    }}>
                    <img
                      src='https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us?size=250x83&amp;releaseDate=1513555200&h=328ae9fa89f9b000ff0df1a0bd814025'
                      alt='Download on the App Store'
                      style={{
                        borderRadius: '13px',
                        width: '120px',
                        height: '40px',
                      }}
                    />
                  </a>
                </div>
              </>
            }
          />
          <Section
            title={t('SOCIAL_NETWORK')}
            className='m:col-span-3 l:col-span-2'
            body={<Socials />}
          />
        </div>
        <div className='border-t border-shadow-b pt-2'>
          <div className='flex flex-col m:flex-row justify-between  mx-4 s:mx-auto'>
            <div className='flex flex-col space-y-5 my-8 s:my-0 s:flex-row s:space-y-0 s:flex-wrap text-greyscale-900 text-body-14 font-medium m:font-semibold text-left'>
              <LinkWrapper
                title={t('TERMS_AND_CONDITIONS')}
                className='flex s:mr-10 justify-center items-center whitespace-nowrap'
                href='/p/terms-and-conditions'>
                {t('TERMS_AND_CONDITIONS')}
              </LinkWrapper>
              <LinkWrapper
                title={t('PRIVACY_POLICY')}
                className='flex s:mr-10 justify-center items-center whitespace-nowrap'
                href='/p/privacy-policy'>
                {t('PRIVACY_POLICY')}
              </LinkWrapper>
              {/* <LinkWrapper */}
              {/*  title={t('RULES')} */}
              {/*  className='flex justify-center items-center w-full' */}
              {/*  href='/'> */}
              {/*  /!* href='/p/rooles/general-requirements-for-adverts'> *!/ */}
              {/*  {t('RULES')} */}
              {/* </LinkWrapper> */}
              <LinkWrapper
                className='flex s:mr-10 justify-center items-center whitespace-nowrap'
                title={t('COOKIES_POLICY')}
                href='/p/cookies-policy'>
                {t('COOKIES_POLICY')}
              </LinkWrapper>
              <LinkWrapper
                className='flex m:mr-10 justify-center items-center'
                title={t('SUPPORT')}
                href='/support'>
                {t('SUPPORT')}
              </LinkWrapper>
              <LinkWrapper
                className='flex s:mr-10 justify-center items-center whitespace-nowrap'
                title={t('FOR_BUSINESS')}
                href='/business'>
                {t('FOR_BUSINESS')}
              </LinkWrapper>
            </div>
            <div className='text-body-14 font-normal mb-8 s:my-7 text-greyscale-900 self-start'>
              © {new Date().getFullYear()} VooXee
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
