import React, {ReactNode, useCallback, useEffect} from 'react'
import {useRouter} from 'next/router'
import ym, {YMInitializer} from 'react-yandex-metrika'

export type WithYandexMetrikaProps = {
  children: ReactNode
}

const enabled = process.env.NODE_ENV === 'production'

const WithYandexMetrika = (props: WithYandexMetrikaProps) => {
  const {children} = props
  const router = useRouter()

  const hit = useCallback((url) => {
    if (enabled) {
      ym('hit', url)
    } else {
      console.log(`%c[YandexMetrika](HIT)`, `color: orange`, url)
    }
  }, [])

  useEffect(() => {
    hit(window.location.pathname + window.location.search)
    router.events.on('routeChangeComplete', (url: string) => hit(url))
  }, [])

  return (
    <>
      {enabled && (
        <YMInitializer
          accounts={[46964940]}
          options={{
            clickmap: true,
            trackLinks: true,
            accurateTrackBounce: true,
            webvisor: true,
            trackHash: true,
            ecommerce: 'dataLayer',
            defer: true,
          }}
          version='2'
        />
      )}
      {children}
    </>
  )
}

export default WithYandexMetrika
