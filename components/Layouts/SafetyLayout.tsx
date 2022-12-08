import React, {FC, useState} from 'react'
import {useTranslation} from 'next-i18next'
import {observer} from 'mobx-react-lite'
import IcPeople from 'icons/safety-landing/People.svg'
import {ArrowDown} from 'react-iconly'
import IcLanguage from 'icons/safety-landing/Language.svg'
import IcVerified from 'icons/safety-landing/Verified.svg'
import IcImportant from 'icons/safety-landing/Important.svg'
import IcCheck from 'icons/safety-landing/Check.svg'
import IcDeliveryFast from 'icons/safety-landing/DeliveryFast.svg'
import IcHand from 'icons/safety-landing/Hand.svg'
import IcFraud from 'icons/safety-landing/Fraud.svg'
import IcChat from 'icons/safety-landing/Chat.svg'
import IcAttention from 'icons/safety-landing/Attention.svg'
import IcLink from 'icons/safety-landing/Link.svg'
import IcPin from 'icons/safety-landing/Pin.svg'
import IcSms from 'icons/safety-landing/Sms.svg'
import IcYes from 'icons/safety-landing/Yes.svg'
import IcNo from 'icons/safety-landing/No.svg'
import IcFooter from 'icons/safety-landing/Footer.svg'
import {useWindowSize} from 'react-use'
import Logo from '../Logo'
import LanguageSelect from '../LanguageSelect'
import PrimaryButton from '../Buttons/PrimaryButton'
import ImageWrapper from '../ImageWrapper'
import MetaTags from '../MetaTags'
import Button from '../Buttons/Button'
import LinkWrapper from '../Buttons/LinkWrapper'

const tabs = [
  {
    title: 'LENDING_SELLER_CAN_DECEIVE',
    id: 0,
  },
  {
    title: 'LENDING_BUYER_CAN_DECEIVE',
    id: 1,
  },
]

const rules = [
  {
    text: 'LENDING_SECURITY_NEVER_GIVE_YOR_PERSONAL_DATA_TO_ANYONE',
  },
  {
    text: 'LENDING_SECURITY_CHAT',
  },
  {
    text: 'LENDING_SECURITY_PAYMENT_DATA',
  },
  {
    text: 'LENDING_SECURITY_MONEY_TRANSFER',
  },
  {
    text: 'LENDING_SECURITY_RECEIPT_OF_FUNDS_TO_THE_ACCOUNT',
  },
]

const features = [
  {
    title: 'LENDING_SECURITY_DELIVERY',
    text: 'LENDING_SECURITY_DELIVERY_SERVICE',
  },
  {
    title: 'LENDING_SECURITY_PERSONAL_MEETING',
    text: 'LENDING_SECURITY_PROTECTION_OPTION',
  },
  {
    title: 'LENDING_SECURITY_CAREFUL_COMMUNICATION',
    text: 'LENDING_SECURITY_DOUBTS',
  },
]
const SafetyLayout: FC = observer(() => {
  const {t} = useTranslation()
  const [tab, setTab] = useState(0)
  const {width} = useWindowSize()
  const supportButton = (
    <LinkWrapper
      href='/support'
      title='Support'
      className=' self-center w-full'>
      <PrimaryButton className='px-12 py-5 rounded-[120px] w-[328px] s:w-[240px] h-[62px] text-body-18 font-normal'>
        {t('REPORT_FRAUD')}
      </PrimaryButton>
    </LinkWrapper>
  )
  return (
    <div>
      <MetaTags title={t('SECURITY_TITLE')} />
      <div className='flex flex-col mx-4 s:mx-8 m:mx-10 l:mx-28 mt-8 s:[w-704px] m:[w-944px] l:[w-1208px]'>
        <div className='flex justify-between items-center mb-7 s:mb-14 m:mb-12 l:mb-16'>
          <Logo />
          <LanguageSelect />
        </div>

        <div className='flex flex-col s:flex-row mb-6 s:mb-14 items-center s:justify-between'>
          <div className='flex flex-col s:w-[344px] m:w-[460px] l:w-[568px] text-left'>
            <div className='flex'>
              <div className='mr-2 text-primary-500'>
                <ArrowDown set='bold' size={16} />
              </div>
              <span className='text-body-14 font-regular text-greyscale-900 mb-6'>
                {t('LENDING_SECURITY_FOLLOW_OUR_ADVICE')}
              </span>
            </div>
            <h1 className='text-greyscale-900 text-h-4 s:text-h-3 m:text-h-2 l:text-h-1 font-semibold'>
              {t('SECURITY_TITLE')}
            </h1>
            <div className='relative flex s:hidden self-center w-[270px] h-[296px]  mb-6 '>
              <ImageWrapper
                quality={100}
                type='/img/scam2.png'
                alt='scam'
                layout='fill'
                objectFit='contain'
              />
            </div>
            <span
              className='text-body-14  m:text-body-18 text-greyscale-800 py-6 s:py-7 whitespace-pre-wrap '
              dangerouslySetInnerHTML={{
                __html: t('SECURITY_TEXT'),
              }}
            />
            <span className='text-body-14 m:text-body-18 text-greyscale-800'>
              {t('SECURITY_TEXT_BR')}
            </span>
            <div className='self-center s:self-start pt-6 m:pt-8'>
              {supportButton}
            </div>
          </div>
          <div className='hidden s:flex relative w-[222px] h-[243px] s:w-[359px] s:h-[355px] m:w-[405px] m:h-[430px] l:w-[470px] l:h-[460px] shrink-0'>
            <ImageWrapper
              quality={100}
              type='/img/scam.png'
              alt='scam'
              layout='fill'
              objectFit='contain'
            />
          </div>
        </div>
      </div>

      <div className='bg-greyscale-50'>
        <div className='flex flex-col mx-4 s:mx-8 m:mx-10 l:mx-28 s:mt-16'>
          <div className='relative s:hidden mx-auto inset-x-0 -bottom-[25px] w-[160px] h-[169px]'>
            <ImageWrapper
              quality={100}
              type='/img/site-check.png'
              alt='site check'
              layout='fill'
              objectFit='contain'
            />
          </div>
          <div className='flex s:justify-between relative bg-white rounded-3xl drop-shadow-card  w-auto h-auto s:w-[704px] s:h-[187px] m:w-[944px] m:h-[208px] l:w-[1208px] l:h-[208px]'>
            <div className='flex'>
              <div className='hidden s:flex absolute bottom-0 left-0 w-[160px] h-[169px] s:w-[240px] s:h-[240px] m:w-[300px] m:h-[300px]'>
                <ImageWrapper
                  quality={100}
                  type='/img/site-check.png'
                  alt='site check'
                  layout='fill'
                  objectFit='contain'
                />
              </div>
            </div>

            <div>
              <div className='flex flex-col justify-center p-6 w-auto s:w-[440px] m:w-[600px] l:w-[780px] '>
                <h1 className='text-h-4 m:text-h-3 text-greyscale-900 font-semibold'>
                  {t('LENDING_SECURITY_SITE')}
                </h1>
                <span className='text-body-14 m:text-body-16 text-greyscale-800 whitespace-pre-wrap'>
                  {t('LENDING_SECURITY_SITE_DESCRIPTION')}
                </span>
              </div>

              <div
                className='absolute mx-auto inset-x-0  right-0 -bottom-[214px] s:mr-4 s:inset-x-3/4 s:right-0 s:-bottom-[443px] m:-bottom-[490px] l:-bottom-[570px]
              w-[115px] h-[214px] s:w-[224px] s:h-[443px] m:w-[244px] m:h-[490px] l:w-[284px] l:h-[570px]'>
                <ImageWrapper
                  quality={100}
                  type='/img/scammer.png'
                  alt='scammer'
                  layout='fill'
                  objectFit='contain'
                />
              </div>
            </div>
          </div>
        </div>

        <div className='flex flex-col mt-[234px] mx-4 s:mx-8 m:mx-10 l:mx-28 s:mt-16 s:w-[393px] m:w-[544px] l:w-[800px]'>
          <div className='flex flex-col justify-center'>
            <h1 className='text-h-5 s:text-h-4 m:text-h-3 l:text-h-2 text-greyscale-900 font-semibold'>
              {t('LENDING_SECURITY_GENERAL')}
            </h1>
            <h3 className='my-4 m:mt-8 m:mb-4 text-body-16 s:text-body-18 m:text-h-5 l:text-h-3 text-greyscale-900 font-medium'>
              {t('LENDING_SECURITY_PERSONAL_DATE')}
            </h3>
            <span className='text-body-14 mb-4 m:text-body-16 text-greyscale-800 whitespace-pre-wrap'>
              {t('LENDING_SECURITY_SAFETY_POLICY')}
            </span>

            <div className='space-y-4 mb-6 s:mb-10'>
              {rules.map((rule) => (
                <div className='flex'>
                  <IcCheck className='min-w-[24px] h-5 mr-2' />
                  <span className='text-body-14 m:text-body-16 text-greyscale-800 whitespace-pre-wrap'>
                    {t(rule.text)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className='flex justify-center mx-4 my-10 s:mx-8 m:mx-10 l:mx-28 s:mt-16'>
        <div className='flex flex-col drop-shadow-card space-y-6 s:space-y-0 s:grid s:grid-cols-3 s:gap-2 m:gap-6 l:gap-12'>
          {features.map((feature) => (
            <div
              className='flex flex-col min-h-[220px] px-4 py-6 bg-gradient-to-br from-safety-1 to-safety-2 
                  shadow-[inset_0px_-10px_10px_rgba(164,179,255,0.15)] rounded-2xl s:w-[224px] m:w-[304px] l:w-[350px]'>
              <span className='mb-2 text-h-6 font-bold text-greyscale-900 self-start'>
                {t(feature.title)}
              </span>
              <div className='w-[72px] border-b border-greyscale-600 self-start mb-4 mt-1' />
              <span className='text-body-14 font-normal text-grayscale-800'>
                {t(feature.text)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/*      <div className='flex flex-col pt-15 s:pt-18 mx-4 s:mx-15 l:mx-30 xl:mx-80 mb-12 s:mb-15 l:mb-30 xl:mb-[132px] l:items-center'>
        <div className='flex flex-col l:w-[1200px] xl:w-[1280px]'>
          <h1 className='text-body-14 s:text-h-1 font-medium mb-9 text-center'>
            {t('LANDING_GENERAL_SAFETY_RULES')}
          </h1>
          <div className='flex flex-col s:flex-row'>
            <IcLanguage className='w-8 h-8 shrink-0 mb-4 s:mr-5' />
            <div className='flex flex-col'>
              <span className='text-h-4 font-medium mb-2'>
                {t('LANDING_CHECK_SITE')}
              </span>
              <span
                className='text-body-16 mb-6 s:mb-10'
                dangerouslySetInnerHTML={{__html: t('LANDING_CHECK_SITE_TEXT')}}
              />
            </div>
          </div>
          <div className='flex flex-col s:flex-row'>
            <IcVerified className='w-8 h-8 shrink-0 mb-4 s:mr-5' />
            <div className='flex flex-col'>
              <span className='text-h-4 font-medium mb-2'>
                {t('LANDING_KEEP_SECRET_PERSONAL_DATA')}
              </span>
              <span
                className='text-body-16 mb-9'
                dangerouslySetInnerHTML={{
                  __html: t('LANDING_KEEP_SECRET_PERSONAL_DATA_RULES'),
                }}
              />
              <div className='space-y-6 mb-6 s:mb-10'>
                <div className='flex'>
                  <IcImportant className='min-w-[16px] h-4 mr-2' />
                  <span
                    className='text-body-16'
                    dangerouslySetInnerHTML={{
                      __html: t('LANDING_KEEP_SECRET_PERSONAL_DATA_RULES_1'),
                    }}
                  />
                </div>
                <div className='flex'>
                  <IcImportant className='min-w-[16px] h-4 mr-2' />
                  <span className='text-body-16'>
                    {t('LANDING_KEEP_SECRET_PERSONAL_DATA_RULES_1_1')}
                  </span>
                </div>
                <div className='flex'>
                  <IcImportant className='min-w-[16px] h-4 mr-2' />
                  <span className='text-body-16'>
                    {t('LANDING_KEEP_SECRET_PERSONAL_DATA_RULES_1_2')}
                  </span>
                </div>
                <div className='flex'>
                  <IcImportant className='min-w-[16px] h-4 mr-2' />
                  <span className='text-body-16'>
                    {t('LANDING_KEEP_SECRET_PERSONAL_DATA_RULES_2')}
                  </span>
                </div>
                <div className='flex'>
                  <IcImportant className='min-w-[16px] h-4 mr-2' />
                  <span className='text-body-16'>
                    {t('LANDING_KEEP_SECRET_PERSONAL_DATA_RULES_3')}
                  </span>
                </div>
                <div className='flex'>
                  <IcImportant className='min-w-[16px] h-4 mr-2' />
                  <span className='text-body-16'>
                    {t('LANDING_KEEP_SECRET_PERSONAL_DATA_RULES_4')}
                  </span>
                </div>
                <div className='flex'>
                  <IcImportant className='min-w-[16px] h-4 mr-2' />
                  <span className='text-body-16'>
                    {t('LANDING_KEEP_SECRET_PERSONAL_DATA_RULES_5')}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className='flex flex-col s:flex-row'>
            <IcDeliveryFast className='w-8 h-8 shrink-0 mb-4 s:mr-5' />
            <div className='flex flex-col'>
              <span className='text-h-4 font-medium mb-2'>
                {t('LANDING_DELIVERY')}
              </span>
              <span
                className='text-body-16 mb-6 s:mb-10'
                dangerouslySetInnerHTML={{__html: t('LANDING_DELIVERY_TEXT')}}
              />
            </div>
          </div>
          <div className='flex flex-col s:flex-row'>
            <IcHand className='w-8 h-8 shrink-0 mb-4 s:mr-5' />
            <div className='flex flex-col'>
              <span className='text-h-4 font-medium mb-2'>
                {t('LANDING_MEET_PERSONALLY')}
              </span>
              <span
                className='text-body-16 mb-6 s:mb-10'
                dangerouslySetInnerHTML={{
                  __html: t('LANDING_MEET_PERSONALLY_TEXT'),
                }}
              />
            </div>
          </div>
          <div className='flex flex-col s:flex-row'>
            <IcFraud className='w-8 h-8 shrink-0 mb-4 s:mr-5' />
            <div className='flex flex-col'>
              <span className='text-h-4 font-medium mb-2'>
                {t('LANDING_AVOID_STRANGERS')}
              </span>
              <span
                className='text-body-16'
                dangerouslySetInnerHTML={{
                  __html: t('LANDING_AVOID_STRANGERS_TEXT'),
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className='flex flex-col bg-[#FFF6EE] pt-12 pb-15 s:pb-18'>
        <div className='mx-4 s:mx-15 l:mx-30 xl:mx-80 flex flex-col items-center'>
          <div className='flex flex-col items-center l:w-[1200px] xl:w-[1280px]'>
            <h1 className='text-body-14 s:text-h-1 font-medium text-center mb-15 s:mb-18'>
              {t('LANDSCAPE_DO NOT_DECEIVE_YOUSELF')}
            </h1>
            <div className='flex flex-col m:flex-row m:space-x-7 s:w-80 m:w-auto'>
              <div className='flex flex-col items-center w-full m:items-start'>
                <IcLink className='w-25 h-25 mb-6 m:mb-10' />
                <span className='text-body-14 font-medium text-center m:text-left mb-2 m:pb-3'>
                  {t('LANDING_CHECK_LINK')}
                </span>
                <span className='text-body-16 text-center mb-15 s:mb-18 m:text-left'>
                  {t('LANDING_CHECK_LINK_TEXT')}
                </span>
              </div>

              <div className='flex flex-col items-center w-full m:items-start'>
                <IcPin className='w-25 h-25 mb-6 m:mb-10' />
                <span className='text-body-14 font-medium text-center m:text-left mb-2 m:pb-3'>
                  {t('LANDING_DO NOT_ENTER_PIN')}
                </span>
                <span className='text-body-16 text-center mb-15 s:mb-18 m:text-left'>
                  {t('LANDING_DO NOT_ENTER_PIN_TEXT')}
                </span>
              </div>

              <div className='flex flex-col items-center w-full m:items-start'>
                <IcSms className='w-25 h-25 mb-6 m:mb-10' />
                <span className='text-body-14 font-medium text-center m:text-left mb-2 m:pb-3'>
                  {t('LANDING_SMS_WITH_CODE')}
                </span>
                <span className='text-body-16 text-center m:text-left'>
                  {t('LANDING_SMS_WITH_CODE_TEXT')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='flex flex-col py-15 l:pb-[140px] s:py-18 mx-4 s:mx-15 l:mx-30 xl:mx-80 items-center'>
        <div className='flex flex-col items-center l:w-[1200px] xl:w-[1280px]'>
          <h1 className='text-h-4 font-medium mb-2'>
            {t('LANDING_DO_NOT_SEND_NUMBER_AND_MAIL')}
          </h1>
          <span className='text-body-16 mb-15 s:mb-18'>
            {t('LANDING_DO_NOT_SEND_NUMBER_AND_MAIL_TEXT')}
          </span>
          <h1 className='text-h-4 font-medium mb-2'>
            {t('LANDING_MAKE_SURE_YOU_ON_VOOXEE')}
          </h1>
          <span
            className='text-body-16 mb-15 s:mb-18'
            dangerouslySetInnerHTML={{
              __html: t('LANDING_MAKE_SURE_YOU_ON_VOOXEE_TEXT'),
            }}
          />
          <div className='flex flex-col m:flex-row w-full'>
            <div className='nc-gradient-brand w-full rounded-lg py-7 mb-7 m:mb-0 m:mr-5 xl:mr-25 m:px-5 flex flex-col items-center '>
              <IcYes className='w-13 h-13 s:w-25 s:h-25 mb-5' />
              <span className='text-h-6 m:text-h-4 s:text-body-14 l:text-body-14 s:mb-10 text-white mb-3 font-medium m:text-center'>
                {t('LANDING_CORRECT_SITES')}
              </span>
              <span
                className='text-body-14 m:text-body-14 s:text-h-3 text-white l:text-[28px] mb-3 whitespace-pre text-center'
                dangerouslySetInnerHTML={{
                  __html: t('LANDING_CORRECT_SITES_TEXT'),
                }}
              />
            </div>
            <div className='bg-nc-salmon w-full rounded-lg py-7 flex flex-col items-center m:px-5 '>
              <IcNo className='w-13 h-13 s:w-25 s:h-25 mb-5' />
              <span className='text-h-6 m:text-h-4 s:text-body-14 l:text-body-14 mb-3 s:mb-10 font-medium text-center'>
                {t('LANDING_FAKE_SITES')}
              </span>
              <span
                className='text-body-14 m:text-body-14 s:text-h-3 mb-3 l:text-[28px] whitespace-pre  m:text-center'
                dangerouslySetInnerHTML={{
                  __html: t('LANDING_FAKE_SITES_TEXT'),
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className='flex flex-col bg-[#FFF6EE] py-15 s:py-18 items-center'>
        <div className='mx-4 s:mx-15 l:mx-30 xl:mx-80 flex flex-col items-center l:w-[1200px] xl:w-[1280px]'>
          <h1 className='text-body-14 font-medium text-center mb-15 s:mb-18 m:mb-30'>
            {t('LENDING_FRAUDERS_CAN_BE_SELLERS_AND_BUYERS')}
          </h1>
          <div className='hidden m:flex w-full bg-white h-16 mb-20'>
            {tabs.map((currentTab) => (
              <Button
                onClick={() => setTab(currentTab.id)}
                key={currentTab.title}
                className={`w-full rounded-2xl font-normal ${
                  currentTab.id === tab ? 'nc-gradient-brand' : ''
                }`}>
                <span
                  className={`text-h-4 ${
                    currentTab.id === tab ? 'text-white' : 'text-greyscale-900'
                  }`}>
                  {t(currentTab.title)}
                </span>
              </Button>
            ))}
          </div>
          {(width < 1024 || tab === 0) && (
            <>
              <div className='flex flex-col bg-nc-salmon py-4 mb-7 w-screen m:hidden'>
                <span className='text-h-4 s:text-h-3 font-medium text-center'>
                  {t('LENDING_SELLER_CAN_DECEIVE')}
                </span>
              </div>
              <div className='flex flex-col items-center m:flex-row m:flex-wrap m:justify-evenly m:w-full mb-7 s:mb-18 m:mb-25'>
                <div className='w-[328px] h-[481px] s:w-[405px] s:h-[596px] m:w-[309px] m:h-[447px] l:w-[405px] l:h-[596px] xl:w-[433px] xl:h-[635px] relative mb-7'>
                  <ImageWrapper
                    layout='fill'
                    type='/img/safety-landing/seller-fraud-1.png'
                    alt='seller fraud'
                  />
                </div>
                <div className='flex flex-col'>
                  <div className='w-[328px] h-[231px] s:w-[600px] s:h-[423px] m:w-[450px] m:h-[318px] l:w-[600px] l:h-[423px] xl:w-[640px] xl:h-[452px] relative mb-7 s:mb-15'>
                    <ImageWrapper
                      layout='fill'
                      type='/img/safety-landing/seller-fraud-2.png'
                      alt='seller fraud'
                    />
                  </div>
                  <IcChat className='w-25 h-25 self-end hidden m:block' />
                </div>
              </div>
              <div className='flex flex-col'>
                <h1 className='text-body-14 font-medium text-center mb-15 s:mb-18'>
                  {t('LANDING_HOW_TO_RECOGNIZE_FRAUD_SELLER')}
                </h1>
                <div className='flex'>
                  <IcAttention className='w-[95px] h-[136px] hidden m:block mr-16' />
                  <span
                    className='text-body-14 s:text-h-6 whitespace-pre-line text-justify l:w-[882px] mx-4 s:mx-15 '
                    dangerouslySetInnerHTML={{
                      __html: t('LANDING_HOW_TO_RECOGNIZE_FRAUD_SELLER_TEXT'),
                    }}
                  />
                </div>
              </div>
            </>
          )}
          {(width < 1024 || tab === 1) && (
            <>
              <div className='flex flex-col bg-nc-salmon py-4 my-15 s:my-18 s:w-screen m:hidden'>
                <span className='text-h-4 font-medium text-center'>
                  {t('LENDING_BUYER_CAN_DECEIVE')}
                </span>
              </div>
              <div className='flex flex-col  m:flex-row m:flex-wrap m:justify-evenly m:w-full mb-7 s:mb-18 m:mb-25'>
                <div className='flex flex-col'>
                  <div className='w-[328px] h-[481px] s:w-[405px] s:h-[596px] m:w-[353px] m:h-[526px] l:w-[471px] l:h-[703px] xl:w-[503px] xl:h-[750px] relative mb-7'>
                    <ImageWrapper
                      layout='fill'
                      type='/img/safety-landing/seller-fraud-1.png'
                      alt='seller fraud'
                    />
                  </div>
                  <div className='w-[328px] h-[115px] s:w-[470px] s:h-[166px] m:w-[353px] m:h-[124px] l:w-[471px] l:h-[166px] xl:w-[503px] xl:h-[177px] relative mb-7'>
                    <ImageWrapper
                      layout='fill'
                      type='/img/safety-landing/buyer-fraud-2.png'
                      alt='seller fraud'
                    />
                  </div>
                </div>
                <div className='flex flex-col'>
                  <div className='w-[328px] h-[721px] s:w-[379px] s:h-[834px] m:w-[284px] m:h-[625px] l:w-[379px] l:h-[834px] xl:w-[404px] xl:h-[890px] relative mb-7'>
                    <ImageWrapper
                      layout='fill'
                      type='/img/safety-landing/buyer-fraud-1.png'
                      alt='seller fraud'
                    />
                  </div>
                  <IcChat className='w-25 h-25 self-end hidden m:block' />
                </div>
              </div>
              <div className='flex flex-col'>
                <h1 className='text-body-14 font-medium text-center mb-15 s:mb-18'>
                  {t('LANDING_HOW_TO_RECOGNIZE_FRAUD_BUYER')}
                </h1>
                <div className='flex '>
                  <IcAttention className='w-[95px] h-[136px] hidden m:block mr-16' />
                  <span
                    className='text-body-14 s:text-h-6 whitespace-pre-line text-justify l:w-[882px] mx-4 s:mx-15 '
                    dangerouslySetInnerHTML={{
                      __html: t('LANDING_HOW_TO_RECOGNIZE_FRAUD_BUYER_TEXT'),
                    }}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <div className='flex flex-col py-15 s:py-18 mx-4 s:mx-15 l:mx-30 xl:mx-80 s:items-center'>
        <div className='l:w-[1200px] xl:w-[1280px]'>
          <div className='mb-8'>
            <h1 className='text-body-14 font-medium mb-10 text-center'>
              {t('LANDING_MAKE_THE_WORLD_PLEASER')}
            </h1>
            <span className='text-h-4 text-left '>
              {t('LANDING_MAKE_THE_WORLD_PLEASER_TEXT')}
            </span>
          </div>
          <div className='flex flex-col m:w-[856px] l:w-[995px]'>
            <div>
              <div className='flex'>
                <span className='w-4 h-4 rounded-full bg-nc-primary flex-shrink-0 mr-4' />
                <span className='text-body-14 mb-8'>
                  {t('LANDING_MAKE_THE_WORLD_PLEASER_TEXT_1')}
                </span>
              </div>
              <div className='flex'>
                <span className='w-4 h-4 rounded-full bg-nc-primary flex-shrink-0 mr-4' />
                <span
                  className='text-body-14 mb-8'
                  dangerouslySetInnerHTML={{
                    __html: t('LANDING_MAKE_THE_WORLD_PLEASER_TEXT_2'),
                  }}
                />
              </div>
              <div className='flex'>
                <span className='w-4 h-4 rounded-full bg-nc-primary flex-shrink-0 mr-4' />
                <span className='text-body-14 mb-8'>
                  {t('LANDING_MAKE_THE_WORLD_PLEASER_TEXT_3')}
                </span>
              </div>
            </div>
          </div>
          <div className='flex flex-col l:flex-row justify-center relative l:mb-20'>
            <div className='flex justify-center'>
              <div className='flex w-[420px]'>{supportButton}</div>
            </div>
            <IcFooter className='w-[173px] h-[148px] mt-11 self-center hidden m:flex l:absolute -bottom-20 right-30 xl:-bottom-10 xl:right-50' />
          </div>
        </div>
      </div> */}
    </div>
  )
})

export default SafetyLayout
