import {FC, ReactPortal, useEffect, useState} from 'react'
import {createPortal} from 'react-dom'

const Portal: FC = ({children}): ReactPortal => {
  const [container] = useState(document.createElement('div'))

  useEffect(() => {
    document.body.appendChild(container)
    return () => {
      document.body.removeChild(container)
    }
  }, [])

  return createPortal(children, container)
}

export default Portal
