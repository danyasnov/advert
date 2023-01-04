import {FC} from 'react'
import {useTranslation} from 'next-i18next'
import {Danger} from 'react-iconly'
import LinkWrapper from './Buttons/LinkWrapper'

const SafetyButton: FC = () => {
  const {t} = useTranslation()
  return (
    <div className='h-3 ml-2 s:ml-6'>
      <LinkWrapper
        title='security'
        href='/security'
        className='flex justify-center items-center'>
        <div className='mr-2 text-primary-500'>
          <Danger set='light' size={20} />
        </div>
        <div className='text-greyscale-900 text-body-12 font-medium'>
          {t('SECURITY')}
        </div>
      </LinkWrapper>
    </div>
  )
}

export default SafetyButton
