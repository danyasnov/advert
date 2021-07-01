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
      className={`px-12 py-3 border border-shadow-b rounded-lg ${
        className || ''
      }`}
      onClick={onClick}>
      {children}
    </Button>
  )
}
export default OutlineButton
