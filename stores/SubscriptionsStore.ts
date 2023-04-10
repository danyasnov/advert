import {action, makeAutoObservable} from 'mobx'
import {SubscriptionOperationType, UserModel} from 'front-api'
import axios, {AxiosRequestConfig, CancelTokenSource} from 'axios'
import {isEmpty, omit} from 'lodash'
import {toast} from 'react-toastify'
import {makeRequest} from '../api'

export interface ISubscribtionsStore {
  readonly userId: string
  readonly type: SubscriptionOperationType
}

export class SubscriptionsStore implements ISubscribtionsStore {
  userId

  type

  fetchSubscriptions = (): Promise<void> => {
    const config: AxiosRequestConfig = {
      url: '/api/user-subscribers-subscriptions',
      method: 'POST',
      data: {
        uderId: this.userId,
        type: this.type,
        // page: this.page,
      },
    }

    return makeRequest(config).then(
      action('fetchSuccess', (response) => {
        if (!response.data || isEmpty(response.data) || response?.data?.error) {
          if (response?.data?.error) {
            toast.error(response.data.error)
          }
          return Promise.reject(
            !response.data || isEmpty(response.data) || response?.data?.error,
          )
        }
        const {
          result: {aggregatedFields, data},
          headers: {
            pagination: {count, page, limit},
            cacheId,
          },
        } = response.data
        this.userId = userId

        return Promise.resolve()
      }),
      action('fetchError', (error) => {
        if (error?.message !== 'got_new_request') {
          toast.error(error.message)
          this.state = 'error'
        }
        return Promise.reject(error)
      }),
    )
  }
}
