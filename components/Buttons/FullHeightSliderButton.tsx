import {FC} from 'react'
import {ChevronLeft, ChevronRight} from 'react-iconly'
import Button from './Button'

interface Props {
  className?: string
  direction: 'left' | 'right'
  enabled: boolean
  onClick: () => void
  size: number
}
const FullHeightSliderButton: FC<Props> = ({
  direction,
  enabled,
  onClick,
  className,
  size,
}) => {
  if (!enabled) return null
  return (
    <Button
      onClick={onClick}
      className={`w-16 l:w-24 h-full text-primary-500 overflow-hidden ${
        direction === 'left' ? 'rounded-l-xl' : 'rounded-r-xl'
      } ${className || ''}`}>
      {direction === 'left' ? (
        <ChevronLeft size={size} />
      ) : (
        <ChevronRight size={size} />
      )}
    </Button>
  )
}
export default FullHeightSliderButton
