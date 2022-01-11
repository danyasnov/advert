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
      className={`rounded-lg py-3 px-3.5 border border-shadow-b h-10 text-body-2 text-black-b ${
        disabled ? disabledClass : ''
      } ${className || ''}`}
      onClick={() => !disabled && onClick && onClick()}>
      {children}
    </Button>
  )
}
export default SecondaryButton
