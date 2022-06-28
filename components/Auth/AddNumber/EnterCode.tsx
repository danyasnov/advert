import React, {FC, useEffect, useRef, useState} from 'react'
import {useTranslation} from 'next-i18next'
import {AuthType} from 'front-api/src/models'
import AuthCode, {AuthCodeRef} from 'react-auth-code-input'
import {observer} from 'mobx-react-lite'
import {VerifyMode} from 'front-api/src/models/auth'
import {useFormik} from 'formik'
import {object, string} from 'yup'
import Lottie from 'react-lottie'
import {makeRequest} from '../../../api'
import LinkButton from '../../Buttons/LinkButton'
import {AuthPages} from './AddNumberWizard'
import {Controls, PageProps} from '../utils'
import MailAnimation from '../../../lottie/mail_animation.json'
import CallAnimation from '../../../lottie/call_test.json'
import SmsAnimation from '../../../lottie/sms_animation.json'

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
const EnterCode: FC<PageProps> = observer(({state, dispatch}) => {
  const {t} = useTranslation()
  const [counter, setCounter] = useState(60)
  const [disabled, setDisabled] = useState(true)
  const [verifyMode, setVerifyMode] = useState(VerifyMode.Call)
  const characters = getCharacters(verifyMode)
  const AuthInputRef = useRef<AuthCodeRef>(null)

  const sendCode = () => {
    return makeRequest({
      url: '/api/send-code',
      data: {
        incoming: {
          type: state.authType,
          phone: state.incoming,
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
      if (counter === 0) {
        setDisabled(false)
      } else {
        setTimeout(() => {
          setCounter(counter - 1)
        }, 1000)
      }
    }
  }, [counter])
  useEffect(() => {
    if (verifyMode === 1) {
      sendCode()
    }
  }, [verifyMode])

  const schema = object().shape({
    code: string()
      .min(characters, t('CODE_NOT_CORRECT'))
      .required(t('CODE_NOT_CORRECT')),
  })

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      code: '',
    },
    validate: (values) => {
      const errors = {}

      try {
        schema.validateSync(values, {
          abortEarly: false,
        })
      } catch (e) {
        e.inner.forEach(({path, message}) => {
          errors[path] = message
        })
      }

      return errors
    },
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      const result = await makeRequest({
        url: '/api/change-contact',
        data: {
          incoming: {
            type: state.authType,
            phone: state.incoming,
          },
          verifyMode,
          code: values.code,
        },
        method: 'POST',
      })
      if (result?.data.status !== 200) {
        return setFieldError('code', t(result.data.error))
      }
      dispatch({type: 'setPage', page: AuthPages.success})
    },
  })

  const {errors, setFieldValue, submitForm, setFieldError, isSubmitting} =
    formik

  return (
    <div className='flex flex-col items-center pt-2 px-4'>
      <div className='mb-8'>
        {verifyMode === 2 && (
          <Lottie
            options={{animationData: MailAnimation}}
            height={68}
            width={68}
          />
        )}
        {verifyMode === 0 && (
          <Lottie
            options={{animationData: CallAnimation}}
            height={68}
            width={68}
          />
        )}
        {verifyMode === 1 && (
          <Lottie
            options={{animationData: SmsAnimation}}
            height={68}
            width={68}
          />
        )}
      </div>

      <AuthCode
        key={characters}
        ref={AuthInputRef}
        length={characters}
        allowedCharacters='numeric'
        onChange={(value) => {
          setFieldValue('code', value).then(() => {
            if (value?.length === characters && !isSubmitting) {
              submitForm()
            }
          })
        }}
        containerClassName='space-x-2'
        inputClassName={`w-14 h-18 p-4 text-h-1 text-black-b font-bold border rounded-lg ${
          errors.code ? 'border-error' : 'border-nc-border'
        }`}
      />
      <span className='text-body-3 text-nc-error mt-2 w-[304px] text-center'>
        {errors.code}
      </span>
      <span className='text-nc-primary-text text-body-1 font-medium mt-6 mb-4 mx-6 text-center w-[304px]'>
        {verifyMode === 0 && t('RECEIVING_AUTHORIZATION_CODE_ON_CALL')}
        {verifyMode === 1 && t('SENT_SMS_WITH_ACTIVATION_CODE')}
        {verifyMode === 2 && t('SENT_EMAIL_WITH_ACTIVATION_CODE')}
      </span>
      <LinkButton
        className='mb-2'
        onClick={() => {
          dispatch({type: 'setPage', page: AuthPages.enterPhone})
        }}
        label={t(
          state.authType === AuthType.phone
            ? 'ANOTHER_PHONE_NUMBER'
            : 'EDIT_EMAIL',
        )}
      />
      {verifyMode === 0 && (
        <LinkButton
          className='mb-6'
          onClick={() => {
            setVerifyMode(1)
            dispatch({type: 'setTitle', title: 'ENTER_CODE_FROM_SMS'})
            setDisabled(true)
            setCounter(59)
            setFieldValue('code', null)
            AuthInputRef.current?.clear()
          }}
          label={t('NOT_RECEIVED_CALL')}
        />
      )}

      {verifyMode !== 0 && (
        <span
          className={`text-body-3 text-nc-primary-text mb-6 ${
            counter ? 'visible' : 'invisible'
          }`}>
          {t('SEND_AFTER', {time: counter})}
        </span>
      )}
      <Controls
        onBack={() => {
          dispatch({
            type: 'setPage',
            page: AuthPages.enterPhone,
          })
        }}
        onNext={() => {
          sendCode()
          setDisabled(true)
          setCounter(60)
        }}
        nextLabel={t(verifyMode === 0 ? 'CONTINUE' : 'SEND_SMS_ONE_MORE_TIME')}
        nextDisabled={disabled}
      />
    </div>
  )
})
export default EnterCode
