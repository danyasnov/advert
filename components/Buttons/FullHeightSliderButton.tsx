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
      className={`h-full text-primary-500 overflow-hidden flex-shrink-0 ${
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
