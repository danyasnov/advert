import {FC, useCallback, useState} from 'react'
import {useTranslation} from 'next-i18next'
import {BottomSheet} from 'react-spring-bottom-sheet'
import {debounce} from 'lodash'
import IcSearch from 'icons/material/Search2.svg'
import PrimaryButton from '../Buttons/PrimaryButton'
import {makeRequest} from '../../api'
import Button from '../Buttons/Button'

interface Props {
  handleSelectLocation: (item: {
    label: string
    geometry: {location: {lat: number; lng: number}}
  }) => void
  label: string
  onSubmit: () => void
}

const MobileMapSearch: FC<Props> = ({
  label,
  handleSelectLocation,
  onSubmit,
}) => {
  const [open, setOpen] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const {t} = useTranslation()
  const onInputValueChange = useCallback(
    debounce(({target}) => {
      if (!target.value) {
        setSearchResults([])
      } else {
        makeRequest({
          method: 'get',
          url: '/api/location-text-search',
          params: {query: target.value},
        }).then((res) => {
          setSearchResults(
            res.data.results
              .map((l) => ({
                label: l.formatted_address,
                value: l.place_id,
                geometry: l.geometry,
              }))
              .slice(0, 10),
          )
        })
      }
    }, 2000),
    [],
  )
  return (
    <div className='bg-white rounded-2xl w-full flex flex-col items-center px-2'>
      <h3 className='text-headline-8 text-h-3 font-medium	mb-2 mt-6'>
        {t('INSPECTION_PLACE')}
      </h3>
      <span className='text-nc-primary-text text-body-3 mb-3'>
        {t('INSPECTION_PLACE_TIP')}
      </span>
      <input
        value={label}
        onClick={() => setOpen(true)}
        className='h-12 rounded-xl border border-nc-border py-3 px-4 w-full mb-2'
      />
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
          <input
            defaultValue={label}
            onChange={onInputValueChange}
            className='h-12 rounded-xl border border-nc-border py-3 px-4 w-full mb-2'
          />
          {searchResults.map((r) => (
            <Button
              className='h-12 w-full'
              onClick={() => {
                handleSelectLocation(r)
                setOpen(false)
                setSearchResults([])
              }}>
              <div className='flex w-full items-center'>
                <IcSearch className='w-5 h-5 fill-current text-nc-icon mr-2' />
                <span className='truncate w-full text-left text-body-1 text-nc-title'>
                  {r.label}
                </span>
              </div>
            </Button>
          ))}
        </div>
      </BottomSheet>
      <PrimaryButton className='w-full mb-5' onClick={onSubmit}>
        {t('CONTINUE')}
      </PrimaryButton>
    </div>
  )
}

export default MobileMapSearch
