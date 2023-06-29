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
import SelectPhoneTypeAuth from './SelectPhoneTypeAuth'

export const AuthPages = {
  initialPage: {
    title: 'LOG_IN',
    component: InitialPage,
  },
  enterPhone: {
    title: 'LOGIN_WITH_PHONE',
    component: EnterPhone,
  },
  selectPhoneTypeAuth: {
    title: 'BY_PHONE',
    component: SelectPhoneTypeAuth,
    backButtonHandler: (dispatch) =>
      dispatch({
        type: 'setPage',
        page: AuthPages.initialPage,
      }),
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
  phoneType: null,
  userId: null,
  password: null,
  page: AuthPages.initialPage,
}

const LoginWizard: FC<{
  setTitle: (newTitle: any, backButton?: any) => void
  onClose: () => void
  onFinish: () => void
}> = ({setTitle, onClose, onFinish}) => {
  const {t} = useTranslation()
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    const handler =
      state.page.backButtonHandler &&
      (() => state.page.backButtonHandler(dispatch))
    setTitle(t(state.page.title), handler)
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
