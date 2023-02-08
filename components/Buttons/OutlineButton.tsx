import {FC, ReactNode} from 'react'
import Button from './Button'

interface Props {
  children?: ReactNode
  className?: string
  onClick?: () => void
  id?: string
  isSmall?: boolean
}
const OutlineButton: FC<Props> = ({
  children,
  className,
  onClick,
  id,
  isSmall,
}) => {
  return (
    <Button
      id={id}
      className={`${
        isSmall ? 'py-[11px] px-4' : 'px-8 py-4.5'
      }  border border-greyscale-200 rounded-2xl bg-white text-greyscale-900 text-body-16 font-semibold ${
        className || ''
      }`}
      onClick={onClick}>
      {children}
    </Button>
  )
}
export default OutlineButton
