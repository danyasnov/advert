import {FC, ReactNode} from 'react'
import IcKeyboardArrowRight from 'icons/material/KeyboardArrowRight.svg'
import IcKeyboardArrowLeft from 'icons/material/KeyboardArrowLeft.svg'
import Button from './Button'

interface Props {
  children?: ReactNode
  className?: string
  direction: 'left' | 'right'
  enabled: boolean
  onClick: () => void
}
const FullHeightSliderButton: FC<Props> = ({
  direction,
  enabled,
  onClick,
  className,
}) => {
  if (!enabled) return null
  return (
    <Button
      onClick={onClick}
      className={`w-16 h-full hover:bg-shadow-a ${className || ''}`}>
      {direction === 'left' ? (
        <IcKeyboardArrowLeft className='fill-current text-white w-10 h-10' />
      ) : (
        <IcKeyboardArrowRight className='fill-current text-white w-10 h-10' />
      )}
    </Button>
  )
}
export default FullHeightSliderButton
