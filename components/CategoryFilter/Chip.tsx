import React, {FC, ReactElement, useEffect, useState} from 'react'
import {CloseSquare} from 'react-iconly'
import {BottomSheet} from 'react-spring-bottom-sheet'
import {useTranslation} from 'next-i18next'
import Button from '../Buttons/Button'
import SecondaryButton from '../Buttons/SecondaryButton'
import PrimaryButton from '../Buttons/PrimaryButton'
import ChipButton from '../Buttons/ChipButton'

interface IChip {
  name: string
  chipTitle: string
  hasValue: boolean
  value: any
  onChange: (value) => void
  validate?: (value) => string
  fixHeight?: boolean
  children: ({
    value,
    onChange,
  }: {
    value: any
    onChange: React.Dispatch<any>
  }) => ReactElement
}

const Chip: FC<IChip> = ({
  children,
  name,
  chipTitle,
  hasValue,
  onChange,
  value,
  validate,
  fixHeight,
}) => {
  const [temp, setTemp] = useState(value)
  useEffect(() => {
    setTemp(value)
  }, [value])
  const {t} = useTranslation()
  const [height, setHeight] = useState<number>(0)
  const [error, setError] = useState('')
  const [open, setOpen] = useState(false)
  return (
    <div>
      <ChipButton onClick={() => setOpen(true)} selected={hasValue}>
        {chipTitle}
      </ChipButton>
      <BottomSheet
        open={open}
        onDismiss={() => {
          setOpen(false)
          setError('')
        }}
        snapPoints={(state) => {
          const {minHeight} = state
          if (fixHeight) {
            if (!height || minHeight > height) {
              setHeight(minHeight)
              return minHeight
            }
            return height
          }
          return minHeight
        }}
        header={
          <div className='bg-white w-full flex flex-col py-5'>
            <div className='flex w-full mb-2 px-4 text-center relative'>
              <h3 className='text-h-6 font-medium text-greyscale-900 w-full'>
                {name}
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
        }
        footer={
          <div className='h-20 flex w-full p-4 space-x-2 bg-white drop-shadow-card'>
            <SecondaryButton
              className='w-full h-full'
              disabled={!hasValue}
              onClick={() => {
                setOpen(false)
                setTemp(value)
                setError('')
              }}>
              {t('CANCEL')}
            </SecondaryButton>
            <PrimaryButton
              className='w-full'
              onClick={() => {
                if (validate) {
                  const e = validate(temp)
                  if (e) {
                    return setError(e)
                  }
                }
                setError('')

                setOpen(false)
                onChange(temp)
              }}>
              {t('DONE')}
            </PrimaryButton>
          </div>
        }>
        <div className='flex flex-col w-full'>
          {children({value: temp, onChange: setTemp})}
          {error && (
            <span className='mx-4 text-body-12 text-error mb-1'>{error}</span>
          )}
        </div>
      </BottomSheet>
    </div>
  )
}

export default Chip
