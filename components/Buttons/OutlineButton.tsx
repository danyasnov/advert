import {FC, ReactNode} from 'react'
import Button from './Button'

interface Props {
  children?: ReactNode
  className?: string
  onClick?: () => void
  id?: string
}
const OutlineButton: FC<Props> = ({children, className, onClick, id}) => {
  return (
    <Button
      id={id}
      className={`px-8 py-4.5 border border-greyscale-200 rounded-2xl background-white text-greyscale-900 text-body-16 font-semibold shadow-lg ${
        className || ''
      }`}
      onClick={onClick}>
      {children}
    </Button>
  )
}
export default OutlineButton
