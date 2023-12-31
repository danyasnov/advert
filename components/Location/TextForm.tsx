import {FC, useEffect, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import {GeoPositionItemModel} from 'front-api/src/models/index'
import {AxiosResponse} from 'axios'
import {RestResponse} from 'front-api/src/api/request'
import {parseCookies} from 'nookies'
import {useRouter} from 'next/router'
import {useCountriesStore} from '../../providers/RootStoreProvider'
import Select, {SelectItem} from '../Selects/Select'
import Button from '../Buttons/Button'
import {makeRequest} from '../../api'
import SecondaryButton from '../Buttons/SecondaryButton'
import PrimaryButton from '../Buttons/PrimaryButton'
import {destroyCookiesWrapper, setCookiesObject} from '../../helpers'
import {CookiesState} from '../../types'

const fetchRegions = (countryId) => {
  return makeRequest({
    method: 'post',
    url: '/api/regions',
    data: {
      country: countryId,
    },
  }).then(
    (
      res: AxiosResponse<RestResponse<GeoPositionItemModel[]>>,
    ): SelectItem[] => {
      const {data} = res
      const items = data.result || []
      return items.map((r) => ({
        value: r.id,
        label: r.value,
        word: r.word,
        slug: r.slug,
      }))
    },
  )
}

const fetchCities = (regionId) => {
  return makeRequest({
    method: 'post',
    url: '/api/cities',
    data: {
      region: regionId,
    },
  }).then(
    (
      res: AxiosResponse<RestResponse<GeoPositionItemModel[]>>,
    ): (SelectItem & {hasAdverts: string})[] => {
      const {data} = res
      const items = data.result || []
      return items.map((r) => ({
        value: r.id,
        label: r.value,
        hasAdverts: r.has_adverts,
        word: r.word,
        slug: r.slug,
      }))
    },
  )
}

const popularCountriesIds = [
  '643',
  '196',
  '300',
  '792',
  '840',
  '702',
  '826',
  '112',
  '804',
  '642',
]
interface Props {
  onClose: () => void
}
const TextForm: FC<Props> = observer(({onClose}) => {
  const router = useRouter()
  const cookies = parseCookies()
  const {countries, byId: countriesById} = useCountriesStore()
  const countryOptions: SelectItem[] = countries.map((c) => ({
    value: c.id,
    label: c.title,
    isoCode: c.isoCode,
  }))
  const {t} = useTranslation()
  const [country, setCountry] = useState<
    (SelectItem & {isoCode?: string}) | null
  >(null)
  const [region, setRegion] = useState<
    (SelectItem & {word?: string; slug?: string}) | null
  >(null)
  const [city, setCity] = useState<
    (SelectItem & {word?: string; slug?: string}) | null
  >(null)
  const [regionOptions, setRegionOptions] = useState<SelectItem[]>([])
  const [cityOptions, setCityOptions] = useState<SelectItem[]>([])
  const onChangeCountry = (item) => {
    setCountry(item)
    if (!item?.value) {
      setRegion(null)
      setCity(null)
      setCityOptions([])
      setRegionOptions([])
    } else {
      fetchRegions(item.value).then((items) => {
        setRegion(null)
        setCity(null)
        setCityOptions([])
        setRegionOptions(items)
      })
    }
  }
  const onChangeRegion = (item) => {
    setRegion(item)
    if (!item?.value) {
      setCity(null)
      setCityOptions([])
    } else {
      fetchCities(item.value).then((items) => {
        setCity(null)
        setCityOptions(items)
      })
    }
  }

  useEffect(() => {
    // eslint-disable-next-line consistent-return
    const init = async () => {
      const {countryId, regionId, cityId} = cookies
      if (countryId) {
        const currentCountry = countryOptions.find((c) => c.value === countryId)
        setCountry(currentCountry)
        let regions
        try {
          regions = await fetchRegions(countryId)
        } catch (e) {
          // eslint-disable-next-line no-console
          return console.error(e)
        }
        setRegionOptions(regions)
        if (regionId) {
          const currentRegion = regions.find((c) => c.value === regionId)
          setRegion(currentRegion)
          let cities
          try {
            cities = await fetchCities(regionId)
          } catch (e) {
            // eslint-disable-next-line no-console
            return console.error(e)
          }
          setCityOptions(cities)
          if (cityId) {
            const currentCity = cities.find((c) => c.value === cityId)
            setCity(currentCity)
          }
        }
      }
    }
    init()
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [])

  const onSubmit = () => {
    const addressArray = []
    const state: CookiesState = {}
    const query: {city: string; country: string} = {city: 'all', country: 'all'}
    if (city?.value) {
      addressArray.push(city.label)
      state.cityId = city.value.toString()
      query.city = city.slug
    } else {
      destroyCookiesWrapper('cityId')
    }
    if (region?.value) {
      addressArray.push(region.label)
      state.regionId = region.value.toString()
      query.city = region.slug
    } else {
      destroyCookiesWrapper('regionId')
    }
    if (country?.value) {
      addressArray.push(country.label)
      state.countryId = country.value.toString()
      query.country = country.isoCode
    } else {
      destroyCookiesWrapper('countryId')
    }
    state.searchBy = 'id'
    // eslint-disable-next-line prefer-destructuring
    state.address = addressArray[0]
    setCookiesObject(state)
    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        ...query,
      },
    })
    onClose()
  }

  return (
    <div
      className='flex flex-col justify-between h-full'
      data-test-id='location-modal-text'>
      <div className='pt-7 px-4 s:px-6'>
        <div className='space-y-4'>
          <Select
            id='location-modal-text-country'
            value={country}
            options={countryOptions}
            placeholder={t('COUNTRY')}
            isSearchable
            isClearable
            onChange={onChangeCountry}
          />
          <Select
            id='location-modal-text-region'
            value={region}
            options={regionOptions}
            placeholder={t('REGION')}
            onChange={onChangeRegion}
            isDisabled={!regionOptions.length}
            isClearable
          />
          <Select
            id='location-modal-text-city'
            value={city}
            options={cityOptions}
            placeholder={t('CITY')}
            onChange={(item) => setCity(item)}
            isDisabled={!cityOptions.length}
            isClearable
          />
        </div>
        <div className='pt-8 pb-2'>
          <p className='text-body-16 font-semibold text-dark-1'>
            {t('PERHAPS_YOU_WANT_TO_CHANGE_COUNTRY')}
          </p>
        </div>
        <div className='grid grid-cols-3'>
          {popularCountriesIds.map((id) => {
            const value = countriesById[id]
            if (!value) return null
            return (
              <Button
                id={`location-modal-text-country-${id}`}
                key={id}
                onClick={() =>
                  onChangeCountry({
                    label: value.title,
                    value: id,
                    isoCode: value.isoCode,
                  })
                }
                className={`px-4 py-4 hover:text-primary-500 rounded-lg justify-start
              ${id === country?.value ? 'text-primary-500 font-bold' : ''}`}>
                <span className='text-body-12 truncate max-w-44 whitespace-nowrap w-full text-left'>
                  {value.title}
                </span>
              </Button>
            )
          })}
        </div>
      </div>
      <div className='flex px-4 s:px-6 w-full mt-8 s:mt-0 mb-6 pt-4'>
        <SecondaryButton
          id='location-modal-text-clean'
          className='w-full'
          onClick={() => {
            setCountry(null)
            setRegion(null)
            setCity(null)
            setRegionOptions([])
            setCityOptions([])
          }}>
          {t('CLEAN')}
        </SecondaryButton>
        <PrimaryButton
          id='location-modal-text-apply'
          onClick={country && onSubmit}
          className='ml-2 w-full'
          disabled={!country}>
          {t('APPLY')}
        </PrimaryButton>
      </div>
    </div>
  )
})

export default TextForm
