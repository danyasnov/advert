import {FC, ReactNode} from 'react'
import Button from './Button'

interface Props {
  children?: ReactNode
  className?: string
  onClick: () => void
}
const OutlineButton: FC<Props> = ({children, className, onClick}) => {
  return (
    <Button
      className={`px-6 py-3 border border-shadow-b rounded-lg text-nc-title text-body-2 ${
        className || ''
      }`}
      onClick={onClick}>
      {children}
    </Button>
  )
}
export default OutlineButton
