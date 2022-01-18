import {FC, useState} from 'react'
import {BottomSheet} from 'react-spring-bottom-sheet'
import {useTranslation} from 'next-i18next'
import {SelectProps} from './Select'
import Button from '../Buttons/Button'
import IcSearch from '*.svg'

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
        className='border border-nc-border h-10 rounded-lg w-full'
        onClick={() => setOpen(true)}>
        <div className='flex w-full'>{placeholder}</div>
      </Button>
      <BottomSheet
        open={open}
        onDismiss={() => {
          setOpen(false)
        }}
        snapPoints={({maxHeight}) => maxHeight - 40}>
        <div className='flex flex-col items-center justify-center w-full px-4'>
          <h3 className='text-h-3 font-medium text-nc-title mb-6'>
            {t('INSPECTION_PLACE')}
          </h3>
          {/* <input */}
          {/*  defaultValue={label} */}
          {/*  onChange={onInputValueChange} */}
          {/*  className='h-12 rounded-xl border border-nc-border py-3 px-4 w-full mb-2' */}
          {/* /> */}
          {/* {searchResults.map((r) => ( */}
          {/*  <Button */}
          {/*    className='h-12 w-full' */}
          {/*    onClick={() => { */}
          {/*      handleSelectLocation(r) */}
          {/*      setOpen(false) */}
          {/*      setSearchResults([]) */}
          {/*    }}> */}
          {/*    <div className='flex w-full items-center'> */}
          {/*      <IcSearch className='w-5 h-5 fill-current text-nc-icon mr-2' /> */}
          {/*      <span className='truncate w-full text-left text-body-1 text-nc-title'> */}
          {/*        {r.label} */}
          {/*      </span> */}
          {/*    </div> */}
          {/*  </Button> */}
          {/* ))} */}
        </div>
      </BottomSheet>
    </div>
  )
}

export default MobileSelect
