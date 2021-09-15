import React, {Dispatch, FC, SetStateAction, useEffect, useReducer} from 'react'
import {useTranslation} from 'next-i18next'
import SecondaryButton from '../Buttons/SecondaryButton'
import PrimaryButton from '../Buttons/PrimaryButton'
import EnterCode from './EnterCode'
import InitialPage from './InitialPage'
import EnterPhone from './EnterPhone'
import EnterPersonalData from './EnterPersonalData'
import EnterEmail from './EnterEmail'
import EnterEmailPersonalData from './EnterEmailPersonalData'

export interface PageProps {
  state: State
  dispatch: Dispatch<Partial<State & {type: string}>>
  onClose: () => void
}
export interface Country {
  label: string
  value: string
  phonePrefix: string
  phoneMask: string
  phoneLength: number
}

export const Controls: FC<{
  onNext: () => void
  onBack: () => void
  nextLabel?: string
  nextDisabled?: boolean
}> = ({onNext, onBack, nextLabel, nextDisabled}) => {
  const {t} = useTranslation()
  return (
    <div className='p-4 flex border-t border-shadow-b justify-end space-x-2'>
      <SecondaryButton onClick={onBack}>{t('BACK')}</SecondaryButton>
      <PrimaryButton onClick={onNext} disabled={nextDisabled}>
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
  enterEmailPersonalData: {
    title: 'PERSONAL_DATA',
    component: EnterEmailPersonalData,
  },
}
interface State {
  incoming: string | null
  authType: number | null
  userId: number | null
  page: {title: string; component: FC}
}
const initialState: State = {
  incoming: null,
  authType: null,
  userId: null,
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
    default:
      throw new Error()
  }
}
const LoginWizard: FC<{
  setTitle: Dispatch<SetStateAction<() => never>>
  onClose: () => void
}> = ({setTitle, onClose}) => {
  const {t} = useTranslation()
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    setTitle(t(state.page.title))
  }, [state.page.title, setTitle, t])
  const Component = state.page.component

  return <Component state={state} dispatch={dispatch} onClose={onClose} />
}

export default LoginWizard
