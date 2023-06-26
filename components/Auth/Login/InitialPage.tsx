import React, {FC} from 'react'
import {useTranslation} from 'next-i18next'
import {AuthType} from 'front-api/src/models'
import {Call, Message} from 'react-iconly'
import {parseCookies} from 'nookies'
import {AuthPages} from './LoginWizard'
import {PageProps} from '../utils'
import OutlineButton from '../../Buttons/OutlineButton'
import {handleMetrics} from '../../../helpers'
import {SerializedCookiesState} from '../../../types'

const InitialPage: FC<PageProps> = ({dispatch}) => {
  const {t} = useTranslation()
  let auth
  if (AuthType.email) {
    auth = 'email'
  } else if (AuthType.phone) {
    auth = 'phone'
  }

  return (
    <div className='flex flex-col px-6 pb-6 pt-4 space-y-4'>
      <OutlineButton
        id='login-by-phone'
        className='h-14'
        onClick={() => {
          const state: SerializedCookiesState = parseCookies()
          const isCyprus = state.isCyprus === 'true'
          if (isCyprus) {
            dispatch({
              type: 'setPage',
              page: AuthPages.selectPhoneTypeAuth,
            })
          } else {
            dispatch({
              type: 'setPage',
              page: AuthPages.enterPhone,
            })
            dispatch({
              type: 'setPhoneType',
              phoneType: 'phone',
            })
            dispatch({
              type: 'setTitle',
              title: 'BY_PHONE',
            })
          }
          dispatch({
            type: 'setAuthType',
            authType: AuthType.phone,
          })
          handleMetrics('clickLogin_tel', {authType: auth})
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
          handleMetrics('clickLogin_email', {authType: auth})
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
