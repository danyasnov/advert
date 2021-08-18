import {FC} from 'react'
import {observer} from 'mobx-react-lite'
import {useRouter} from 'next/router'
import Head from 'next/head'
import {useTranslation} from 'next-i18next'
import HeaderFooterWrapper from './HeaderFooterWrapper'
import {useCountriesStore} from '../../providers/RootStoreProvider'
import LocationSelector from '../LocationSelector'
import {getQueryValue} from '../../helpers'

interface Props {
  subtitle: string
}
const LocationContents: FC<Props> = observer(({subtitle}) => {
  const {locationsByAlphabet, countries} = useCountriesStore()
  const {query, push} = useRouter()
  const countryCode = getQueryValue(query, 'countryCode')
  const {t} = useTranslation()
  let title
  if (countryCode) {
    title = countries.find((c) => c.isoCode === countryCode)?.title ?? ''
  }
  const seoString = title
    ? t('LOCATION_PAGE_TITLE', {location: title})
    : t('COUNTRIES_PAGE_TITLE')
  return (
    <>
      <Head>
        <title>{seoString}</title>
        <meta name='description' content={seoString} />
      </Head>
      <HeaderFooterWrapper>
        <div className='bg-white px-4 s:px-8 flex'>
          <div className='m:flex m:space-x-12 l:space-x-6 m:mx-auto s:w-full justify-center w-full'>
            <main className='w-full'>
              <LocationSelector
                title={title || seoString}
                subTitle={subtitle}
                items={locationsByAlphabet}
                showAllLink={countryCode ? `/${countryCode}/all` : '/all/all'}
                onSelect={(item) => {
                  push(item.href)
                }}
              />
            </main>
          </div>
        </div>
      </HeaderFooterWrapper>
    </>
  )
})

export default LocationContents
