import {FC, useCallback, useState} from 'react'
import {useTranslation} from 'next-i18next'
import {BottomSheet} from 'react-spring-bottom-sheet'
import {debounce} from 'lodash'
import IcSearch from 'icons/material/Search2.svg'
import IcClear from 'icons/material/Clear.svg'
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
  const [search, setSearch] = useState(label)
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

  const onClose = () => {
    setOpen(false)
    setSearch(label)
  }
  return (
    <div className='bg-white rounded-2xl w-full flex flex-col items-center px-2'>
      <h3 className='text-h-5 text-h-6 font-medium	mb-2 mt-4'>
        {t('INSPECTION_PLACE')}
      </h3>
      <span className='text-nc-primary-text text-body-12 mb-3'>
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
          onClose()
        }}
        snapPoints={({maxHeight}) => maxHeight - 40}>
        <div className='flex flex-col items-center justify-center w-full px-4'>
          <h3 className='text-h-6 font-medium text-nc-title mb-6'>
            {t('INSPECTION_PLACE')}
          </h3>
          <div className='relative w-full'>
            <input
              value={search}
              onChange={(e) => {
                onInputValueChange(e)
                setSearch(e.target.value)
              }}
              className='h-12 rounded-xl border border-nc-border py-3 pl-4 pr-8 w-full mb-2'
            />
            {!!search && (
              <Button
                className='absolute right-2 bottom-5'
                onClick={() => setSearch('')}>
                <IcClear className='fill-current text-black-c w-6 h-6 ' />
              </Button>
            )}
          </div>
          {searchResults.map((r) => (
            <Button
              className='h-12 w-full'
              onClick={() => {
                handleSelectLocation(r)
                onClose()
                setSearchResults([])
              }}>
              <div className='flex w-full items-center'>
                <IcSearch className='w-5 h-5 fill-current text-nc-icon mr-2' />
                <span className='truncate w-full text-left text-body-16 text-nc-title'>
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
