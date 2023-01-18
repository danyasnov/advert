import {FC} from 'react'
import {useTranslation} from 'next-i18next'
import LinkWrapper from './Buttons/LinkWrapper'

const SafetyButton: FC = () => {
  const {t} = useTranslation()
  return (
    <LinkWrapper
      title='security'
      href='/security'
      className='flex justify-center items-center'>
      <div className='text-greyscale-800 text-body-12 font-medium'>
        {t('SECURITY')}
      </div>
    </LinkWrapper>
  )
}

export default SafetyButton
