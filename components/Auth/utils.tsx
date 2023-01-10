import React, {Dispatch, FC} from 'react'
import {AuthType} from 'front-api/src/models'
import {useTranslation} from 'next-i18next'
import SecondaryButton from '../Buttons/SecondaryButton'
import PrimaryButton from '../Buttons/PrimaryButton'

export const reducer = (state, action) => {
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
    case 'setIsNew':
      return {...state, isNew: action.isNew}
    default:
      throw new Error()
  }
}

export interface PageProps {
  state: State
  dispatch: Dispatch<Partial<State & {type: string; title: string}>>
  onClose: () => void
  onFinish: (phoneNum: string) => void
}

export interface State {
  incoming: string | null
  authType: AuthType | null
  userId: number | null
  isNew: boolean | null
  password: string | null
  page: {title: string; component: FC}
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
