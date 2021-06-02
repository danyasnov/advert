import {useEffect} from 'react'

const useDisableBodyScroll = (open: boolean): void => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [open])
}
export default useDisableBodyScroll
