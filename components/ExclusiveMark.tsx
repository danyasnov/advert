import {FC} from 'react'
import {useTranslation} from 'next-i18next'
import ImageWrapper from './ImageWrapper'

const ExclusiveMark: FC = () => {
  const {t} = useTranslation()
  return (
    <div className='p-1 bg-shadow-overlay text-white text-body-2 rounded-lg flex items-center'>
      <div className='mr-1 h-5 filter brightness-0 invert'>
        <ImageWrapper
          type='/img/logo/AdvertoLogoSquare.png'
          alt='Logo'
          width={20}
          height={20}
          layout='fixed'
        />
      </div>
      <span className='text-body-2 text-white-a'>{t('EXCLUSIVE')}</span>
    </div>
  )
}
export default ExclusiveMark
