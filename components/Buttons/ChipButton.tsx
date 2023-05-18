import React, {FC} from 'react'
import Button from './Button'

interface Props {
  onClick: () => void
  selected?: boolean
}
const ChipButton: FC<Props> = ({onClick, selected, children}) => {
  return (
    <Button
      onClick={onClick}
      className={`flex items-center justify-center border-2 border-primary-500 rounded-full text-body-12 whitespace-nowrap px-4 py-2 font-medium ${
        selected ? 'text-white bg-primary-500' : 'text-primary-500'
      }`}>
      {children}
    </Button>
  )
}

export default ChipButton
