import React, {FC, useEffect, useRef, useState} from 'react'
import {useTranslation} from 'next-i18next'
import {AuthType} from 'front-api/src/models'
import AuthCode, {AuthCodeRef} from 'react-auth-code-input'
import {observer} from 'mobx-react-lite'
import {VerifyMode} from 'front-api/src/models/auth'
import {useFormik} from 'formik'
import {object, string} from 'yup'
import {useRouter} from 'next/router'
import {makeRequest} from '../../../api'
import {handleMetrics, setCookiesObject, trackSingle} from '../../../helpers'
import LinkButton from '../../Buttons/LinkButton'
import {AuthPages} from './LoginWizard'
import {Controls, PageProps} from '../utils'
import LinkWrapper from '../../Buttons/LinkWrapper'

const getCharacters = (verifyMode) => {
  switch (verifyMode) {
    case VerifyMode.Call:
      return 5
    case VerifyMode.SMS:
    case VerifyMode.Email:
      return 4
    default:
      return null
  }
}
const EnterCode: FC<PageProps> = observer(
  ({state, dispatch, onClose, onFinish}) => {
    const {t} = useTranslation()
    const {reload} = useRouter()
    const [counter, setCounter] = useState(60)
    const [verifyMode, setVerifyMode] = useState(() => {
      if (state.authType === AuthType.email) {
        return VerifyMode.Email
      }
      if (state.authType === AuthType.phone) {
        return state.phoneType === 'phone' ? VerifyMode.Call : VerifyMode.SMS
      }
    })
    let auth
    if (AuthType.email) {
      auth = 'email'
    } else if (AuthType.phone) {
      auth = 'phone'
    }
    const characters = getCharacters(verifyMode)
    const AuthInputRef = useRef<AuthCodeRef>(null)

    const sendCode = () => {
      handleMetrics('sendAutorization_code', {authType: auth})

      return makeRequest({
        url: '/api/send-code',
        data: {
          incoming: {
            type: state.authType,
            ...(state.authType === 2 ? {email: state.incoming} : {}),
            ...(state.authType === 1 ? {phone: state.incoming} : {}),
          },
          verifyMode,
        },
        method: 'POST',
      })
    }
    useEffect(() => {
      sendCode()
    }, [])
    useEffect(() => {
      if (verifyMode !== VerifyMode.Call) {
        if (counter !== 0) {
          setTimeout(() => {
            setCounter(counter - 1)
          }, 1000)
        }
      }
    }, [counter])
    useEffect(() => {
      if (verifyMode === VerifyMode.SMS) {
        sendCode()
      }
    }, [verifyMode])

    const formik = useFormik({
      enableReinitialize: true,
      initialValues: {
        code: '',
      },
      validationSchema: object().shape({
        code: string()
          .min(characters, t('CODE_NOT_CORRECT'))
          .required(t('CODE_NOT_CORRECT')),
      }),
      validateOnBlur: false,
      validateOnChange: false,
      onSubmit: async (values) => {
        const result = await makeRequest({
          url: '/api/check-code',
          data: {
            incoming: {
              type: state.authType,
              ...(state.authType === 2 ? {email: state.incoming} : {}),
              ...(state.authType === 1 ? {phone: state.incoming} : {}),
            },
            verifyMode,
            code: values.code,
          },
          method: 'POST',
        })
        if (result?.data.status !== 200) {
          return setFieldError('code', t(result.data.error))
        }
        const {access, hash, refresh} = result.data.result.newAuth
        const {promo} = result.data.result.oldAuth
        setCookiesObject({
          authNewToken: access,
          hash,
          authNewRefreshToken: refresh,
          promo,
        })
        handleMetrics('autorizationSuccess', {authType: auth})
        if (state.isNew) {
          trackSingle('CompleteRegistration')
          dispatch({type: 'setPage', page: AuthPages.success})
        } else if (onFinish) {
          onFinish()
        } else {
          onClose()
          reload()
        }
      },
    })

    const {errors, setFieldValue, submitForm, setFieldError, isSubmitting} =
      formik

    return (
      <div className='flex flex-col items-center px-4'>
        <span className='text-greyscale-900 text-body-16 font-medium mt-8 mb-6 mx-6 text-center w-[304px]'>
          {verifyMode === 0 && t('RECEIVING_AUTHORIZATION_CODE_ON_CALL')}
          {verifyMode === 1 &&
            t('VERIFICATION_CODE_SMS', {phone: state.incoming})}
          {verifyMode === 2 && t('CODE_SENT_TO_EMAIL', {email: state.incoming})}
        </span>
        <AuthCode
          key={characters}
          ref={AuthInputRef}
          length={characters}
          allowedCharacters='numeric'
          onChange={(value) => {
            setFieldValue('code', value).then(() => {
              setFieldError('code', '')
              if (value?.length === characters && !isSubmitting) {
                submitForm()
              }
            })
          }}
          containerClassName='space-x-2'
          inputClassName={`w-12 h-15 p-4 text-h-4 text-greyscale-900 font-bold border rounded-xl bg-greyscale-50 ${
            errors.code ? 'border-error' : 'border-greyscale-200'
          }`}
        />
        <span className='text-body-12 text-error my-3 w-[304px] text-center'>
          {errors.code}
        </span>

        {(verifyMode === VerifyMode.SMS || verifyMode === VerifyMode.Email) && (
          <>
            {counter ? (
              <span className='text-body-14 text-greyscale-400 mb-4'>
                {t('SEND_AFTER', {time: counter})}
              </span>
            ) : (
              <LinkButton
                className='mb-4'
                onClick={() => {
                  sendCode()
                  setCounter(60)
                }}
                label={t('SEND_SMS_ONE_MORE_TIME')}
              />
            )}
          </>
        )}

        {verifyMode === VerifyMode.Call && (
          <LinkButton
            className='mb-4'
            onClick={() => {
              setVerifyMode(1)
              dispatch({type: 'setTitle', title: 'ENTER_CODE_FROM_SMS'})
              setCounter(59)
              setFieldValue('code', null)
              AuthInputRef.current?.clear()
            }}
            label={t('NOT_RECEIVED_CALL')}
          />
        )}
        {verifyMode === VerifyMode.Email && (
          <LinkButton
            className='mb-10'
            onClick={() => {
              dispatch({type: 'setPage', page: AuthPages.enterEmail})
            }}
            label={t('EDIT_EMAIL')}
          />
        )}
        {verifyMode !== VerifyMode.Email && (
          <LinkWrapper
            className='mb-10'
            href='/support'
            target='_blank'
            title={t('SUPPORT_CONTACT')}>
            <LinkButton label={t('SUPPORT_CONTACT')} />
          </LinkWrapper>
        )}
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
            submitForm()
          }}
          nextLabel={t('CONTINUE')}
        />
      </div>
    )
  },
)
export default EnterCode
