import React, {Dispatch, FC, ReactElement, useState} from 'react'
import {CloseSquare} from 'react-iconly'
import {BottomSheet} from 'react-spring-bottom-sheet'
import Button from './Buttons/Button'

interface Props {
  label: string
  labelIcon?: ReactElement
  renderOptions: (setOpen: Dispatch<boolean>) => ReactElement
}
const BottomSheetDropdown: FC<Props> = ({label, labelIcon, renderOptions}) => {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <Button
        className='text-body-12 space-x-2 text-greyscale-900 border border-greyscale-300 w-full py-2.5 rounded-lg'
        onClick={() => {
          setOpen(true)
        }}>
        {!!labelIcon && labelIcon}
        <span>{label}</span>
      </Button>
      <BottomSheet
        open={open}
        onDismiss={() => {
          setOpen(false)
        }}>
        <div className='flex flex-col items-center justify-center w-full'>
          <div className='fixed top-5 bg-white w-full flex flex-col pt-3'>
            <div className='flex w-full px-4 text-center relative'>
              <h3 className='text-h-6 font-medium text-greyscale-900 w-full'>
                {label}
              </h3>
              <Button
                className='text-primary-500 absolute inset-y-0 right-4'
                onClick={() => {
                  setOpen(false)
                }}>
                <CloseSquare size={24} />
              </Button>
            </div>
          </div>
          <div className='w-full flex flex-col mt-10 mb-5'>
            {renderOptions(setOpen)}
          </div>
        </div>
      </BottomSheet>
    </div>
  )
}

export default BottomSheetDropdown
