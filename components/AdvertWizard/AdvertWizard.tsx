import React, {Dispatch, FC, useReducer} from 'react'
import {CACategoryModel} from 'front-api/src/index'
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
  page: FC
}
const initialState: State = {
  location: null,
  category: null,
  page: AdvertPages.mapPage,
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'setLocation':
      return {...state, location: action.location}
    case 'setCategory':
      return {...state, category: action.category}
    case 'setUserId':
      return {...state, userId: action.userId}
    case 'setPage':
      return {...state, page: action.page}
    case 'setPassword':
      return {...state, password: action.password}
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
