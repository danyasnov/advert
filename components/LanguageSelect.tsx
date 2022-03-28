import {FC, useEffect, useRef, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {useRouter} from 'next/router'
import {parseCookies} from 'nookies'
import {useTranslation} from 'next-i18next'
import ImageWrapper from './ImageWrapper'
import {setCookiesObject} from '../helpers'
import LinkSelect from './Selects/LinkSelect'
import {SelectItem} from './Selects/Select'
import {SerializedCookiesState} from '../types'

const languageOptions = [
  {
    value: 'el',
    label: 'Eλληνική',
  },
  {value: 'en', label: 'English'},
  {value: 'uk', label: 'Українська'},
  {value: 'ru', label: 'Русский'},
  {value: 'tr', label: 'Türk'},
  {value: 'ro', label: 'Română'},
]
const withLangIcons = (opts) =>
  opts.map((o) => ({
    ...o,
    icon: (
      <ImageWrapper
        type={`/img/flags/${o.value}.png`}
        alt={o.value}
        width={16}
        height={16}
      />
    ),
  }))
const LanguageSelect: FC = observer(() => {
  const {reload} = useRouter()
  const {t} = useTranslation()
  const [lang, setLang] = useState<string>()
  useEffect(() => {
    const state: SerializedCookiesState = parseCookies()
    setLang(state.language)
  }, [])
  const languages = useRef(withLangIcons(languageOptions))

  return (
    <div className='h-4 w-32'>
      <LinkSelect
        id='language-select'
        onChange={({value}) => {
          setCookiesObject({language: value as string})
          reload()
        }}
        value={languages.current.find(({value}) => value === lang)}
        options={languages.current as SelectItem[]}
        isSearchable={false}
        placeholder={t('LANGUAGES')}
      />
    </div>
  )
})
export default LanguageSelect
