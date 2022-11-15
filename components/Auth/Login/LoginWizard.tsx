import React, {Dispatch, FC, SetStateAction, useEffect, useReducer} from 'react'
import {useTranslation} from 'next-i18next'
import EnterCode from './EnterCode'
import InitialPage from './InitialPage'
import EnterPhone from './EnterPhone'
import EnterPersonalData from './EnterPersonalData'
import EnterEmail from './EnterEmail'
import PasswordRestoration from './PasswordRestoration'
import Success from '../Success'
import {reducer, State} from '../utils'

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
    title: 'LOGIN_WITH_EMAIL',
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
    title: '',
    component: Success,
  },
}

const initialState: State = {
  incoming: null,
  isNew: null,
  authType: null,
  userId: null,
  password: null,
  page: AuthPages.initialPage,
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
