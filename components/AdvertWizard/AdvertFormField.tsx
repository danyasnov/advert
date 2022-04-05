import {FC} from 'react'
import Tip from './Tip'

interface Props {
  body
  className?: string
  hide?: boolean
}
const AdvertFormField: FC<Props> = ({body, className, hide}) => {
  if (hide) return null
  return <div className={`flex-col flex w-full ${className || ''}`}>{body}</div>
}

export default AdvertFormField
