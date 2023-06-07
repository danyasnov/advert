import React, {Dispatch, FC, SetStateAction, useEffect, useReducer} from 'react'
import {useTranslation} from 'next-i18next'
import {reducer, State} from '../utils'
import AuthPages from './AuthPages'

const ChangeContactWizard: FC<{
  setTitle: Dispatch<SetStateAction<() => never>>
  onClose: () => void
  onFinish: (phoneNum: string) => void
  skipSuccessScreen?: boolean
  type: 'phone' | 'email'
}> = ({setTitle, onClose, onFinish, skipSuccessScreen, type}) => {
  const {t} = useTranslation()
  const initialState: State = {
    incoming: null,
    authType: type === 'phone' ? 1 : 2,
    page: type === 'phone' ? AuthPages.enterPhone : AuthPages.enterEmail,
  }
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    setTitle(t(state.page.title))
  }, [state.page.title, setTitle, t])
  const Component = state.page.component

  return (
    <Component
      type={type}
      state={state}
      dispatch={dispatch}
      onClose={onClose}
      onFinish={onFinish}
      skipSuccessScreen={skipSuccessScreen}
    />
  )
}

export default ChangeContactWizard
