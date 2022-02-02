import {FC, MouseEventHandler, ReactNode} from 'react'
import Button from './Button'
import {disabledClass} from './styles'

interface Props {
  children?: ReactNode
  className?: string
  type?: 'button' | 'submit' | 'reset'
  onClick?: MouseEventHandler<HTMLButtonElement>
  disabled?: boolean
  id?: string
}

const PrimaryButton: FC<Props> = ({
  children,
  className,
  onClick,
  id,
  type,
  disabled = false,
}) => {
  return (
    <Button
      id={id}
      className={`rounded-lg py-3 px-6 text-body-2 text-white-a ${
        disabled ? disabledClass : 'nc-gradient-brand'
      } ${className || ''}`}
      type={type}
      disabled={disabled}
      onClick={(e) => !disabled && onClick && onClick(e)}>
      {children}
    </Button>
  )
}
export default PrimaryButton
