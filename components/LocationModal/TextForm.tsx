import {FC, useEffect, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {toJS} from 'mobx'
import {useTranslation} from 'next-i18next'
import {GeoPositionItemModel} from 'front-api/src/models/index'
import {AxiosResponse} from 'axios'
import {RestResponse} from 'front-api/src/api/request'
import {parseCookies, setCookie} from 'nookies'
import Router from 'next/router'
import {useCountriesStore} from '../../providers/RootStoreProvider'
import Select, {SelectItem} from '../Selects/Select'
import Button from '../Buttons/Button'
import {makeRequest} from '../../api'
import SecondaryButton from '../Buttons/SecondaryButton'
import PrimaryButton from '../Buttons/PrimaryButton'

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

const TextForm: FC = observer(() => {
  const cookies = parseCookies()
  const {countries} = useCountriesStore()
  const countryOptions: SelectItem[] = toJS(countries).map((c) => ({
    value: c.id,
    label: c.title,
  }))
  const {t} = useTranslation()
  const [country, setCountry] = useState<SelectItem | null>(null)
  const [region, setRegion] = useState<SelectItem | null>(null)
  const [city, setCity] = useState<SelectItem | null>(null)
  const [popularCities, setPopularCities] = useState<SelectItem[]>([])
  const [regionOptions, setRegionOptions] = useState<SelectItem[]>([])
  const [cityOptions, setCityOptions] = useState<SelectItem[]>([])
  const onChangeCountry = (item) => {
    setCountry(item)
    if (!item?.value) {
      setRegion(null)
      setCity(null)
      setPopularCities([])
    } else {
      fetchRegions(item.value).then((items) => {
        setRegion(null)
        setCity(null)
        setPopularCities([])
        setRegionOptions(items)
      })
    }
  }
  const onChangeRegion = (item) => {
    setRegion(item)
    if (!item?.value) {
      setCity(null)
      setPopularCities([])
    } else {
      fetchCities(item.value).then((items) => {
        setCity(null)
        setPopularCities(items.filter((c) => c.hasAdverts).slice(0, 9))
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
            return console.error(e)
          }
          setCityOptions(cities)
          setPopularCities(cities.filter((c) => c.hasAdverts).slice(0, 9))
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
    if (country?.value) setCookie(null, 'countryId', country.value.toString())
    if (region?.value) setCookie(null, 'regionId', region.value.toString())
    if (city?.value) setCookie(null, 'cityId', city.value.toString())
    Router.reload()
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
        <p className='text-body-2 text-black-b pt-6 pb-4'>
          {t('ENTER_CITY_OR_SELECT_POPULAR')}
        </p>
        <div className='grid grid-cols-2'>
          {popularCities.map((c) => (
            <Button
              key={c.value}
              onClick={() => setCity(c)}
              className={`text-body-2 text-black-b px-4 py-3 hover:bg-brand-a2 rounded-lg justify-start
              ${c?.value === city?.value ? 'bg-brand-a2' : ''}`}>
              {c.label}
            </Button>
          ))}
        </div>
      </div>
      <div className='flex w-full border-t border-shadow-b mb-6 pt-4 justify-end'>
        <SecondaryButton
          onClick={() => {
            setCountry(null)
            setRegion(null)
            setCity(null)
            setPopularCities([])
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
