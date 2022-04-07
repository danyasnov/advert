import React, {Dispatch, FC, SetStateAction, useEffect, useReducer} from 'react'
import {useTranslation} from 'next-i18next'
import {AuthType} from 'front-api/src/models'
import SecondaryButton from '../../Buttons/SecondaryButton'
import PrimaryButton from '../../Buttons/PrimaryButton'
import EnterCode from './EnterCode'
import InitialPage from './InitialPage'
import EnterPhone from './EnterPhone'
import EnterPersonalData from './EnterPersonalData'
import EnterEmail from './EnterEmail'
import PasswordRestoration from './PasswordRestoration'
import Success from './Success'

export interface PageProps {
  state: State
  dispatch: Dispatch<Partial<State & {type: string; title: string}>>
  onClose: () => void
  onFinish: () => void
}

export const Controls: FC<{
  onNext: () => void
  onBack: () => void
  nextLabel?: string
  nextDisabled?: boolean
}> = ({onNext, onBack, nextLabel, nextDisabled}) => {
  const {t} = useTranslation()
  return (
    <div className='pb-6 flex justify-between space-x-3 w-full'>
      <SecondaryButton id='login-back' className='w-1/2' onClick={onBack}>
        {t('BACK')}
      </SecondaryButton>
      <PrimaryButton
        id='login-next'
        className='w-1/2'
        onClick={onNext}
        disabled={nextDisabled}>
        {nextLabel || t('NEXT')}
      </PrimaryButton>
    </div>
  )
}

export const AuthPages = {
  initialPage: {
    title: 'LOG_IN',
    component: InitialPage,
  },
  enterPhone: {
    title: 'LOGIN_WITH_PHONE',
    component: EnterPhone,
  },
  enterEmail: {
    title: 'LOG_IN',
    component: EnterEmail,
  },
  enterCode: {
    title: 'CODE',
    component: EnterCode,
  },
  enterPersonalData: {
    title: 'PERSONAL_DATA',
    component: EnterPersonalData,
  },
  passwordRestoration: {
    title: 'PASSWORD_RESTORATION',
    component: PasswordRestoration,
  },
  success: {
    title: 'CONGRATULATIONS',
    component: Success,
  },
}
interface State {
  incoming: string | null
  authType: AuthType | null
  userId: number | null
  password: string | null
  page: {title: string; component: FC}
}
const initialState: State = {
  incoming: null,
  authType: null,
  userId: null,
  password: null,
  page: AuthPages.initialPage,
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'setIncoming':
      return {...state, incoming: action.incoming}
    case 'setAuthType':
      return {...state, authType: action.authType}
    case 'setUserId':
      return {...state, userId: action.userId}
    case 'setPage':
      return {...state, page: action.page}
    case 'setPassword':
      return {...state, password: action.password}
    case 'setTitle':
      return {...state, page: {...state.page, title: action.title}}
    default:
      throw new Error()
  }
}
const LoginWizard: FC<{
  setTitle: Dispatch<SetStateAction<() => never>>
  onClose: () => void
  onFinish: () => void
}> = ({setTitle, onClose, onFinish}) => {
  const {t} = useTranslation()
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    setTitle(t(state.page.title))
  }, [state.page.title, setTitle, t])
  const Component = state.page.component

  return (
    <Component
      state={state}
      dispatch={dispatch}
      onClose={onClose}
      onFinish={onFinish}
    />
  )
}

export default LoginWizard
