import {FC, MouseEventHandler, ReactNode} from 'react'

interface Props {
  children?: ReactNode
  className?: string
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  onClick?: MouseEventHandler<HTMLButtonElement>
  id?: string
}
const Button: FC<Props> = ({
  children,
  className,
  onClick,
  type = 'button',
  disabled,
  id,
}) => {
  return (
    <button
      // eslint-disable-next-line react/button-has-type
      type={type}
      className={`flex items-center justify-center ${className || ''}`}
      disabled={disabled}
      data-test-id={id}
      onClick={onClick}>
      {children}
    </button>
  )
}
export default Button
