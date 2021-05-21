import {FC, ReactNode} from 'react'
import Button from './Button'
import IcKeyboardArrowRight from '../assets/icons/material/KeyboardArrowRight.svg'
import IcKeyboardArrowLeft from '../assets/icons/material/KeyboardArrowLeft.svg'

interface Props {
  children?: ReactNode
  className?: string
  direction: 'left' | 'right'
  enabled: boolean
  onClick: () => void
}
const SliderButton: FC<Props> = ({direction, enabled, onClick, className}) => {
  if (!enabled) return null
  return (
    <Button
      onClick={onClick}
      className={`w-8 h-8 bg-white rounded-full shadow-2xl ${className}`}>
      {direction === 'left' ? (
        <IcKeyboardArrowLeft className='fill-current text-black-c w-4 h-4' />
      ) : (
        <IcKeyboardArrowRight className='fill-current text-black-c w-4 h-4' />
      )}
    </Button>
  )
}
export default SliderButton
