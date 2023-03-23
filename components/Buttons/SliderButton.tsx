import {FC, ReactNode} from 'react'
import IcKeyboardArrowRight from 'icons/material/KeyboardArrowRight.svg'
import IcKeyboardArrowLeft from 'icons/material/KeyboardArrowLeft.svg'
import Button from './Button'

interface Props {
  className?: string
  direction: 'left' | 'right'
  disabled?: boolean
  hide?: boolean
  onClick: () => void
}
const SliderButton: FC<Props> = ({
  direction,
  disabled,
  hide,
  onClick,
  className,
}) => {
  if (hide) return null
  return (
    <Button
      disabled={disabled}
      onClick={onClick}
      className={`w-8 h-8 shrink-0 bg-primary-500 rounded-full shadow-xl ${
        className || ''
      }`}>
      {direction === 'left' ? (
        <IcKeyboardArrowLeft className='fill-current text-white w-6 h-6' />
      ) : (
        <IcKeyboardArrowRight className='fill-current text-white w-6 h-6' />
      )}
    </Button>
  )
}
export default SliderButton
