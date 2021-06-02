import {FC, ReactNode} from 'react'
import Button from './Button'
import {disabledClass} from './styles'

interface Props {
  children?: ReactNode
  className?: string
  onClick: () => void
  disabled?: boolean
}

const SecondaryButton: FC<Props> = ({
  children,
  className,
  onClick,
  disabled,
}) => {
  return (
    <Button
      className={`rounded-2xl py-3 px-3.5 border border-shadow-b text-body-2 text-black-b ${
        disabled ? disabledClass : ''
      } ${className || ''}`}
      onClick={onClick}>
      {children}
    </Button>
  )
}
export default SecondaryButton
