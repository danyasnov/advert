import {FC, useState} from 'react'
import {BottomSheet} from 'react-spring-bottom-sheet'
import {useTranslation} from 'next-i18next'
import IcArrowDropDown from 'icons/material/ArrowDropDown.svg'
import {isArray, isEmpty, size} from 'lodash'
import IcCheck from 'icons/material/Check.svg'
import IcSearch from 'icons/material/Search.svg'
import {SelectProps} from './Select'
import Button from '../Buttons/Button'
import SecondaryButton from '../Buttons/SecondaryButton'
import PrimaryButton from '../Buttons/PrimaryButton'

const MobileSelect: FC<SelectProps> = ({
  options,
  placeholder,
  onChange,
  value,
  isSearchable,
  isMulti,
  isInvalid,
}) => {
  const {t} = useTranslation()
  const [open, setOpen] = useState(false)
  const [filtered, setFiltered] = useState(options)
  const [filter, setFilter] = useState('')
  const [height, setHeight] = useState<number>()

  const onClose = () => {
    setFilter('')
    setFiltered(options)
    setOpen(false)
  }

  return (
    <div>
      <Button
        className={`border h-10 rounded-lg w-full ${
          isInvalid ? 'border-error' : 'border-shadow-b'
        }`}
        onClick={() => setOpen(true)}>
        <div className='flex justify-between items-center w-full px-3.5'>
          {isEmpty(value) ? (
            <>
              <span className='text-body-14 text-black-f'>{placeholder}</span>
              <IcArrowDropDown className='w-6 h-6 fill-current text-black-c -mr-2' />
            </>
          ) : (
            <span className='text-body-14 text-greyscale-900 truncate '>
              {isArray(value)
                ? value.map((v) => v.label).join(', ')
                : value.label}
            </span>
          )}
        </div>
      </Button>
      <BottomSheet
        open={open}
        onDismiss={() => {
          onClose()
        }}
        snapPoints={({minHeight}) => {
          if (!height) {
            setHeight(minHeight)
            return minHeight
          }
          return height
        }}>
        <div className='flex flex-col items-center justify-center w-full'>
          <div className='fixed top-5 bg-white w-full flex flex-col items-center'>
            <h3 className='text-h-6 font-medium text-greyscale-900 mb-2 px-4'>
              {placeholder}
            </h3>
            {isSearchable && (
              <div className='w-full px-4 relative'>
                <IcSearch className='w-6 h-6 absolute top-3 left-5 text-greyscale-800' />
                <input
                  className='w-full h-12 border border-nc-border flex rounded-lg py-4 pr-4 pl-8 text-greyscale-900'
                  placeholder={t('SEARCH')}
                  value={filter}
                  onChange={({target}) => {
                    setFilter(target.value)
                    setFiltered(
                      options.filter((o) => {
                        return o.label
                          .toLowerCase()
                          .includes(target.value.toLowerCase())
                      }),
                    )
                  }}
                />
              </div>
            )}
          </div>
          <div
            className={`w-full flex flex-col ${isMulti ? 'mb-20' : 'mb-10'} ${
              isSearchable ? 'mt-20' : 'mt-10'
            }`}>
            {open &&
              filtered.map((f) => (
                <Button
                  // @ts-ignore
                  disabled={f.disabled}
                  key={f.value}
                  className={`w-full px-4 border-b border-nc-border h-12 ${
                    // @ts-ignore
                    f.disabled ? 'text-greyscale-900' : ''
                  }`}
                  onClick={() => {
                    if (isMulti) {
                      // @ts-ignore
                      const newFiltered = value.filter(
                        (v) => v.value !== f.value,
                      )
                      if (size(value) !== size(newFiltered)) {
                        onChange(newFiltered)
                      } else {
                        // @ts-ignore
                        onChange([...value, f])
                      }
                    } else {
                      onChange(f)
                      onClose()
                    }
                  }}>
                  <div className='w-full flex items-center justify-between'>
                    <span className='text-body-16 text-nc-text-primary'>
                      {f.label}
                    </span>
                    {isMulti && !f.disabled && (
                      <>
                        <input
                          type='checkbox'
                          readOnly
                          checked={
                            // @ts-ignore
                            !!value.find((v) => v.value === f.value)
                          }
                          className='opacity-0 absolute h-4.5 w-4.5 cursor-pointer'
                        />
                        <div className='bg-white border-2 rounded border-black-d h-4.5 w-4.5 flex shrink-0 justify-center items-center mr-2'>
                          <IcCheck className='fill-current text-black-c h-4.5 w-4.5 hidden' />
                        </div>
                      </>
                    )}
                    {f.value === value?.value && !isMulti && (
                      <IcCheck className='fill-current text-primary-500 h-4 w-4' />
                    )}
                  </div>
                </Button>
              ))}
          </div>
          {isMulti && (
            <div className='h-20 flex w-full fixed bottom-0 p-4 space-x-2 bg-white'>
              <SecondaryButton
                className='w-full h-full'
                onClick={() => {
                  setFilter('')
                  setFiltered(options)
                  // @ts-ignore
                  onChange([])
                }}>
                {t('RESET')}
              </SecondaryButton>
              <PrimaryButton className='w-full' onClick={onClose}>
                {t('DONE')}
              </PrimaryButton>
            </div>
          )}
        </div>
      </BottomSheet>
    </div>
  )
}

export default MobileSelect
