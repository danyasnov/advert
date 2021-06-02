import {FC, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {toJS} from 'mobx'
import {useTranslation} from 'next-i18next'
import {GeoPositionItemModel} from 'front-api/src/models/index'
import {AxiosResponse} from 'axios'
import {RestResponse} from 'front-api/src/api/request'
import {useCookies} from 'react-cookie'
import {useCountriesStore} from '../../providers/RootStoreProvider'
import Select, {SelectItem} from '../Selects/Select'
import Button from '../Buttons/Button'
import {notImplementedAlert} from '../../helpers'
import {makeRequest} from '../../api'
import SecondaryButton from '../Buttons/SecondaryButton'
import PrimaryButton from '../Buttons/PrimaryButton'

const TextForm: FC = observer(() => {
  const [, setCookie] = useCookies(['country', 'region', 'city'])
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
      makeRequest({
        method: 'post',
        url: '/api/regions',
        data: {
          country: item.value,
        },
      }).then((res: AxiosResponse<RestResponse<GeoPositionItemModel[]>>) => {
        const {data} = res
        const items = data.result || []
        setRegion(null)
        setCity(null)
        setPopularCities([])
        setRegionOptions(items.map((r) => ({value: r.id, label: r.value})))
      })
    }
  }
  const onChangeRegion = (item) => {
    setRegion(item)
    if (!item?.value) {
      setCity(null)
      setPopularCities([])
    } else {
      makeRequest({
        method: 'post',
        url: '/api/cities',
        data: {
          region: item.value,
        },
      }).then((res: AxiosResponse<RestResponse<GeoPositionItemModel[]>>) => {
        const {data} = res
        const items = data.result || []
        setCity(null)
        setPopularCities(
          items
            .filter((c) => c.has_adverts)
            .slice(0, 9)
            .map((c) => ({value: c.id, label: c.value})),
        )
        setCityOptions(items.map((r) => ({value: r.id, label: r.value})))
      })
    }
  }

  const onSubmit = () => {
    if (country?.value) setCookie('country', country.value)
    if (region?.value) setCookie('region', region.value)
    if (city?.value) setCookie('city', city.value)
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
