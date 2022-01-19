import {FC, useState} from 'react'
import {BottomSheet} from 'react-spring-bottom-sheet'
import {useTranslation} from 'next-i18next'
import IcArrowDropDown from 'icons/material/ArrowDropDown.svg'
import {isArray, isEmpty, size} from 'lodash'
import {FixedSizeList} from 'react-window'
import IcCheck from 'icons/material/Check.svg'
import {SelectProps} from './Select'
import Button from '../Buttons/Button'

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
  components,
}) => {
  const {t} = useTranslation()
  const [open, setOpen] = useState(false)

  return (
    <div>
      <Button
        className='border border-shadow-b h-10 rounded-lg w-full'
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
          setOpen(false)
        }}
        snapPoints={({maxHeight}) => maxHeight - 40}>
        <div className='flex flex-col items-center justify-center w-full '>
          <h3 className='text-h-3 font-medium text-nc-title mb-6 px-4'>
            {placeholder}
          </h3>
          <div className='w-full'>
            <FixedSizeList
              height={896}
              itemCount={size(options)}
              itemSize={48}
              width='100%'>
              {({index, style}) => (
                <div style={style}>
                  <Button
                    key={options[index].value}
                    className='w-full px-4 border-b border-nc-border h-12 '
                    onClick={() => {
                      if (isMulti) {
                        // @ts-ignore
                        const filtered = value.filter(
                          (v) => v.value !== options[index].value,
                        )
                        if (size(value) !== size(filtered)) {
                          onChange(filtered)
                        } else {
                          // @ts-ignore
                          onChange([...value, options[index]])
                        }
                      } else {
                        onChange(options[index])
                        setOpen(false)
                      }
                    }}>
                    <div className='w-full flex items-center justify-between'>
                      <span className='text-body-1 text-nc-text-primary'>
                        {options[index].label}
                      </span>
                      {isMulti && (
                        <>
                          <input
                            type='checkbox'
                            readOnly
                            checked={
                              // @ts-ignore
                              !!value.find(
                                (v) => v.value === options[index].value,
                              )
                            }
                            className='opacity-0 absolute h-4.5 w-4.5 cursor-pointer'
                          />
                          <div
                            className='bg-white border-2 rounded border-black-d h-4.5 w-4.5 flex
       shrink-0 justify-center items-center mr-2'>
                            <IcCheck className='fill-current text-black-c h-4.5 w-4.5 hidden' />
                          </div>
                        </>
                      )}
                      {options[index].value === value?.value && !isMulti && (
                        <IcCheck className='fill-current text-nc-primary h-4 w-4' />
                      )}
                    </div>
                  </Button>
                </div>
              )}
            </FixedSizeList>
          </div>
        </div>
      </BottomSheet>
    </div>
  )
}

export default MobileSelect
