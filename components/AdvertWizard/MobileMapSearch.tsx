import {FC, useCallback, useEffect, useState} from 'react'
import {debounce, isEmpty} from 'lodash'
import {useRouter} from 'next/router'
import {ArrowLeft, Search} from 'react-iconly'
import {TypeOfDegradation} from 'front-api/src/models'
import {makeRequest} from '../../api'
import Button from '../Buttons/Button'
import InlineMapRadiusSelector from '../InlineMapRadiusSelector'

interface Props {
  handleSelectLocation: (item: {
    label: string
    geometry: {location: {lat: number; lng: number}}
  }) => void
  label: string
  radius: number
  setRadius: (radius: number, key: TypeOfDegradation) => void
}

const MobileMapSearch: FC<Props> = ({
  label,
  handleSelectLocation,
  radius,
  setRadius,
}) => {
  const {push} = useRouter()
  const [searchResults, setSearchResults] = useState([])
  const [search, setSearch] = useState(label)

  useEffect(() => {
    setSearch(label)
  }, [label])
  const onSearch = useCallback((text) => {
    if (!text) {
      setSearchResults([])
    } else {
      makeRequest({
        method: 'get',
        url: '/api/location-text-search',
        params: {query: text},
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
  }, [])
  const divider = <div className='border-greyscale-200 border-b w-full' />
  return (
    <div className='bg-white rounded-xl w-full flex flex-col items-center pt-4'>
      <div className='flex justify-center pb-3 px-4  w-full space-x-3'>
        <Button
          onClick={() => {
            push('/')
          }}>
          <ArrowLeft size={20} />
        </Button>
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
          }}
          className='font-normal text-greyscale-800 text-body-16 outline-none w-full'
        />
        <Button
          onClick={() => {
            onSearch(search)
          }}>
          <Search size={20} />
        </Button>
      </div>
      <div className='w-full px-4'>{divider}</div>
      <div className='w-full'>
        {searchResults.map((r, index) => (
          <div className='px-4'>
            <Button
              className='w-full py-4'
              onClick={() => {
                handleSelectLocation(r)
                setSearch(label)
                setSearchResults([])
              }}>
              <div className='flex w-full items-center justify-start'>
                <span className='truncate w-full text-left text-body-14 text-greyscale-900'>
                  {r.label}
                </span>
              </div>
            </Button>
            {index + 1 !== searchResults.length && divider}
          </div>
        ))}
        {isEmpty(searchResults) && (
          <div className='flex justify-center pt-3 pb-4'>
            <InlineMapRadiusSelector radius={radius} setRadius={setRadius} />
          </div>
        )}
      </div>
    </div>
  )
}

export default MobileMapSearch
