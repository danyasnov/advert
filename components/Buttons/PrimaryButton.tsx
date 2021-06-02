import {FC, ReactNode} from 'react'
import Button from './Button'
import {disabledClass} from './styles'

interface Props {
  children?: ReactNode
  className?: string
  onClick: () => void
  disabled?: boolean
}

const PrimaryButton: FC<Props> = ({children, className, onClick, disabled}) => {
  return (
    <Button
      className={`rounded-2xl py-3 px-3.5 text-body-2 bg-brand-a1 text-white-a ${
        disabled ? disabledClass : ''
      } ${className || ''}`}
      onClick={onClick}>
      {children}
    </Button>
  )
}
export default PrimaryButton
