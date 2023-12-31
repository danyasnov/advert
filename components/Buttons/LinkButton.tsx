import {FC, ReactNode} from 'react'
import Button from './Button'

interface Props {
  onClick?: () => void
  label?: string
  children?: ReactNode
  className?: string
  nowrap?: boolean
}

const LinkButton: FC<Props> = ({
  onClick,
  label,
  children,
  className,
  nowrap = true,
}) => {
  return (
    <Button
      onClick={onClick}
      className={`text-body-14 text-primary-500 font-bold ${className || ''}`}>
      {children}
      {label && (
        <span
          className={`capitalize-first ${
            nowrap ? 'whitespace-nowrap' : 'whitespace-normal'
          }`}>
          {label}
        </span>
      )}
    </Button>
  )
}
export default LinkButton
