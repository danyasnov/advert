import React, {FC} from 'react'
import {useTranslation} from 'next-i18next'
import {AuthType} from 'front-api/src/models'
import SecondaryButton from '../../Buttons/SecondaryButton'
import {AuthPages} from './LoginWizard'
import {PageProps} from '../utils'
import PrimaryButton from '../../Buttons/PrimaryButton'

const SelectPhoneTypeAuth: FC<PageProps> = ({dispatch}) => {
  const {t} = useTranslation()
  const handleSelect = (type: 'phone' | 'sms') => {
    dispatch({
      type: 'setPage',
      page: AuthPages.enterPhone,
    })
    dispatch({
      type: 'setAuthType',
      authType: AuthType.phone,
    })
    dispatch({
      type: 'setPhoneType',
      phoneType: type,
    })
    dispatch({
      type: 'setTitle',
      title: type === 'phone' ? 'BY_PHONE' : 'BY_SMS',
    })
  }
  return (
    <div className='flex flex-col px-6 pb-6 pt-4'>
      <p className='text-greyscale-900 font-semibold mb-3 text-body-16'>
        {t('YOU_CAN_LOGIN_PHONE_OR_SMS')}
      </p>
      <p className='text-greyscale-900 text-body-14 mb-8'>
        {t('YOU_CAN_LOGIN_PHONE_OR_SMS_DESCRIPTION')}
      </p>
      <div className='flex w-full space-x-2'>
        <SecondaryButton
          className='w-full'
          onClick={() => {
            handleSelect('sms')
          }}>
          {t('CONTINUE_BY_SMS')}
        </SecondaryButton>
        <PrimaryButton
          className='w-full'
          onClick={() => {
            handleSelect('phone')
          }}>
          {t('CONTINUE_BY_CALL')}
        </PrimaryButton>
      </div>
    </div>
  )
}

export default SelectPhoneTypeAuth
