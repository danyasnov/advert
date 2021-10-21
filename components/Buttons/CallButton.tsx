import {FC, useState} from 'react'
import IcPhone from 'icons/material/Phone.svg'
import {useTranslation} from 'next-i18next'
import PrimaryButton from './PrimaryButton'

interface Props {
  phoneNum: string
}
const CallButton: FC<Props> = ({phoneNum}) => {
  const [showPhone, setShowPhone] = useState(false)
  const {t} = useTranslation()
  return (
    <div className='w-full mb-4'>
      {phoneNum && !showPhone && (
        <PrimaryButton
          onClick={() => setShowPhone(true)}
          className='w-full text-body-2 text-black-b order-0 '>
          <IcPhone className='fill-current h-4 w-4 mr-2' />
          {showPhone ? phoneNum : t('MAKE_A_CALL')}
        </PrimaryButton>
      )}
      {showPhone && (
        <div className='w-full text-body-2 text-black-b order-0 flex justify-center py-3 px-3.5'>
          <IcPhone className='fill-current h-4 w-4 mr-2' />
          {showPhone ? phoneNum : t('MAKE_A_CALL')}
        </div>
      )}
    </div>
  )
}
export default CallButton
