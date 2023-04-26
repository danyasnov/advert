import {FC, ReactNode} from 'react'
import {useTranslation} from 'next-i18next'
import ImageWrapper from './ImageWrapper'
import LinkWrapper from './Buttons/LinkWrapper'

const MainBanner: FC = () => {
  const {t} = useTranslation()

  return (
    <div className='flex flex-col'>
      <div className='flex flex-col space-y-4 sticky top-[32px]'>
        <Banner
          id='main-banner-1'
          title={t('PROMOTION_TITLE2')}
          titleColor='text-primary-500'
          description={t('PROMOTION_DESCRIPTION2')}
          descriptionColor='text-primary-500'
          link='/business'
        />
        <Banner
          id='main-banner-2'
          title={t('PROMOTION_TITLE1')}
          titleColor='text-secondary-500'
          description={t('PROMOTION_DESCRIPTION1')}
          descriptionColor='text-white'
          link='/business'
        />
      </div>
    </div>
  )
}

const Banner: FC<{
  id: string
  title: string
  description: string
  titleColor: string
  descriptionColor: string
  link: string
}> = ({id, title, description, titleColor, descriptionColor, link}) => {
  return (
    <LinkWrapper href={link} title={title}>
      <div className='hidden m:block w-[280px] h-[380px] rounded-[32px] overflow-hidden relative'>
        <div className='absolute z-10 flex flex-col pt-10 pl-7'>
          <span
            className={`${titleColor} font-bold text-[28px] w-[200px] leading-7`}>
            {title}
          </span>
          <span className={`${descriptionColor} text-[22px] pt-1`}>
            {description}
          </span>
        </div>
        <ImageWrapper
          type={`/img/${id}.png`}
          alt='promo'
          width={280}
          height={380}
        />
      </div>
    </LinkWrapper>
  )
}

export default MainBanner
