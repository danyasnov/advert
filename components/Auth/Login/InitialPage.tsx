import React, {FC} from 'react'
import {useTranslation} from 'next-i18next'
import {AuthType} from 'front-api/src/models'
import IcPhone from 'icons/material/Phone.svg'
import IcEmail from 'icons/material/Email.svg'
import {Call, Message} from 'react-iconly'
import SecondaryButton from '../../Buttons/SecondaryButton'
import {AuthPages} from './LoginWizard'
import {PageProps} from '../utils'
import OutlineButton from '../../Buttons/OutlineButton'

const InitialPage: FC<PageProps> = ({dispatch}) => {
  const {t} = useTranslation()

  return (
    <div className='flex flex-col px-6 pb-6 space-y-4'>
      <OutlineButton
        id='login-by-phone'
        className='h-14'
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
        <div className='fill-current text-greyscale-900 mr-3'>
          <Call size={24} />
        </div>
        {t('BY_PHONE_NUMBER')}
      </OutlineButton>
      <OutlineButton
        id='login-by-email'
        className='h-14'
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
        <div className='fill-current text-greyscale-900 mr-3'>
          <Message />
        </div>
        {t('LOGIN_WITH_EMAIL')}
      </OutlineButton>
    </div>
  )
}

export default InitialPage
