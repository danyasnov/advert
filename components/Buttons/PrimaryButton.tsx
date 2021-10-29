import {FC, ReactNode} from 'react'
import Button from './Button'
import {disabledClass} from './styles'

interface Props {
  children?: ReactNode
  className?: string
  type?: 'button' | 'submit' | 'reset'
  onClick?: () => void
  disabled?: boolean
}

const PrimaryButton: FC<Props> = ({
  children,
  className,
  onClick,
  type,
  disabled = false,
}) => {
  return (
    <Button
      className={`rounded-lg py-3 px-6 text-body-2 text-white-a ${
        disabled ? disabledClass : 'nc-gradient-brand'
      } ${className || ''}`}
      type={type}
      onClick={() => !disabled && onClick && onClick()}>
      {children}
    </Button>
  )
}
export default PrimaryButton
