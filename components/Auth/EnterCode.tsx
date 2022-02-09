import React, {FC, useEffect, useState} from 'react'
import {useTranslation} from 'next-i18next'
import {AuthType} from 'front-api/src/models/index'
import AuthCode from 'react-auth-code-input'
import {toast} from 'react-toastify'
import {get} from 'lodash'
import {observer} from 'mobx-react-lite'
import {Secure} from 'front-api/src/helpers/userSecure'
import {useRouter} from 'next/router'
import {makeRequest} from '../../api'
import {setCookiesObject} from '../../helpers'
import LinkButton from '../Buttons/LinkButton'
import {AuthPages, Controls, PageProps} from './LoginWizard'
import Storage from '../../stores/Storage'

const EnterCode: FC<PageProps> = observer(({state, dispatch, onClose}) => {
  const {t} = useTranslation()
  const router = useRouter()
  const [isInvalid, setIsInvalid] = useState(false)
  const [counter, setCounter] = useState(60)
  const [disabled, setDisabled] = useState(true)
  const sendCode = () => {
    return makeRequest({
      url: '/api/send-code',
      data: {
        type: state.authType,
        incoming: state.incoming,
      },
      method: 'POST',
    })
  }
  useEffect(() => {
    sendCode()
  }, [])
  useEffect(() => {
    if (counter === 0) {
      setDisabled(false)
    } else {
      setTimeout(() => {
        setCounter(counter - 1)
      }, 1000)
    }
  }, [counter])
  return (
    <div className='flex flex-col items-center pt-6'>
      <AuthCode
        characters={4}
        inputType='number'
        onChange={async (value) => {
          setIsInvalid(false)
          if (value.length < 4) return
          const result = await makeRequest({
            url: !state.userId
              ? '/api/auth-with-code'
              : '/api/activate-with-code',
            data: !state.userId
              ? {
                  phone: state.incoming,
                  code: value,
                }
              : {
                  code: value,
                  checkId: state.userId,
                },
            method: 'POST',
          })
          if (result.data.error) {
            setIsInvalid(true)
            toast.error(t(result.data.error))
          } else {
            const {hash, promo} = get(result, 'data.result', {})
            if (state.authType === AuthType.phone) {
              const storage = new Storage({
                phone: state.incoming,
                promo,
                userHash: hash,
                authType: state.authType,
              })
              const secure = new Secure(storage)
              const token = secure.createUserSecure()
              setCookiesObject({
                hash,
                promo,
                token,
                authType: state.authType,
              })
            }
            if (state.authType === AuthType.email) {
              const storage = new Storage({
                password: state.password,
                email: state.incoming,
                userHash: hash,
                authType: state.authType,
              })
              const secure = new Secure(storage)
              const token = secure.createUserSecure()
              setCookiesObject({
                hash,
                promo,
                token,
                authType: state.authType,
              })
            }
            router.reload()
            onClose()
          }
        }}
        containerClassName='space-x-2'
        inputClassName={`w-14 h-18 p-4 text-h-1 text-black-b font-bold border rounded-lg login-code-input ${
          isInvalid ? 'border-error' : 'border-shadow-b'
        }`}
      />
      <span className='text-black-b text-body-3 mt-8 mb-2 mx-6 text-center'>
        {state.authType === AuthType.phone &&
          t('SENT_SMS_WITH_ACTIVATION_CODE')}
        {state.authType === AuthType.email &&
          state.userId &&
          t('SENT_EMAIL_WITH_ACTIVATION_CODE')}
      </span>
      <LinkButton
        className='mb-2'
        onClick={() => {
          dispatch(
            state.authType === AuthType.phone
              ? {type: 'setPage', page: AuthPages.enterPhone}
              : {type: 'setPage', page: AuthPages.enterEmail},
          )
        }}
        label={t(
          state.authType === AuthType.phone
            ? 'ANOTHER_PHONE_NUMBER'
            : 'EDIT_EMAIL',
        )}
      />
      {!!counter && (
        <span className='text-body-3 text-black-b mb-2'>
          {t('SEND_AFTER', {time: counter})}
        </span>
      )}
      <div className='-mx-4 w-full'>
        <Controls
          onBack={() => {
            dispatch({
              type: 'setPage',
              page:
                state.authType === AuthType.phone
                  ? AuthPages.enterPhone
                  : AuthPages.enterEmail,
            })
          }}
          onNext={() => {
            sendCode()
            setDisabled(true)
            setCounter(60)
          }}
          nextLabel={t('SEND_SMS_ONE_MORE_TIME')}
          nextDisabled={disabled}
        />
      </div>
    </div>
  )
})
export default EnterCode
