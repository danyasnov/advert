import React, {FC} from 'react'
import {useTranslation} from 'next-i18next'
import {AuthType} from 'front-api/src/models/index'
import IcPhone from 'icons/material/Phone.svg'
import IcEmail from 'icons/material/Email.svg'
import SecondaryButton from '../Buttons/SecondaryButton'
import {AuthPages, PageProps} from './LoginWizard'

const InitialPage: FC<PageProps> = ({dispatch}) => {
  const {t} = useTranslation()

  return (
    <div className='flex flex-col p-4 space-y-4 pb-8'>
      <SecondaryButton
        onClick={() => {
          dispatch({
            type: 'setPage',
            page: AuthPages.enterPhone,
          })
          dispatch({
            type: 'setAuthType',
            authType: AuthType.phone,
          })
        }}>
        <IcPhone className='fill-current text-black-c h-6 w-6 mr-2' />
        {t('BY_PHONE_NUMBER')}
      </SecondaryButton>
      <SecondaryButton
        onClick={() => {
          dispatch({
            type: 'setPage',
            page: AuthPages.enterEmail,
          })
          dispatch({
            type: 'setAuthType',
            authType: AuthType.email,
          })
        }}>
        <IcEmail className='fill-current text-black-c h-6 w-6 mr-2 ' />
        {t('LOGIN_WITH_EMAIL')}
      </SecondaryButton>
    </div>
  )
}

export default InitialPage
