import React, {Dispatch, FC, useEffect, useReducer, useState} from 'react'
import {CACategoryModel, CAParamsModel} from 'front-api/src/index'
import {TypeOfDegradation} from 'front-api/src/models/index'
import {useRouter} from 'next/router'
import MapPage from './MapPage'
import CategoryPage from './CategoryPage'
import FormPage from './FormPage'
import {makeRequest} from '../../api'

export interface PageProps {
  state: State
  dispatch: Dispatch<any>
  onClose: () => void
}

export const AdvertPages = {
  mapPage: MapPage,
  categoryPage: CategoryPage,
  formPage: FormPage,
}
interface State {
  page: FC
  draft: CAParamsModel
}
const initialState: State = {
  draft: null,
  page: AdvertPages.mapPage,
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'setLocation':
      return {
        ...state,
        draft: {
          ...state.draft,
          location: action.location,
        },
      }
    case 'setCategory':
      return {
        ...state,
        draft: {
          ...state.draft,
          categoryId: action.category.id,
          data: action.category,
        },
      }
    case 'setDegradation':
      return {
        ...state,
        draft: {
          ...state.draft,
          degradation: action.degradation,
        },
      }
    case 'setPage':
      return {...state, page: action.page}

    case 'setDraft':
      return {...state, draft: action.draft}
    default:
      throw new Error()
  }
}
const AdvertWizard: FC = () => {
  const {query, push} = useRouter()
  const [isFetched, setIsFetched] = useState(false)

  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    makeRequest({
      url: `/api/fetch-draft`,
      data: {hash: query.hash},
      method: 'post',
    }).then((res) => {
      if (!res?.data?.result?.advertDraft) {
        return push('/')
      }
      const {advertDraft} = res.data.result
      dispatch({
        type: 'setDraft',
        draft: advertDraft,
      })
      let page
      if (!advertDraft.location || !advertDraft.degradation) {
        page = AdvertPages.mapPage
      } else if (!advertDraft.categoryId || !advertDraft.data) {
        page = AdvertPages.categoryPage
      } else {
        page = AdvertPages.formPage
      }
      dispatch({
        type: 'setPage',
        page,
      })
      setIsFetched(true)
    })
  }, [])

  const Component = state.page
  if (!isFetched) return null

  return <Component state={state} dispatch={dispatch} />
}

export default AdvertWizard
