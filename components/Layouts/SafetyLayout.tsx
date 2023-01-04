import React, {FC, useState} from 'react'
import {useTranslation} from 'next-i18next'
import {observer} from 'mobx-react-lite'
import {ArrowDown} from 'react-iconly'
import IcCheck from 'icons/safety-landing/Check.svg'
import Logo from '../Logo'
import LanguageSelect from '../LanguageSelect'
import PrimaryButton from '../Buttons/PrimaryButton'
import ImageWrapper from '../ImageWrapper'
import MetaTags from '../MetaTags'
import Button from '../Buttons/Button'
import LinkWrapper from '../Buttons/LinkWrapper'

const tabs = [
  {
    title: 'LENDING_SECURITY_SELLER_CHEAT',
    id: 0,
  },
  {
    title: 'LENDING_SECURITY_BUYER_CHEAT',
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

const tricks = [
  {
    title: 'LENDING_SECURITY_PIN_CODE',
    text: 'LENDING_SECURITY_UNWANTED_LINKS',
  },
  {
    title: 'LENDING_SECURITY_REFERRAL_LINKS',
    text: 'LENDING_SECURITY_BE_ATTENTIVE',
  },
  {
    title: 'LENDING_SECURITY_CODE_IN_SMS',
    text: 'LENDING_SECURITY_DO_NOT_GIVE_CODE',
  },
  {
    title: 'LENDING_SECURITY_DATA_COMMUNICATIONS',
    text: 'LENDING_SECURITY_FRAUDERS',
  },
]

const seller = [
  {
    text: 'LENDING_SECURITY_AVOIDS_PERSONAL_MEETINGS',
  },
  {
    text: 'LENDING_SECURITY_TRIES_TO_FIND',
  },
  {
    text: 'LENDING_SECURITY_DISGUISES_HIS_COMMUNICATION',
  },
  {
    text: 'LENDING_SECURITY_PUSHES_YOU',
  },
]

const buyer = [
  {
    text: 'LENDING_SECURITY_AVOIDS_PERSONAL_MEETINGS',
  },
  {
    text: 'LENDING_SECURITY_TRIES_TO_FIND_OUT_YOUR_FULL_PERSONAL_DATA',
  },
]

const helpers = [
  {
    title: 'LENDING_SECURITY_CONTACT',
    description: 'LENDING_SECURITY_CONTACT_DESCRIPTION',
    img: '/img/safety-landing/help-contact.png',
  },
  {
    title: 'LENDING_SECURITY_SAVE_HISTORY',
    description: 'LENDING_SECURITY_SAVE_HISTORY_DESCRIPTION',
    img: '/img/safety-landing/help-history.png',
  },
  {
    title: 'LENDING_SECURITY_ SUBMIT',
    description: 'LENDING_SECURITY_ SUBMIT_DESCRIPTION',
    img: '/img/safety-landing/help-submit.png',
  },
]

const SafetyLayout: FC = observer(() => {
  const {t} = useTranslation()
  const [tab, setTab] = useState(0)
  const supportButton = (
    <LinkWrapper
      href='/support'
      title='Support'
      className=' self-center w-full'>
      <PrimaryButton className='px-12 py-5 shadow-[4px_8px_24px_rgba(114,16,255,0.25)] rounded-[120px] w-[328px] s:w-[240px] h-[62px] text-body-18 font-normal'>
        {t('LENDING_SECURITY_SEND')}
      </PrimaryButton>
    </LinkWrapper>
  )
  return (
    <>
      <MetaTags title={t('SECURITY_TITLE')} />
      <div className='flex flex-col mx-4 s:mx-auto mt-8 s:w-[704px] m:w-[944px] l:w-[1208px]'>
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
            <div className='relative'>
              <div className='relative flex mx-auto s:hidden self-center w-[270px] h-[296px] mb-6'>
                <ImageWrapper
                  quality={100}
                  type='/img/scam2.png'
                  alt='scam'
                  layout='fill'
                  objectFit='contain'
                />
              </div>

              <div className='absolute s:hidden py-1 px-2 bottom-[135px] right-0 bg-white rounded-lg shadow-[4px_8px_24px_rgba(114,16,255,0.25)] w-[109px] h-[32px]'>
                <div className='flex justify-between items-center'>
                  <div className='relative w-[24px] h-[24px]'>
                    <ImageWrapper
                      quality={100}
                      type='/img/bell.png'
                      alt='bell'
                      layout='fill'
                      objectFit='contain'
                    />
                  </div>
                  <span className='text-body-12 text-greyscale-900 font-bold'>
                    {t('LENDING_SECURITY_ATTENTION')}
                  </span>
                </div>
              </div>
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
          <div className='relative'>
            <div className='hidden s:flex relative w-[222px] h-[243px] s:w-[359px] s:h-[355px] m:w-[405px] m:h-[430px] l:w-[470px] l:h-[460px] shrink-0'>
              <ImageWrapper
                quality={100}
                type='/img/scam.png'
                alt='scam'
                layout='fill'
                objectFit='contain'
              />
            </div>
            <div className='absolute hidden s:flex s:py-1 s:px-4 s:w-[135px] s:h-[32px] m:w-[152px] s:h-[40px] l:w-[169px] l:h-[56px] s:bottom-[121px] m:bottom-[160px] l:bottom-[155px] right-0 bg-white s:rounded-lg m:rounded-2xl shadow-[4px_8px_24px_rgba(114,16,255,0.25)]'>
              <div className='flex justify-between items-center'>
                <div className='relative s:w-[24px] s:h-[24px] m:w-[32px] m:h-[32px] l:w-[40px] l:h-[40px]'>
                  <ImageWrapper
                    quality={100}
                    type='/img/bell.png'
                    alt='bell'
                    layout='fill'
                    objectFit='contain'
                  />
                </div>
                <span className='s:text-body-14 m:text-body-16 l:text-h-6 text-greyscale-900 font-bold'>
                  {t('LENDING_SECURITY_ATTENTION')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='bg-gradient-to-b from-[#ffffff_20%] to-[#FAFAFA_20%] s:from-[#ffffff_10%] s:to-[#FAFAFA_10%] pb-4 m:pb-10'>
        <div className='flex flex-col items-center mx-4 s:mx-auto s:mt-16'>
          <div className='relative s:hidden mx-auto inset-x-0 -bottom-[25px] w-[160px] h-[169px]'>
            <ImageWrapper
              quality={100}
              type='/img/site-check.png'
              alt='site check'
              layout='fill'
              objectFit='contain'
            />
          </div>
          <div className='flex s:justify-between relative s:pr-6 m:pr-10 l:pr-20 l:pt-2 bg-white rounded-3xl shadow-[0px_4px_60px_rgba(4,6,15,0.08)] w-auto h-auto s:w-[704px] s:h-[187px] m:w-[944px] m:h-[208px] l:w-[1208px] l:h-[208px]'>
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
              <div className='flex flex-col justify-center p-6 w-auto s:w-[440px] m:w-[600px] l:w-[800px] '>
                <h1 className='text-h-4 m:text-h-3 text-greyscale-900 font-semibold'>
                  {t('LENDING_SECURITY_SITE')}
                </h1>
                <span className='text-body-14 m:text-body-16 text-greyscale-800 whitespace-pre-wrap'>
                  {t('LENDING_SECURITY_SITE_DESCRIPTION')}
                </span>
              </div>

              <div
                className='absolute mx-auto inset-x-0 right-0 -bottom-[214px] s:mr-4 s:inset-x-3/4 s:right-0 s:-bottom-[443px] m:-bottom-[490px] l:-bottom-[570px]
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

        <div className='flex flex-col items-center mt-[234px] mx-4 s:mx-auto s:mt-16 s:w-[704px] m:w-[944px] l:w-[1208px] '>
          <div className='flex flex-col self-left justify-center s:w-[393px] m:w-[544px] l:w-[800px] self-start'>
            <h1 className='text-h-5 s:text-h-4 m:text-h-3 l:text-h-2 text-greyscale-900 font-semibold'>
              {t('LENDING_SECURITY_GENERAL')}
            </h1>
            <h3 className='my-4 m:mt-8 m:mb-4 text-body-16 s:text-body-18 m:text-h-5 l:text-h-3 text-greyscale-900 font-medium'>
              {t('LENDING_SECURITY_PERSONAL_DATE')}
            </h3>
            <span className='text-body-14 mb-4 m:text-body-16 text-greyscale-800 whitespace-pre-wrap '>
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

      <div className='flex justify-center mx-4 my-10 s:my-16 m:my-20 l:my-26 s:mx-auto s:w-[704px] m:w-[944px] l:w-[1208px]'>
        <div className='flex flex-col drop-shadow-card space-y-6 s:space-y-0 s:grid s:grid-cols-3 s:gap-2 m:gap-6 l:gap-20'>
          {features.map((feature) => (
            <div
              className='flex flex-col min-h-[220px] px-4 py-6 bg-gradient-to-r from-[#A4B3FF1A] to-[#FFABBC1A] 
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

      <div className='bg-greyscale-50 pb-8'>
        <div className='flex flex-col items-center mx-4 s:mx-auto s:mt-16 s:w-[514px] m:w-[667px] l:w-[667px]'>
          <h1 className='text-h-4 m:text-h-2 l:text-h-1 text-center mt-8 s:mt-12 l:mt-15 text-greyscale-900 font-semibold'>
            {t('LENDING_SECURITY_TRICK')}
          </h1>
          <span className='text-body-16 mt-6 text-center text-greyscale-800 whitespace-pre-wrap '>
            {t('LENDING_SECURITY_BE_ATTENTIVE')}
          </span>
        </div>
        <div className='flex flex-col mx-0 bg-none s:bg-[url("/img/landing/hands.png")] bg-no-repeat bg-left'>
          <div className='relative w-[340px] h-[230px] s:hidden mt-8'>
            <ImageWrapper
              quality={100}
              type='/img/landing/hands.png'
              alt='hands'
              layout='fill'
              objectFit='contain'
            />
          </div>
          <div className='flex flex-col items-center mx-4 mt-8 s:mx-auto s:w-[514px] m:w-[667px] l:w-[667px]'>
            {tricks.map((trick) => (
              <div
                className='flex flex-col mb-4 m:mb-6 px-4 py-6 bg-gradient-to-br from-[#ffffffcc_0%] to-[#ffffffcc_100%)] 
                  shadow-[inset_0px_-10px_10px_rgba(164,179,255,0.15)] backdrop-blur-[10px] rounded-2xl w-full'>
                <span className='mb-2 text-h-6 font-bold text-greyscale-900 self-start'>
                  {t(trick.title)}
                </span>
                <span className='text-body-14 s:text-body-16 font-normal text-grayscale-800'>
                  {t(trick.text)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className='flex flex-col'>
        <div className='flex flex-col mx-4 s:mx-auto s:w-[514px] m:w-[667px] l:w-[667px]'>
          <h1 className='text-h-4 m:text-h-2 l:text-h-1 text-center mt-8 s:mt-12 l:mt-15 text-greyscale-900 font-semibold'>
            {t('LENDING_SECURITY_STAY_ON_VOOXEE')}
          </h1>
          <span className='text-body-16 mt-6 text-center text-greyscale-800 whitespace-pre-wrap '>
            {t('LENDING_SECURITY_STAY_ON_VOOXEE_DESCRIPTION')}
          </span>
        </div>

        <div className='flex flex-col s:flex-row s:justify-between s:items-center mx-4 s:mx-auto s:w-[704px] m:w-[944px] l:w-[1208px]'>
          <div
            className='flex flex-col mt-10 px-4 py-8 bg-gradient-to-r from-[#A4B3FF1A] to-[#FFABBC1A]
                  shadow-[inset_0px_-10px_10px_rgba(164,179,255,0.15)] rounded-2xl w-full h-[314px] s:w-[344px] s:h-[306px] m:w-[464px] m:h-[400px] l:w-[580px] l:h-[448px]'>
            <div className='relative mx-auto w-[78px] h-[80px] m:w-[108px] m:h-[110px]'>
              <ImageWrapper
                quality={100}
                type='/img/good-site.png'
                alt='good site'
                layout='fill'
                objectFit='contain'
              />
            </div>
            <span className='mt-4 mb-2 text-h-6 font-bold text-greyscale-900 self-center'>
              {t('LENDING_SECURITY_GOOD_SITES')}
            </span>
            <span
              className='mt-2 text-body-16 m:text-h-6 l:text-h-4 text-center leading-3 font-bold text-grayscale-900 whitespace-pre'
              dangerouslySetInnerHTML={{
                __html: t('LENDING_SECURITY_GOOD_SITES_DESCRIPTION'),
              }}
            />
          </div>
          <div
            className='flex flex-col mt-6 s:mt-10 px-4 py-8 bg-gradient-to-r from-[#A4B3FF1A] to-[#FFABBC1A] 
                  shadow-[inset_0px_-10px_10px_rgba(164,179,255,0.15)] rounded-2xl  w-full h-[314px] s:w-[344px] s:h-[306px] m:w-[464px] m:h-[400px] l:w-[580px] l:h-[448px]'>
            <div className='relative mx-auto w-[78px] h-[80px] m:w-[108px] m:h-[110px]'>
              <ImageWrapper
                quality={100}
                type='/img/fake-site.png'
                alt='fake site'
                layout='fill'
                objectFit='contain'
              />
            </div>
            <span className='mt-4 mb-2 text-h-6 font-bold text-greyscale-900 self-center'>
              {t('LENDING_SECURITY_FAKE_SITES')}
            </span>
            <span
              className='mt-2 text-body-16 m:text-h-6 l:text-h-4 text-center leading-3 font-bold text-[#FF7386] whitespace-pre'
              dangerouslySetInnerHTML={{
                __html: t('LENDING_SECURITY_FAKE_SITES_DESCRIPTION'),
              }}
            />
          </div>
        </div>
      </div>

      <div className='flex flex-col items-center mx-4 mt-10 mb-16 s:mx-auto s:mt-16'>
        <div className='s:flex hidden m:px-16 p-6 space-x-10 s:justify-between relative bg-white rounded-3xl shadow-[0px_4px_60px_rgba(4,6,15,0.08)]  w-auto h-auto s:w-[704px] m:w-[944px] l:w-[1208px]'>
          <div className='flex'>
            <div className='flex relative self-center s:w-[137px] s:h-[228px] m:w-[163px] m:h-[272px]'>
              <ImageWrapper
                quality={100}
                type='/img/guard.png'
                alt='guard'
                layout='fill'
                objectFit='contain'
              />
            </div>
          </div>

          <div className='flex flex-col justify-center space-y-4 w-auto '>
            <h1 className='s:text-h-6 m:text-h-5 text-greyscale-900 font-semibold'>
              {t('LENDING_SECURITY_DO_NOT_GIVE_YOUR_DATA')}
            </h1>
            <span className='text-body-14 m:text-body-16 text-greyscale-800 whitespace-pre-wrap'>
              {t('LENDING_SECURITY_DO_NOT_GIVE_YOUR_DATA_DESCRIPTION')}
            </span>
            <h1 className='s:text-h-6 m:text-h-5 text-greyscale-900 font-semibold'>
              {t('LENDING_SECURITY_MAKE_SURE')}
            </h1>
            <span className='text-body-14 m:text-body-16 text-greyscale-800 whitespace-pre-wrap'>
              {t('LENDING_SECURITY_MAKE_SURE_DESCRIPTION')}
            </span>
          </div>
        </div>
        <div className='s:hidden flex relative self-center w-[137px] h-[228px]'>
          <ImageWrapper
            quality={100}
            type='/img/guard.png'
            alt='guard'
            layout='fill'
            objectFit='contain'
          />
        </div>
        <div className='s:hidden mt-8 flex flex-col justify-center space-y-4 w-auto'>
          <h1 className='text-h-6 text-greyscale-900 font-semibold'>
            {t('LENDING_SECURITY_DO_NOT_GIVE_YOUR_DATA')}
          </h1>
          <span className='text-body-14 m:text-body-16 text-greyscale-800 whitespace-pre-wrap'>
            {t('LENDING_SECURITY_DO_NOT_GIVE_YOUR_DATA_DESCRIPTION')}
          </span>
          <h1 className='text-h-6 text-greyscale-900 font-semibold'>
            {t('LENDING_SECURITY_MAKE_SURE')}
          </h1>
          <span className='text-body-14 m:text-body-16 text-greyscale-800 whitespace-pre-wrap'>
            {t('LENDING_SECURITY_MAKE_SURE_DESCRIPTION')}
          </span>
        </div>
      </div>

      <div className='flex flex-col mx-4 s:mx-auto s:mt-20 items-center mx-4 s:mx-auto mt-8 '>
        <h1 className='mb-6 m:mb-[72px] text-h-4 m:text-h-2 l:text-h-1 text-center text-greyscale-900 font-semibold s:w-[704px] m:w-[944px] l:w-[1208px]'>
          {t('LENDING_SECURITY_FRAUDSTERS_CAN_BE')}
        </h1>
        <div className='shadow-[0px_4px_60px_rgba(4,6,15,0.08)] rounded-2xl flex w-full s:w-[570px] m:w-[784px] l:w-[1004px] bg-white h-[50px] m:h-16 mb-6 s:mb-16'>
          {tabs.map((currentTab) => (
            <Button
              onClick={() => setTab(currentTab.id)}
              key={currentTab.title}
              className={`w-full rounded-2xl font-normal ${
                currentTab.id === tab
                  ? 'bg-gradient-to-l from-[#7210FF] to-[#9D59FF]'
                  : ''
              }`}>
              <span
                className={`text-body-12 s:text-body-16 m:text-h-4 font-bold ${
                  currentTab.id === tab ? 'text-white' : 'text-greyscale-900 '
                }`}>
                {t(currentTab.title)}
              </span>
            </Button>
          ))}
        </div>

        {tab === 0 && (
          <>
            <div className='flex flex-col items-center s:items-start s:flex-row s:flex-wrap s:justify-between s:w-[704px] m:w-[944px] l:w-[1208px]'>
              <div className='flex flex-col'>
                <span className='text-h-6 text-center s:self-start s:text-left py-4 font-bold'>
                  {t('LENDING_SECURITY_FAKE')}
                </span>

                <div className='rounded-2xl self-center s:self-start w-[223px] h-[315px] l:w-[296px] l:h-[417px] relative mb-7'>
                  <ImageWrapper
                    layout='fill'
                    type='/img/safety-landing/seller-fraud1.png'
                    alt='seller fraud'
                  />
                </div>
              </div>
              <div className='flex flex-col'>
                <span className='text-h-6 text-center py-4 s:text-left font-bold'>
                  {t('LENDING_SECURITY_EXAMPLE_CHAT')}
                </span>
                <div className='self-center s:hidden s:self-start w-[327px] h-[424px] relative mb-7'>
                  <ImageWrapper
                    layout='fill'
                    type='/img/safety-landing/seller-fraud2.png'
                    alt='seller fraud'
                  />
                </div>
                <div className='hidden s:flex m:hidden relative self-center s:self-start w-[464px] h-[364px] mb-7'>
                  <ImageWrapper
                    layout='fill'
                    type='/img/safety-landing/seller-fraud3.png'
                    alt='seller fraud'
                  />
                </div>
                <div className='hidden m:flex l:hidden relative self-center s:self-start w-[704px] h-[364px] mb-7'>
                  <ImageWrapper
                    layout='fill'
                    type='/img/safety-landing/seller-fraud4.png'
                    alt='seller fraud'
                  />
                </div>
                <div className='hidden l:flex relative self-center s:self-start w-[839px] h-[417px] mb-7'>
                  <ImageWrapper
                    layout='fill'
                    type='/img/safety-landing/seller-fraud5.png'
                    alt='seller fraud'
                  />
                </div>
              </div>
            </div>
            <div className='flex flex-col'>
              <h1 className='text-h-6 text-center s:self-start s:text-left py-4 font-bold'>
                {t('LANDING_HOW_TO_RECOGNIZE_FRAUD_SELLER')}
              </h1>
              <div className='flex flex-col space-y-4 s:space-y-0 s:grid s:grid-cols-2 s:gap-6 '>
                {seller.map((fraud) => (
                  <div className='flex flex-col px-8 py-6 bg-white shadow-[inset_0px_-10px_10px_rgba(164,179,255,0.15)] items-center rounded-2xl s:w-[344px] m:w-[464px] l:w-[580px]'>
                    <span className='text-body-14 font-normal text-grayscale-900 self-start'>
                      {t(fraud.text)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {tab === 1 && (
          <>
            <div className='flex flex-col items-center s:items-start s:flex-row s:flex-wrap s:justify-between s:w-[704px] m:w-[944px] l:w-[1208px]'>
              <div className='flex flex-col'>
                <span className='text-h-6 text-center s:self-start s:text-left py-4 font-bold'>
                  {t('LENDING_SECURITY_FAKE')}
                </span>

                <div className='rounded-2xl self-center s:self-start w-[223px] h-[315px] l:w-[296px] l:h-[417px] relative mb-4'>
                  <ImageWrapper
                    layout='fill'
                    type='/img/safety-landing/seller-fraud1.png'
                    alt='buyer fraud'
                  />
                </div>
                <div className='flex flex-col'>
                  <div className='self-center s:self-start w-[223px] h-[58px] l:w-[296px] l:h-[77px] relative mb-7'>
                    <ImageWrapper
                      layout='fill'
                      type='/img/safety-landing/buyer-fraud1.png'
                      alt='buyer fraud'
                    />
                  </div>
                </div>
              </div>
              <div className='flex flex-col'>
                <span className='text-h-6 text-center py-4 s:text-left font-bold'>
                  {t('LENDING_SECURITY_EXAMPLE_CHAT')}
                </span>
                <div className='self-center s:hidden s:self-start w-[327px] h-[856px] relative mb-7'>
                  <ImageWrapper
                    layout='fill'
                    type='/img/safety-landing/buyer-fraud2.png'
                    alt='buyer fraud'
                  />
                </div>
                <div className='hidden s:flex m:hidden relative self-center s:self-start w-[464px] h-[756px] mb-7'>
                  <ImageWrapper
                    layout='fill'
                    type='/img/safety-landing/buyer-fraud3.png'
                    alt='buyer fraud'
                  />
                </div>
                <div className='hidden m:flex l:hidden relative self-center s:self-start w-[704px] h-[756px] mb-7'>
                  <ImageWrapper
                    layout='fill'
                    type='/img/safety-landing/buyer-fraud4.png'
                    alt='buyer fraud'
                  />
                </div>
                <div className='hidden l:flex relative self-center s:self-start w-[839px] h-[756px] mb-7'>
                  <ImageWrapper
                    layout='fill'
                    type='/img/safety-landing/buyer-fraud5.png'
                    alt='buyer fraud'
                  />
                </div>
              </div>
            </div>
            <div className='flex flex-col'>
              <h1 className='text-h-6 text-center s:self-start s:text-left py-4 font-bold'>
                {t('LENDING_SECURITY_HOW_TO_RECOGNIZ_BUYER')}
              </h1>
              <div className='flex flex-col space-y-4 s:space-y-0 s:grid s:grid-cols-2 s:gap-6 '>
                {buyer.map((fraud) => (
                  <div className='flex flex-col px-8 py-6 bg-white shadow-[inset_0px_-10px_10px_rgba(164,179,255,0.15)] items-center rounded-2xl s:w-[344px] m:w-[464px] l:w-[580px]'>
                    <span className='text-body-14 font-normal text-grayscale-900 self-start'>
                      {t(fraud.text)}
                    </span>
                  </div>
                ))}
              </div>
              <div className='flex flex-col mt-4 px-8 py-6 bg-white self-center shadow-[inset_0px_-10px_10px_rgba(164,179,255,0.15)] items-center rounded-2xl s:w-[344px] m:w-[464px] l:w-[580px]'>
                <span className='text-body-14 font-normal text-grayscale-900 '>
                  {t('LENDING_SECURITY_SENDS_FAKE_LINKS')}
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      <div className='flex flex-col items-center mx-4 mt-20 s:mt-32 m:mt-36 mb-16 s:mx-auto s:mt-16'>
        <div className='flex m:px-16 px-4 py-6 s:px-6 m:py-10 space-x-10 justify-between relative bg-white rounded-3xl shadow-[0px_4px_60px_rgba(4,6,15,0.08)] w-full h-auto s:w-[704px] m:w-[944px] l:w-[1208px]'>
          <div className='flex flex-col'>
            <div
              className='absolute mx-auto inset-x-0 -top-[40px] inset-x-3/4 s:-top-[75px] m:-top-[100px] l:-top-[125px]
              w-[85px] h-[85px] s:w-[150px] s:h-[150px] m:w-[200px] m:h-[200px] l:w-[250px] l:h-[250px]'>
              <ImageWrapper
                quality={100}
                type='/img/bell.png'
                alt='bell'
                layout='fill'
                objectFit='contain'
              />
            </div>

            <h1 className='text-h-6 s:text-h-4 m:text-h-3 l:text-h-2 text-greyscale-900 font-bold mb-4 w-[200px] s:w-[456px] m:w-[560px] l:w-[750px]'>
              {t('LENDING_SECURITY_HELP_PUNISH_SCAMMERS')}
            </h1>
            <span
              className='text-body-14 s:text-body-16 l:text-body-18 font-normal text-grayscale-900  s:w-[456px] m:w-[560px] l:w-[750px]'
              dangerouslySetInnerHTML={{
                __html: t('LENDING_SECURITY_HELP_PUNISH_SCAMMERS_DESCRIPTION'),
              }}
            />

            <div className='flex flex-col mt-8 items-center s:items-start space-y-4 s:space-y-0 s:flex-row s:space-x-10 m:space-x-6 l:space-x-16'>
              {helpers.map((help) => (
                <div className='flex flex-col px-4 pb-4 pt-2 items-center rounded-2xl w-[240px] s:w-[192px] m:w-[256px] l:w-[318px]'>
                  <div className='w-[70px] h-[70px] relative mb-4 l:mb-6'>
                    <ImageWrapper
                      type={help.img}
                      layout='fill'
                      quality={100}
                      alt={help.img}
                    />
                  </div>
                  <span className='mb-4 text-h-5 font-bold text-greyscale-900 text-center'>
                    {t(help.title)}
                  </span>
                  <span
                    className='text-body-14 m:text-body-18 font-normal text-grayscale-800 text-center'
                    dangerouslySetInnerHTML={{
                      __html: t(help.description),
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className='flex justify-center mt-4 pt-6 m:pt-8'>
          <LinkWrapper
            href='/support'
            title='Support'
            className=' self-center w-full'>
            <PrimaryButton className='px-12 py-5 shadow-[4px_8px_24px_rgba(114,16,255,0.25)] rounded-[100px] w-[328px] s:w-[240px] h-[62px] text-body-18 font-normal'>
              {t('LENDING_SECURITY_SEND')}
            </PrimaryButton>
          </LinkWrapper>
        </div>
      </div>

      <div className='flex flex-col mx-4 s:mx-auto s:w-704px m:w-944px l:w-1208px '>
        <div className='border-t border-greyscale-200 mt-12  mb-8 -mx-4 s:-mx-8 m:-mx-10'>
          <div className='flex flex-col s:flex-row s:items-center mx-4 s:mx-8 m:mx-10 s:mt-8'>
            <div className='flex flex-col s:flex-row space-y-10 s:space-y-0 s:space-x-10 text-greyscale-900 text-body-16 font-semibold text-left my-8 s:my-0 s:justify-between w-full'>
              <LinkWrapper
                title={t('TERMS_AND_CONDITIONS')}
                className='flex items-center whitespace-nowrap'
                href='/p/terms-and-conditions'>
                {t('TERMS_AND_CONDITIONS')}
              </LinkWrapper>
              <LinkWrapper
                title={t('PRIVACY_POLICY')}
                className='flex items-center whitespace-nowrap'
                href='/p/privacy-policy'>
                {t('PRIVACY_POLICY')}
              </LinkWrapper>
              <LinkWrapper
                className='flex items-center whitespace-nowrap'
                title={t('COOKIES_POLICY')}
                href='/p/cookies-policy'>
                {t('COOKIES_POLICY')}
              </LinkWrapper>
              <LinkWrapper
                className='flex items-center w-full'
                title={t('SUPPORT')}
                href='/support'>
                {t('SUPPORT')}
              </LinkWrapper>
            </div>
            <div className='text-body-14 font-normal text-greyscale-900 self-start whitespace-nowrap'>
              © {new Date().getFullYear()} VooXee
            </div>
          </div>
        </div>
      </div>
    </>
  )
})

export default SafetyLayout
