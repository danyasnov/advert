import {useEffect} from 'react'

const useDisableBodyScroll = (lock: boolean): void => {
  useEffect(() => {
    setTimeout(() => {
      if (lock) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = 'unset'
      }
    })
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [lock])
}
export default useDisableBodyScroll
