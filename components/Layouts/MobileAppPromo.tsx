import {FC} from 'react'
import {useTranslation} from 'next-i18next'
import ImageWrapper from '../ImageWrapper'

const MobileAppPromo: FC = () => {
  const {t} = useTranslation()
  return (
    <div className='flex justify-center items-center h-screen'>
      <main className='flex flex-col justify-center items-center'>
        {/* <ImageWrapper */}
        {/*  type='/img/logo/AdvertoLogoSquare.png' */}
        {/*  alt='Logo' */}
        {/*  width={136} */}
        {/*  height={136} */}
        {/*  layout='fixed' */}
        {/* /> */}
        <span className='mt-20 mb-12 text-body-14 text-greyscale-900 font-bold text-center'>
          {t('MOBILE_APP_PROMO')}
        </span>
        <div className='flex items-center justify-center'>
          {/* <a */}
          {/*  href='https://play.google.com/store/apps/details?id=adverto.sale&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1' */}
          {/*  className='' */}
          {/*  style={{width: '135px'}}> */}
          {/*  <img */}
          {/*    alt='Get it on Google Play' */}
          {/*    src='https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png' */}
          {/*  /> */}
          {/* </a> */}
          {/* <a */}
          {/*  className='flex items-center' */}
          {/*  href='https://apps.apple.com/ru/app/adverto/id1287862488?itsct=apps_box_badge&amp;itscg=30200' */}
          {/*  style={{ */}
          {/*    borderRadius: '13px', */}
          {/*    width: '130px', */}
          {/*    height: '52px', */}
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
        </div>
      </main>
    </div>
  )
}

export default MobileAppPromo
