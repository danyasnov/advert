import React, {FC} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import Lottie from 'react-lottie'
import {useRouter} from 'next/router'
import {PageProps} from './utils'
import SuccessAnimation from '../../lottie/success_animation.json'
import PrimaryButton from '../Buttons/PrimaryButton'

const Success: FC<PageProps> = observer(({dispatch, onClose, onFinish}) => {
  const {t} = useTranslation()
  const {reload} = useRouter()
  return (
    <div className='flex flex-col'>
      <div className='mt-12 mb-4'>
        <Lottie
          options={{animationData: SuccessAnimation}}
          height={200}
          width={188}
        />
      </div>
      <span className='text-primary-500-text font-medium text-body-16 mx-12 text-center'>
        {t('SUCCESSFUL_REGISTRATION')}
      </span>
      <div className='px-6 w-full mt-8 mb-6 '>
        <PrimaryButton
          id='add-number-next'
          className='w-full'
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
