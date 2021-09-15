import React, {FC} from 'react'
import {useTranslation} from 'next-i18next'
import {AuthType} from 'front-api/src/models/index'
import SecondaryButton from '../Buttons/SecondaryButton'
import {AuthPages, PageProps} from './LoginWizard'

const InitialPage: FC<PageProps> = ({dispatch}) => {
  const {t} = useTranslation()

  return (
    <div className='flex flex-col p-4 space-y-4'>
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
        {t('LOGIN_WITH_EMAIL')}
      </SecondaryButton>
    </div>
  )
}

export default InitialPage
