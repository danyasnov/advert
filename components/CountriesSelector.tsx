import {FC} from 'react'
import {useTranslation} from 'next-i18next'
import {observer} from 'mobx-react-lite'
import {head} from 'lodash'
import {CountryModel} from 'front-api'
import {useCountriesStore} from '../providers/RootStoreProvider'
import LinkWrapper from './Buttons/LinkWrapper'

const CountriesSelector: FC = observer(() => {
  const {countries} = useCountriesStore()
  const {t} = useTranslation()
  const countriesByAlphabet = countries.reduce((acc, value) => {
    if (acc[head(value.title)]) {
      acc[head(value.title)].push(value)
    } else {
      acc[head(value.title)] = [value]
    }

    return acc
  }, [])

  return (
    <div className='flex flex-col'>
      <span className='text-h-2 mb-4 ml-4 mt-2 pt-4 border-t border-shadow-b'>
        {t('COUNTRY_SELECTION')}
      </span>
      <div className='flex flex-wrap'>
        {Object.entries(countriesByAlphabet).map(([key, values]) => (
          <div className='flex flex-col w-1/6 mb-4'>
            <div className='text-black-b h-10 bg-black-e flex items-center mb-2 pl-4'>
              {key}
            </div>
            <div className='pl-4'>
              {values.map((c: CountryModel) => (
                <LinkWrapper
                  href={`/cities/${c.isoCode}`}
                  className='text-body-2 text-black-b mb-1 flex'>
                  {c.title}
                </LinkWrapper>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
})

export default CountriesSelector
