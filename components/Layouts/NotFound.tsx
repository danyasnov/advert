import React, {FC} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import {useRouter} from 'next/router'
import Header from '../Header'
import MetaTags from '../MetaTags'
import Button from '../Buttons/Button'
import ImageWrapper from '../ImageWrapper'
import SimpleFooter from '../SimpleFooter'

const NotFound: FC = observer(() => {
  const {t} = useTranslation()
  const {push} = useRouter()

  return (
    <>
      <MetaTags title={t('PAGE_ERROR')} />
      <div className='bg-blue'>
        <Header />
        <div className='flex flex-col s:flex-row s:justify-between items-center mx-4 s:pt-8 s:mx-auto s:w-[704px] m:w-[944px] l:w-[1210px]'>
          <div className='flex flex-col items-center s:items-start mt-10'>
            <h1 className='text-greyscale-900 font-bold text-[48px] m:text-[86px] l:text-[120px]'>
              {t('OOPS_ERROR')}
            </h1>
            <h5 className='text-greyscale-800 font-bold text-[20px] m:text-[32px] l:text-[40px]'>
              {t('PAGE_ERROR')}
            </h5>
            <div className='relative s:hidden w-[177px] h-[213px]'>
              <ImageWrapper
                type='/img/page-not-found.png'
                layout='fill'
                alt='page not found'
                objectFit='contain'
              />
            </div>
            <Button
              className='mt-6 m:mt-8 l:mt-10 h-10 w-[188px]  m:min-w-fit rounded-full bg-primary-500 text-white'
              onClick={async () => {
                return push(`/`)
              }}>
              <span className='text-body-14 font-bold px-4 py-2.5'>
                {t('BACK_ERROR')}
              </span>
            </Button>
          </div>
          <div className='relative hidden s:block s:w-[387px] s:h-[347px] m:w-[516px] m:h-[456px] l:w-[685px] l:h-[631px]'>
            <ImageWrapper
              type='/img/page-not-found.png'
              layout='fill'
              alt='page not found'
              objectFit='contain'
            />
          </div>
        </div>
        <SimpleFooter />
      </div>
    </>
  )
})

export default NotFound
