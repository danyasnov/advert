import {FC, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {toJS} from 'mobx'
import {useTranslation} from 'next-i18next'
import {GeoPositionItemModel} from 'front-api/src/models/index'
import axios, {AxiosResponse} from 'axios'
import {RestResponse} from 'front-api/src/api/request'
import {useCountriesStore} from '../../providers/RootStoreProvider'
import Select from '../Selects/Select'
import Button from '../Buttons/Button'
import {notImplementedAlert} from '../../helpers'

const TextForm: FC = observer(() => {
  const {countries} = useCountriesStore()
  const countryOptions = toJS(countries).map((c) => ({
    value: c.id,
    label: c.title,
  }))
  const {t} = useTranslation()
  const [country, setCountry] = useState(null)
  const [region, setRegion] = useState(null)
  const [city, setCity] = useState(null)
  const [popularCities, setPopularCities] = useState([])
  const [regionOptions, setRegionOptions] = useState([])
  const [cityOptions, setCityOptions] = useState([])
  const onChangeCountry = (item) => {
    setCountry(item)
    if (!item?.value) return
    axios
      .post('/api/regions', {
        country: item.value,
      })
      .then((res: AxiosResponse<RestResponse<GeoPositionItemModel[]>>) => {
        const {data} = res
        setRegion(null)
        setCity(null)
        setPopularCities([])
        setRegionOptions(
          (data.result || []).map((r) => ({value: r.id, label: r.value})),
        )
      })
  }
  const onChangeRegion = (item) => {
    setRegion(item)
    if (!item?.value) return
    axios
      .post('/api/cities', {
        city: item.value,
      })
      .then((res: AxiosResponse<RestResponse<GeoPositionItemModel[]>>) => {
        const {data} = res
        const items = data.result || []
        setCity(null)
        setPopularCities(items.filter((c) => c.has_adverts).slice(0, 9))
        setCityOptions(items.map((r) => ({value: r.id, label: r.value})))
      })
  }

  return (
    <>
      <div className='space-y-3 pt-3'>
        <Select
          value={country}
          options={countryOptions}
          placeholder={t('COUNTRY')}
          isSearchable
          onChange={onChangeCountry}
        />
        <Select
          value={region}
          options={regionOptions}
          placeholder={t('REGION')}
          onChange={onChangeRegion}
          isDisabled={!regionOptions.length}
        />
        <Select
          value={city}
          options={cityOptions}
          placeholder={t('CITY')}
          onChange={(item) => setCity(item)}
          isDisabled={!cityOptions.length}
        />
      </div>
      <p className='text-body-2 text-black-b pt-6 pb-4'>
        {t('ENTER_CITY_OR_SELECT_POPULAR')}
      </p>
      <div className='grid grid-cols-2'>
        {popularCities.map((c) => (
          <Button
            key={c.value}
            onClick={notImplementedAlert}
            className='text-body-2 text-black-b px-4 py-3 hover:bg-brand-a2 rounded-lg justify-start'>
            {c.value}
          </Button>
        ))}
      </div>
    </>
  )
})

export default TextForm
