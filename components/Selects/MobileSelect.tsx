import {FC, useState} from 'react'
import {BottomSheet} from 'react-spring-bottom-sheet'
import {useTranslation} from 'next-i18next'
import IcArrowDropDown from 'icons/material/ArrowDropDown.svg'
import {isArray, isEmpty, size} from 'lodash'
import {FixedSizeList} from 'react-window'
import IcCheck from 'icons/material/Check.svg'
import IcSearch from 'icons/material/Search.svg'
import {useWindowSize} from 'react-use'
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
  isDisabled,
  isClearable,
  isMulti,
  id,
  isInvalid,
}) => {
  const {t} = useTranslation()
  const [open, setOpen] = useState(false)
  const [filtered, setFiltered] = useState(options)
  const [filter, setFilter] = useState('')

  const {height} = useWindowSize()
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
              <span className='text-body-2 text-black-f'>{placeholder}</span>
              <IcArrowDropDown className='w-6 h-6 fill-current text-black-c -mr-2' />
            </>
          ) : (
            <span className='text-body-2 text-nc-title truncate '>
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
        snapPoints={({maxHeight}) => maxHeight - 40}>
        <div className='flex flex-col items-center justify-center w-full relative'>
          <div className='fixed top-3 pt-5 w-full flex items-center flex-col bg-white z-10 bg-white'>
            <h3 className='text-h-3 font-medium text-nc-title pb-2 px-4'>
              {placeholder}
            </h3>
            {isSearchable && (
              <div className='w-full px-4 relative'>
                <IcSearch className='w-6 h-6 absolute top-3 left-5 text-nc-icon' />
                <input
                  className='w-full h-12 border border-nc-border flex rounded-lg py-4 pr-4 pl-8 text-nc-title'
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
          <div className={`w-full ${isSearchable ? 'pt-24' : 'pt-12'}`}>
            <FixedSizeList
              height={isSearchable ? height - 160 : height - 190}
              itemCount={size(filtered)}
              itemSize={48}
              width='100%'>
              {({index, style}) => (
                <div style={style}>
                  <Button
                    // @ts-ignore
                    disabled={filtered[index].disabled}
                    key={filtered[index].value}
                    className={`w-full px-4 border-b border-nc-border h-12 ${
                      // @ts-ignore
                      filtered[index].disabled ? 'text-nc-secondary-text' : ''
                    }`}
                    onClick={() => {
                      // debugger
                      if (isMulti) {
                        // @ts-ignore
                        const newFiltered = value.filter(
                          (v) => v.value !== filtered[index].value,
                        )
                        if (size(value) !== size(newFiltered)) {
                          onChange(newFiltered)
                        } else {
                          // @ts-ignore
                          onChange([...value, filtered[index]])
                        }
                      } else {
                        onChange(filtered[index])
                        onClose()
                      }
                    }}>
                    <div className='w-full flex items-center justify-between'>
                      <span className='text-body-1 text-nc-text-primary'>
                        {filtered[index].label}
                      </span>
                      {isMulti && (
                        <>
                          <input
                            type='checkbox'
                            readOnly
                            checked={
                              // @ts-ignore
                              !!value.find(
                                (v) => v.value === filtered[index].value,
                              )
                            }
                            className='opacity-0 absolute h-4.5 w-4.5 cursor-pointer'
                          />
                          <div className='bg-white border-2 rounded border-black-d h-4.5 w-4.5 flex shrink-0 justify-center items-center mr-2'>
                            <IcCheck className='fill-current text-black-c h-4.5 w-4.5 hidden' />
                          </div>
                        </>
                      )}
                      {filtered[index].value === value?.value && !isMulti && (
                        <IcCheck className='fill-current text-nc-primary h-4 w-4' />
                      )}
                    </div>
                  </Button>
                </div>
              )}
            </FixedSizeList>
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
