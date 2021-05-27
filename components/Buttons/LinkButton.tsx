import {FC, ReactNode} from 'react'
import Button from './Button'

interface Props {
  onClick: () => void
  label: string
  children?: ReactNode
  className?: string
}

const LinkButton: FC<Props> = ({onClick, label, children, className}) => {
  return (
    <Button
      onClick={onClick}
      className={`text-body-3 text-brand-b1 ${className}`}>
      {children}
      <span className='capitalize-first whitespace-nowrap'>{label}</span>
    </Button>
  )
}
export default LinkButton
