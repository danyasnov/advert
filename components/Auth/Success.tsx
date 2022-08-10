import React, {FC} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import {useRouter} from 'next/router'
import IcLoginSuccess from 'icons/LoginSuccess.svg'
import {PageProps} from './utils'
import PrimaryButton from '../Buttons/PrimaryButton'

const Success: FC<PageProps> = observer(({onClose, onFinish}) => {
  const {t} = useTranslation()
  const {reload} = useRouter()
  return (
    <div className='flex flex-col'>
      <div className='mb-6 flex justify-center'>
        <IcLoginSuccess className='w-[124px] h-[124px]' />
      </div>
      <span className='text-primary-500 text-h-4 font-bold mx-12 text-center mb-6'>
        {t('CONGRATULATIONS')}
      </span>
      <span className='text-greyscale-900 text-body-16 mx-12 mb-10 text-center'>
        {t('SUCCESSFUL_REGISTRATION')}
      </span>
      <div className='px-6 w-full mb-6 flex justify-center'>
        <PrimaryButton
          id='add-number-next'
          className='w-[212px]'
          onClick={() => {
            if (onFinish) {
              onFinish()
            } else {
              onClose()
              reload()
            }
          }}>
          {t('CONTINUE')}
        </PrimaryButton>
      </div>
    </div>
  )
})

export default Success
