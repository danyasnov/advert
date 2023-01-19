import {FC} from 'react'
import {useTranslation} from 'next-i18next'
import ImageWrapper from './ImageWrapper'

const MainBanner: FC = () => {
  const {t} = useTranslation()

  return (
    <div className='flex flex-col space-y-4'>
      <Banner
        id='main-banner-1'
        title={
          <span className='text-primary-500 font-bold'>
            {t('PROMOTION_TITLE2')}
          </span>
        }
        description={t('PROMOTION_DESCRIPTION2')}
      />
      <Banner
        id='main-banner-2'
        title={
          <span className='text-primary-500 font-bold'>
            {t('PROMOTION_TITLE1')}
          </span>
        }
        description={t('PROMOTION_DESCRIPTION1')}
      />
    </div>
  )
}

const Banner: FC<{id: string; title: any; description: string}> = ({
  id,
  title,
  description,
}) => {
  return (
    <div className='hidden m:block w-[280px] h-[380px] rounded-[32px] overflow-hidden relative'>
      <div className='absolute z-10 flex flex-col'>
        {title}
        {description}
      </div>

      <ImageWrapper
        type={`/img/${id}.png`}
        alt='promo'
        width={280}
        height={380}
      />
    </div>
  )
}

export default MainBanner
