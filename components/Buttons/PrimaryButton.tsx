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
  isSmall?: boolean
}

const PrimaryButton: FC<Props> = ({
  children,
  className,
  onClick,
  id,
  type,
  disabled = false,
  isSmall,
}) => {
  return (
    <Button
      id={id}
      className={`rounded-2xl text-body-14 ${
        isSmall ? 'py-[11px] px-4 font-semibold' : 'py-3.5 px-6 font-bold'
      } ${disabled ? disabledClass : 'bg-primary-500 text-white'} ${
        className || ''
      }`}
      type={type}
      disabled={disabled}
      onClick={(e) => !disabled && onClick && onClick(e)}>
      {children}
    </Button>
  )
}
export default PrimaryButton
