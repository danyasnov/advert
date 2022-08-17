import React, {Dispatch, FC, SetStateAction, useEffect, useReducer} from 'react'
import {useTranslation} from 'next-i18next'
import EnterCode from './EnterCode'
import EnterPhone from './EnterPhone'
import Success from '../Success'
import {reducer, State} from '../utils'

export const AuthPages = {
  enterPhone: {
    title: 'LOGIN_WITH_PHONE',
    component: EnterPhone,
  },
  enterCode: {
    title: 'CODE',
    component: EnterCode,
  },
  success: {
    title: 'CONGRATULATIONS',
    component: Success,
  },
}
const initialState: State = {
  incoming: null,
  isNew: null,
  authType: 1,
  userId: null,
  password: null,
  page: AuthPages.enterPhone,
}

const AddNumberWizard: FC<{
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

export default AddNumberWizard
