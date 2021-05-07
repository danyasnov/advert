import {FC} from 'react'
import {useTranslation} from 'next-i18next'
import Icon from './Icon'
import LinkButton from './LinkButton'
import {notImplementedAlert} from '../helpers/alert'

const social: Array<string> = ['FB', 'Instagram', 'VK', 'YouTube', 'Twitter']
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
const categories = [
  'транспортные средства',
  'недвижимость',
  'личные вещи',
  'для дома и сада',
  'электроника',
  'красота и здоровье',
  'услуги',
  'хобби и отдых',
  'животные',
]
const Footer: FC = () => {
  const {t} = useTranslation()

  return (
    <>
      <div className='hidden s:flex s:flex-col items-center'>
        <div className='flex justify-center space-x-4 mb-2'>
          {mainCountries.map((i) => (
            <LinkButton key={i} onClick={notImplementedAlert} label={i} />
          ))}
          <LinkButton
            onClick={notImplementedAlert}
            label={t('ALL_COUNTRIES')}
            className='font-bold'
          />
        </div>
        <div className='flex justify-center space-x-4 border-shadow-b border-t py-2 w-min'>
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
        <div className='space-y-6 px-4 s:px-8 s:grid s:grid-cols-3 s:space-y-0 s:gap-x-4 s:gap-y-6'>
          <Section
            title={t('MOBILE_APP')}
            className='s:col-span-2'
            body={
              <>
                <div className='text-body-3 text-black-b capitalize-first mb-2'>
                  {t('INSTALL_MOBILE_APP')}
                </div>
                <Icon type='icGooglePlay' width={135} height={40} />
              </>
            }
          />
          <Section
            title={t('SOCIAL_NETWORK')}
            body={
              <div className='flex space-x-2'>
                {social.map((id) => (
                  <Icon type={`ic${id}`} key={id} width={24} height={24} />
                ))}
              </div>
            }
          />
          <Section
            title={t('CATEGORIES')}
            className='s:col-span-2'
            headerLink={
              <LinkButton onClick={notImplementedAlert} label={t('ALL')} />
            }
            body={
              <div className='grid grid-cols-2 grid-rows-5 grid-flow-col place-items-start gap-y-2'>
                {categories.map((i) => (
                  <LinkButton key={i} onClick={notImplementedAlert} label={i} />
                ))}
              </div>
            }
          />
          <div className='flex flex-col items-start space-y-2 s:pt-33px s:justify-end'>
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
        <div className='flex flex-col items-center border-t border-shadow-b pt-2 m:flex-row m:justify-between'>
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
          <div className='text-body-3 mt-2 s:mt-4 m:mt-0'>
            © 2017—{new Date().getFullYear()} A&D Adverto Services LTD
          </div>
        </div>
      </div>
    </>
  )
}

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
