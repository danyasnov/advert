/* eslint-disable react-hooks/exhaustive-deps */
import {FC, useEffect, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {toJS} from 'mobx'
import {useTranslation} from 'next-i18next'
import {GeoPositionItemModel} from 'front-api/src/models/index'
import {AxiosResponse} from 'axios'
import {RestResponse} from 'front-api/src/api/request'
import {destroyCookie, parseCookies} from 'nookies'
import {useRouter} from 'next/router'
import {useCountriesStore} from '../../providers/RootStoreProvider'
import Select, {SelectItem} from '../Selects/Select'
import Button from '../Buttons/Button'
import {makeRequest} from '../../api'
import SecondaryButton from '../Buttons/SecondaryButton'
import PrimaryButton from '../Buttons/PrimaryButton'
import {CookiesState, setCookiesObject} from '../../helpers'

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
      return items.map((r) => ({value: r.id, label: r.value}))
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

const TextForm: FC = observer(() => {
  const router = useRouter()
  const cookies = parseCookies()
  const {countries, byId} = useCountriesStore()
  const countryOptions: SelectItem[] = toJS(countries).map((c) => ({
    value: c.id,
    label: c.title,
  }))
  const countriesById = toJS(byId)
  const {t} = useTranslation()
  const [country, setCountry] = useState<SelectItem | null>(null)
  const [region, setRegion] = useState<SelectItem | null>(null)
  const [city, setCity] = useState<SelectItem | null>(null)
  const [regionOptions, setRegionOptions] = useState<SelectItem[]>([])
  const [cityOptions, setCityOptions] = useState<SelectItem[]>([])
  const onChangeCountry = (item) => {
    setCountry(item)
    if (!item?.value) {
      setRegion(null)
      setCity(null)
      setCityOptions([])
    } else {
      fetchRegions(item.value).then((items) => {
        setRegion(null)
        setCity(null)
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
  }, [])

  const onSubmit = () => {
    const addressArray = []
    const state: CookiesState = {}
    if (city?.value) {
      addressArray.push(city.label)
      state.cityId = city.value.toString()
    } else {
      destroyCookie(null, 'cityId')
    }
    if (region?.value) {
      addressArray.push(region.label)
      state.regionId = region.value.toString()
    } else {
      destroyCookie(null, 'regionId')
    }
    if (country?.value) {
      addressArray.push(country.label)
      state.countryId = country.value.toString()
    } else {
      destroyCookie(null, 'countryId')
    }
    state.searchBy = 'id'
    // eslint-disable-next-line prefer-destructuring
    state.address = addressArray[0]
    setCookiesObject(state)
    router.reload()
  }

  return (
    <div className='flex flex-col justify-between h-full'>
      <div className='pt-3 px-6'>
        <div className='space-y-3'>
          <Select
            value={country}
            options={countryOptions}
            placeholder={t('COUNTRY')}
            isSearchable
            isClearable
            onChange={onChangeCountry}
          />
          <Select
            value={region}
            options={regionOptions}
            placeholder={t('REGION')}
            onChange={onChangeRegion}
            isDisabled={!regionOptions.length}
            isClearable
          />
          <Select
            value={city}
            options={cityOptions}
            placeholder={t('CITY')}
            onChange={(item) => setCity(item)}
            isDisabled={!cityOptions.length}
            isClearable
          />
        </div>
        <div className='pt-6 pb-4'>
          <p className='text-body-2 text-black-b'>
            {t('SELECT_SEARCH_OPTIONS')}
          </p>
          <p className='text-body-2 text-black-b'>
            {t('PERHAPS_YOU_WANT_TO_CHANGE_COUNTRY')}
          </p>
        </div>
        <div className='grid grid-cols-2'>
          {popularCountriesIds.map((id) => {
            const value = countriesById[id]
            if (!value) return null
            return (
              <Button
                key={id}
                onClick={() => onChangeCountry({label: value.title, value: id})}
                className={`px-4 py-3 hover:bg-brand-a2 rounded-lg justify-start
              ${id === country?.value ? 'bg-brand-a2' : ''}`}>
                <span className='text-body-2 text-black-b truncate max-w-44 whitespace-nowrap'>
                  {value.title}
                </span>
              </Button>
            )
          })}
        </div>
      </div>
      <div className='flex w-full border-t border-shadow-b mb-6 pt-4 justify-end'>
        <SecondaryButton
          onClick={() => {
            setCountry(null)
            setRegion(null)
            setCity(null)
          }}>
          {t('CLEAN')}
        </SecondaryButton>
        <PrimaryButton
          onClick={onSubmit}
          className='ml-4 mr-6'
          disabled={!country}>
          {t('APPLY')}
        </PrimaryButton>
      </div>
    </div>
  )
})

export default TextForm
