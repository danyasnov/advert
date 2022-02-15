import React, {Dispatch, FC, useEffect, useReducer, useState} from 'react'
import {CAParamsModel} from 'front-api/src/index'
import {useRouter} from 'next/router'
import {captureException} from '@sentry/nextjs'
import {first} from 'lodash'
import MapPage from './MapPage'
import CategoryPage from './Categories/CategoryPage'
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
  const {action} = query
  const hash = first(query.hash)

  const [isFetched, setIsFetched] = useState(false)

  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    // eslint-disable-next-line consistent-return
    const fetch = async () => {
      if (action === 'create' && hash) {
        try {
          const draftRes = await makeRequest({
            url: `/api/fetch-draft`,
            data: {hash},
            method: 'post',
          })
          if (!draftRes?.data?.result?.advertDraft) {
            return push('/')
          }
          const {advertDraft} = draftRes.data.result
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
        } catch (e) {
          captureException(e)
        }
      } else if (action === 'create' && !hash) {
        dispatch({
          type: 'setDraft',
          draft: {},
        })
        dispatch({
          type: 'setPage',
          page: AdvertPages.mapPage,
        })
        setIsFetched(true)
      } else if (action === 'edit') {
        try {
          const advertRes = await makeRequest({
            url: `/api/fetch-edit-advertise`,
            data: {hash},
            method: 'post',
          })

          if (!advertRes?.data?.result) {
            return push('/')
          }
          const {result} = advertRes.data
          const categoryRes = await makeRequest({
            url: '/api/category-data',
            method: 'post',
            data: {
              id: result.categoryId,
              editFields: result.fields,
            },
          })
          const currenciesRes = await makeRequest({
            url: '/api/currencies-by-gps',
            method: 'post',
            data: {
              location: result.location,
            },
          })
          const currencies = currenciesRes.data.result

          const categoryData = categoryRes.data.result
          dispatch({
            type: 'setDraft',
            draft: {
              ...result,
              data: categoryData,
              currencies,
              currency: currencies.find((c) => c.code === result.currency),
            },
          })
          dispatch({
            type: 'setPage',
            page: AdvertPages.formPage,
          })
          setIsFetched(true)
        } catch (e) {
          captureException(e)
        }
      }
    }
    fetch()
  }, [])

  const Component = state.page
  if (!isFetched) return null

  return <Component state={state} dispatch={dispatch} />
}

export default AdvertWizard
