import {FC, ReactNode} from 'react'
import IcKeyboardArrowRight from 'icons/material/KeyboardArrowRight.svg'
import IcKeyboardArrowLeft from 'icons/material/KeyboardArrowLeft.svg'
import {ArrowLeft, ChevronLeft, ChevronRight} from 'react-iconly'
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
      className={`w-16 h-full text-primary-500 overflow-hidden ${
        direction === 'left' ? 'rounded-l-xl' : 'rounded-r-xl'
      } ${className || ''}`}>
      {direction === 'left' ? (
        <ChevronLeft size={40} />
      ) : (
        <ChevronRight size={40} />
      )}
    </Button>
  )
}
export default FullHeightSliderButton
