import React, {FC} from 'react'
import {useTranslation} from 'next-i18next'
import {observer} from 'mobx-react-lite'
import IcPeople from 'icons/safety-landing/People.svg'
import IcLanguage from 'icons/safety-landing/Language.svg'
import IcVerified from 'icons/safety-landing/Verified.svg'
import IcImportant from 'icons/safety-landing/Important.svg'
import IcDeliveryFast from 'icons/safety-landing/DeliveryFast.svg'
import IcHand from 'icons/safety-landing/Hand.svg'
import IcFraud from 'icons/safety-landing/Fraud.svg'
import IcLink from 'icons/safety-landing/Link.svg'
import IcPin from 'icons/safety-landing/Pin.svg'
import IcSms from 'icons/safety-landing/Sms.svg'
import IcYes from 'icons/safety-landing/Yes.svg'
import IcNo from 'icons/safety-landing/No.svg'
import IcFooter from 'icons/safety-landing/Footer.svg'
import Logo from '../Logo'
import LanguageSelect from '../LanguageSelect'
import PrimaryButton from '../Buttons/PrimaryButton'
import ImageWrapper from '../ImageWrapper'
import MetaTags from '../MetaTags'

const SafetyLayout: FC = observer(() => {
  const {t} = useTranslation()
  return (
    <div>
      <MetaTags title={t('SECURITY_ON_ADVERTO')} />
      <div className='flex justify-between items-center my-2.5 mx-4 s:mx-15 s:my-7'>
        <Logo />
        <LanguageSelect />
      </div>
      <div className='flex flex-col bg-[#FFF6EE] pt-8 pb-18'>
        <IcPeople className='w-[240px] s:w-[309px] h-[291px] s:h-[375px] mb-15 s:mb-18 self-center' />
        <div className='mx-4 s:mx-15 flex flex-col space-y-4'>
          <h1 className='text-h-1 s:text-headline-2 font-medium'>
            {t('SECURITY_ON_ADVERTO')}
          </h1>
          <span className='text-h-3'>{t('SECURITY_ON_ADVERTO_TEXT')}</span>
          <span className='text-h-3 '>{t('SECURITY_ON_ADVERTO_TEXT_BR')}</span>
        </div>
        {/* <PrimaryButton className='mx-4 mt-15 s:mt-18'> */}
        {/*  {t('REPORT_FRAUD')} */}
        {/* </PrimaryButton> */}
      </div>
      <div className='flex flex-col pt-15 s:pt-18 mx-4 s:mx-15'>
        <h1 className='text-h-1 s:text-headline-2 font-medium mb-9'>
          {t('LANDING_GENERAL_SAFETY_RULES')}
        </h1>
        <IcLanguage className='w-8 h-8 mb-4' />
        <span className='text-headline-5 font-medium mb-2'>
          {t('LANDING_CHECK_SITE')}
        </span>
        <span
          className='text-body-1 mb-15 s:mb-18'
          dangerouslySetInnerHTML={{__html: t('LANDING_CHECK_SITE_TEXT')}}
        />
        <IcVerified className='w-8 h-8 mb-4' />
        <span className='text-headline-5 font-medium mb-2'>
          {t('LANDING_KEEP_SECRET_PERSONAL_DATA')}
        </span>
        <span
          className='text-body-1 mb-15 s:mb-18'
          dangerouslySetInnerHTML={{
            __html: t('LANDING_KEEP_SECRET_PERSONAL_DATA_RULES'),
          }}
        />
        <div className='space-y-6 mb-15 s:mb-18'>
          <div className='flex'>
            <IcImportant className='min-w-[16px] h-4 mr-4' />
            <span className='text-body-1'>
              {t('LANDING_KEEP_SECRET_PERSONAL_DATA_RULES_1')}
            </span>
          </div>
          <div className='flex'>
            <IcImportant className='min-w-[16px] h-4 mr-4' />
            <span className='text-body-1'>
              {t('LANDING_KEEP_SECRET_PERSONAL_DATA_RULES_3')}
            </span>
          </div>
          <div className='flex'>
            <IcImportant className='min-w-[16px] h-4 mr-4' />
            <span className='text-body-1'>
              {t('LANDING_KEEP_SECRET_PERSONAL_DATA_RULES_4')}
            </span>
          </div>
          <div className='flex'>
            <IcImportant className='min-w-[16px] h-4 mr-4' />
            <span className='text-body-1'>
              {t('LANDING_KEEP_SECRET_PERSONAL_DATA_RULES_5')}
            </span>
          </div>
        </div>
        <IcDeliveryFast className='w-8 h-8 mb-4' />
        <span className='text-headline-5 font-medium mb-2'>
          {t('LANDING_DELIVERY')}
        </span>
        <span
          className='text-body-1 mb-15 s:mb-18'
          dangerouslySetInnerHTML={{
            __html: t('LANDING_DELIVERY_TEXT'),
          }}
        />
        <IcHand className='w-8 h-8 mb-4' />
        <span className='text-headline-5 font-medium mb-2'>
          {t('LANDING_MEET_PERSONALLY')}
        </span>
        <span
          className='text-body-1 mb-15 s:mb-18'
          dangerouslySetInnerHTML={{
            __html: t('LANDING_MEET_PERSONALLY_TEXT'),
          }}
        />
        <IcFraud className='w-8 h-8 mb-4' />
        <span className='text-headline-5 font-medium mb-2'>
          {t('LANDING_AVOID_STRANGERS')}
        </span>
        <span
          className='text-body-1 mb-15 s:mb-18'
          dangerouslySetInnerHTML={{
            __html: t('LANDING_AVOID_STRANGERS_TEXT'),
          }}
        />
      </div>
      <div className='flex flex-col bg-[#FFF6EE] pt-12 pb-15 s:pb-18'>
        <div className='mx-4 s:mx-15 flex flex-col items-center'>
          <h1 className='text-h-1 s:text-headline-2 font-medium text-center mb-15 s:mb-18'>
            {t('LANDSCAPE_DO NOT_DECEIVE_YOUSELF')}
          </h1>
          <IcLink className='w-25 h-25 mb-6' />
          <span className='text-h-2 font-medium text-center mb-2'>
            {t('LANDING_CHECK_LINK')}
          </span>
          <span className='text-body-1 text-center mb-15 s:mb-18'>
            {t('LANDING_CHECK_LINK_TEXT')}
          </span>

          <IcPin className='w-25 h-25 mb-6' />
          <span className='text-h-2 font-medium text-center mb-2'>
            {t('LANDING_DO NOT_ENTER_PIN')}
          </span>
          <span className='text-body-1 text-center mb-15 s:mb-18'>
            {t('LANDING_DO NOT_ENTER_PIN_TEXT')}
          </span>

          <IcSms className='w-25 h-25 mb-6' />
          <span className='text-h-2 font-medium text-center mb-2'>
            {t('LANDING_SMS_WITH_CODE')}
          </span>
          <span className='text-body-1 text-center'>
            {t('LANDING_SMS_WITH_CODE_TEXT')}
          </span>
        </div>
      </div>
      <div className='flex flex-col py-15 s:py-18 mx-4 s:mx-15'>
        <h1 className='text-headline-5 font-medium mb-2'>
          {t('LENDING_FRAUDERS_CAN_BE_SELLERS_AND_BUYERS')}
        </h1>
        <span className='text-body-1 mb-15 s:mb-18'>
          {t('LANDING_DELIVERY_TEXT')}
        </span>
        <h1 className='text-headline-5 font-medium mb-2'>
          {t('LANDING_MAKE_SURE_YOU_ON_ADVERTO')}
        </h1>
        <span className='text-body-1 mb-15 s:mb-18'>
          {t('LANDING_MAKE_SURE_YOU_ON_ADVERTO_TEXT')}
        </span>
        <div className='nc-gradient-brand w-full rounded-lg py-7 mb-7 flex flex-col items-center'>
          <IcYes className='w-13 h-13 s:w-25 s:h-25 mb-5' />
          <span className='text-h-3 s:text-h-1 s:mb-10 text-white mb-3 font-medium'>
            {t('LANDING_CORRECT_SITES')}
          </span>
          <span
            className='text-body-2 s:text-headline-6 text-white mb-3 whitespace-pre	leading-7'
            dangerouslySetInnerHTML={{
              __html: t('LANDING_CORRECT_SITES_TEXT'),
            }}
          />
        </div>
        <div className='bg-nc-salmon w-full rounded-lg py-7 flex flex-col items-center'>
          <IcNo className='w-13 h-13 s:w-25 s:h-25 mb-5' />
          <span className='text-h-3 s:text-h-1 mb-3 s:mb-10 font-medium'>
            {t('LANDING_FAKE_SITES')}
          </span>
          <span
            className='text-body-2 s:text-headline-6 mb-3 whitespace-pre leading-7'
            dangerouslySetInnerHTML={{
              __html: t('LANDING_FAKE_SITES_TEXT'),
            }}
          />
        </div>
      </div>
      <div className='flex flex-col bg-[#FFF6EE] py-15 s:py-18'>
        <div className='mx-4 s:mx-15 flex flex-col items-center'>
          <h1 className='text-h-1 font-medium text-center mb-15 s:mb-18'>
            {t('LENDING_FRAUDERS_CAN_BE_SELLERS_AND_BUYERS')}
          </h1>
          <div className='flex flex-col bg-nc-salmon py-4 mb-7 s:w-screen'>
            <span className='text-headline-5 s:text-headline-6 font-medium text-center'>
              {t('LENDING_SELLER_CAN_DECEIVE')}
            </span>
          </div>
          <div className='w-[328px] h-[481px] relative mb-7'>
            <ImageWrapper
              layout='fill'
              type='/img/safety-landing/seller-fraud-1.png'
              alt='seller fraud'
            />
          </div>
          <div className='w-[328px] h-[231px] relative mb-7 s:mb-15'>
            <ImageWrapper
              layout='fill'
              type='/img/safety-landing/seller-fraud-2.png'
              alt='seller fraud'
            />
          </div>
          <h1 className='text-h-1 font-medium text-center mb-15 s:mb-18'>
            {t('LANDING_HOW_TO_RECOGNIZE_FRAUD_SELLER')}
          </h1>
          <span
            className='text-body-2 mb-3 whitespace-pre-line text-justify leading-7'
            dangerouslySetInnerHTML={{
              __html: t('LANDING_HOW_TO_RECOGNIZE_FRAUD_SELLER_TEXT'),
            }}
          />
          <div className='flex flex-col bg-nc-salmon py-4 my-15 s:my-18 s:w-screen'>
            <span className='text-headline-5 font-medium text-center'>
              {t('LENDING_BUYER_CAN_DECEIVE')}
            </span>
          </div>
          <div className='w-[328px] h-[481px] relative mb-7'>
            <ImageWrapper
              layout='fill'
              type='/img/safety-landing/seller-fraud-1.png'
              alt='seller fraud'
            />
          </div>
          <div className='w-[328px] h-[721px] relative mb-7'>
            <ImageWrapper
              layout='fill'
              type='/img/safety-landing/buyer-fraud-1.png'
              alt='seller fraud'
            />
          </div>
          <div className='w-[328px] h-[115px] relative'>
            <ImageWrapper
              layout='fill'
              type='/img/safety-landing/buyer-fraud-2.png'
              alt='seller fraud'
            />
          </div>
          <h1 className='text-h-1 font-medium text-center my-15 s:my-18'>
            {t('LANDING_HOW_TO_RECOGNIZE_FRAUD_BUYER')}
          </h1>
          <span
            className='text-body-2 whitespace-pre-line text-justify leading-7'
            dangerouslySetInnerHTML={{
              __html: t('LANDING_HOW_TO_RECOGNIZE_FRAUD_BUYER_TEXT'),
            }}
          />
        </div>
      </div>
      <div className='flex flex-col py-15 s:py-18 mx-4 s:mx-15'>
        <h1 className='text-h-1 font-medium mb-10'>
          {t('LANDING_MAKE_THE_WORLD_PLEASER')}
        </h1>
        <div className='flex'>
          <span className='w-4 h-4 rounded-full bg-nc-primary flex-shrink-0 mr-4' />
          <span className='text-body-1 mb-8'>
            {t('LANDING_MAKE_THE_WORLD_PLEASER_TEXT_1')}
          </span>
        </div>
        <div className='flex'>
          <span className='w-4 h-4 rounded-full bg-nc-primary flex-shrink-0 mr-4' />
          <span className='text-body-1 mb-8'>
            {t('LANDING_MAKE_THE_WORLD_PLEASER_TEXT_2')}
          </span>
        </div>
        <div className='flex'>
          <span className='w-4 h-4 rounded-full bg-nc-primary flex-shrink-0 mr-4' />
          <span className='text-body-1 mb-8'>
            {t('LANDING_MAKE_THE_WORLD_PLEASER_TEXT_3')}
          </span>
        </div>
        {/* <PrimaryButton>{t('REPORT_FRAUD')}</PrimaryButton> */}
        <IcFooter className='w-[173px] h-[148px] mt-11 self-center' />
      </div>
    </div>
  )
})

export default SafetyLayout
