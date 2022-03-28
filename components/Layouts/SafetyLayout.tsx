import {FC} from 'react'
import {useTranslation} from 'next-i18next'
import {observer} from 'mobx-react-lite'
import IcPeople from 'icons/safety-landing/People.svg'
import Logo from '../Logo'
import LanguageSelect from '../LanguageSelect'
import PrimaryButton from '../Buttons/PrimaryButton'

const SafetyLayout: FC = observer(() => {
  const {t} = useTranslation()
  return (
    <div>
      <div className='flex justify-between items-center my-2.5 mx-4'>
        <Logo />
        <LanguageSelect />
      </div>
      <div className='flex flex-col bg-[#FFF6EE] pt-8 pb-18'>
        <IcPeople className='w-[240px] h-[291px] mb-15 self-center' />
        <div className='mx-4 flex flex-col space-y-4'>
          <h1 className='text-h-1 font-medium'>{t('SECURITY_ON_ADVERTO')}</h1>
          <span className='text-h-3'>{t('SECURITY_ON_ADVERTO_TEXT')}</span>
          <span className='text-h-3 '>{t('SECURITY_ON_ADVERTO_TEXT_BR')}</span>
        </div>
        <PrimaryButton className='mx-4 mt-15'>
          {t('REPORT_FRAUD')}
        </PrimaryButton>
      </div>
      <div className='flex flex-col'>
        <h1 className='text-h-1 font-medium'>
          {t('LANDING_GENERAL_SAFETY_RULES')}
        </h1>
      </div>
    </div>
  )
})

export default SafetyLayout
