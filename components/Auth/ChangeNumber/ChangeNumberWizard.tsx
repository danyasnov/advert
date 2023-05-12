import React, {Dispatch, FC, SetStateAction, useEffect, useReducer} from 'react'
import {useTranslation} from 'next-i18next'
import {reducer, State} from '../utils'
import AuthPages from './AuthPages'

const initialState: State = {
  incoming: null,
  isNew: null,
  authType: 1,
  userId: null,
  password: null,
  page: AuthPages.enterPhone,
}

const ChangeNumberWizard: FC<{
  setTitle: Dispatch<SetStateAction<() => never>>
  onClose: () => void
  onFinish: (phoneNum: string) => void
  skipSuccessScreen?: boolean
}> = ({setTitle, onClose, onFinish, skipSuccessScreen}) => {
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
      skipSuccessScreen={skipSuccessScreen}
    />
  )
}

export default ChangeNumberWizard
