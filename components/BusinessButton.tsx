import {FC} from 'react'
import {useTranslation} from 'next-i18next'
import LinkWrapper from './Buttons/LinkWrapper'

const BusinessButton: FC = () => {
  const {t} = useTranslation()
  return (
    <LinkWrapper
      title='business'
      href='/business'
      className='flex justify-center items-center'>
      <div className='text-greyscale-800 text-body-12 font-medium'>
        {t('FOR_BUSINESS')}
      </div>
    </LinkWrapper>
  )
}

export default BusinessButton
