import {FC} from 'react'
import {observer} from 'mobx-react-lite'
import {useRouter} from 'next/router'
import HeaderFooterWrapper from './HeaderFooterWrapper'
import {useCountriesStore} from '../../providers/RootStoreProvider'
import LocationSelector from '../LocationSelector'
import {getQueryValue} from '../../helpers'

interface Props {
  subtitle: string
}
const LocationContents: FC<Props> = observer(({subtitle}) => {
  const {locationsByAlphabet, countries, regions} = useCountriesStore()
  const {query, push} = useRouter()
  const countryCode = getQueryValue(query, 'countryCode')
  let title
  if (countryCode) {
    title = countries.find((c) => c.id === countryCode)?.title ?? ''
  }
  return (
    <HeaderFooterWrapper>
      <div className='bg-white px-4 s:px-8 flex'>
        <div className='m:flex m:space-x-12 l:space-x-6 m:mx-auto s:w-full justify-center w-full'>
          <main className='w-full'>
            <LocationSelector
              title={title}
              subTitle={subtitle}
              items={locationsByAlphabet}
              showAllLink={`/${countryCode}/all`}
              onSelect={(item) => {
                push(item.href)
              }}
            />
          </main>
        </div>
      </div>
    </HeaderFooterWrapper>
  )
})

export default LocationContents
