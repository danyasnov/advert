import {useEffect, useState} from 'react'
import {parseCookies} from 'nookies'
import {setCookiesObject} from '../helpers'
import {SerializedCookiesState} from '../types'

const useTourVisibility = (path: string): boolean => {
  const [showTour, setShowTour] = useState(false)

  useEffect(() => {
    const cookies: SerializedCookiesState = parseCookies()
    const visitCount = Number(cookies[path]) || 1
    const newVisitCount = visitCount <= 2 ? visitCount + 1 : visitCount
    setCookiesObject({[path]: newVisitCount})
    setShowTour(visitCount === 2)
  }, [])

  return showTour
}

export default useTourVisibility
