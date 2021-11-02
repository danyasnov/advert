import {FC, MouseEventHandler, ReactNode} from 'react'

interface Props {
  children?: ReactNode
  className?: string
  type?: 'button' | 'submit' | 'reset'
  onClick?: MouseEventHandler<HTMLButtonElement>
}
const Button: FC<Props> = ({children, className, onClick, type = 'button'}) => {
  return (
    <button
      // eslint-disable-next-line react/button-has-type
      type={type}
      className={`flex items-center justify-center ${className || ''}`}
      onClick={onClick}>
      {children}
    </button>
  )
}
export default Button
