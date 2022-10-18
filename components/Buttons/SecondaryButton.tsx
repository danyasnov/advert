import {FC, ReactNode} from 'react'
import Button from './Button'
import {disabledClass} from './styles'

interface Props {
  children?: ReactNode
  className?: string
  id?: string
  onClick?: () => void
  disabled?: boolean
}

const SecondaryButton: FC<Props> = ({
  children,
  className,
  onClick,
  id,
  disabled = false,
}) => {
  return (
    <Button
      id={id}
      className={`rounded-2xl py-3.5 px-3.5 text-body-14 text-primary-500 bg-primary-100 font-bold ${
        disabled ? disabledClass : ''
      } ${className || ''}`}
      onClick={() => !disabled && onClick && onClick()}>
      {children}
    </Button>
  )
}
export default SecondaryButton
