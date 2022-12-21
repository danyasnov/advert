import {FC} from 'react'
import {useTranslation} from 'next-i18next'
import {Work} from 'react-iconly'
import LinkWrapper from './Buttons/LinkWrapper'

const BusinessButton: FC = () => {
  const {t} = useTranslation()
  return (
    <LinkWrapper
      title='business'
      href='/business'
      className='flex justify-center items-center cursor-pointer '>
      <div className='mr-2 text-primary-500'>
        <Work set='light' size={20} />
      </div>
      <div className='text-greyscale-900 text-body-12 font-medium'>
        {t('FOR_BUSINESS')}
      </div>
    </LinkWrapper>
  )
}

export default BusinessButton
