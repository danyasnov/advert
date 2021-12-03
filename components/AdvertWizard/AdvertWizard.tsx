import React, {Dispatch, FC, useReducer} from 'react'
import {CACategoryModel} from 'front-api/src/index'
import {TypeOfDegradation} from 'front-api/src/models/index'
import MapPage from './MapPage'
import CategoryPage from './CategoryPage'
import FormPage from './FormPage'

export interface PageProps {
  state: State
  dispatch: Dispatch<Partial<State & {type: string}>>
  onClose: () => void
}

export const AdvertPages = {
  mapPage: MapPage,
  categoryPage: CategoryPage,
  formPage: FormPage,
}
interface State {
  location: {
    lat: number
    lng: number
  } | null
  category: CACategoryModel | null
  degradation: TypeOfDegradation
  page: FC
}
const initialState: State = {
  location: null,
  category: null,
  degradation: 'absent',
  page: AdvertPages.mapPage,
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'setLocation':
      return {...state, location: action.location}
    case 'setCategory':
      return {...state, category: action.category}
    case 'setDegradation':
      return {...state, degradation: action.degradation}
    case 'setPage':
      return {...state, page: action.page}
    default:
      throw new Error()
  }
}
const LoginWizard: FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const Component = state.page

  return <Component state={state} dispatch={dispatch} />
}

export default LoginWizard
