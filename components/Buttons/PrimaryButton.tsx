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
      className={`rounded-lg py-3 px-3.5 text-body-2 bg-brand-a1 text-white-a ${
        disabled ? disabledClass : ''
      } ${className || ''}`}
      type={type}
      onClick={() => !disabled && onClick()}>
      {children}
    </Button>
  )
}
export default PrimaryButton
