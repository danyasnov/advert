import {FC, ReactNode} from 'react'

interface Props {
  children?: ReactNode
  className?: string
  onClick: () => void
}
const Button: FC<Props> = ({children, className, onClick}) => {
  return (
    <button
      type='button'
      className={`flex items-center justify-center ${className || ''}`}
      onClick={onClick}>
      {children}
    </button>
  )
}
export default Button
