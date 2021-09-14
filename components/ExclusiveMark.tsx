import {FC} from 'react'
import IcAdvertoLogoSquareBW from 'icons/logo/AdvertoLogoSquareBW.svg'
import {useTranslation} from 'next-i18next'

const ExclusiveMark: FC = () => {
  const {t} = useTranslation()
  return (
    <div className='p-1 bg-shadow-overlay text-white text-body-2 rounded-lg flex items-center'>
      <IcAdvertoLogoSquareBW className='fill-current h-6 w-6 mr-1' />
      <span>{t('EXCLUSIVE')}</span>
    </div>
  )
}
export default ExclusiveMark
