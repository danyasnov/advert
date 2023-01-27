import {FC, useEffect, useRef, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {useRouter} from 'next/router'
import {parseCookies} from 'nookies'
import {useTranslation} from 'next-i18next'
import IcWorld from 'icons/material/World.svg'
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
]
const withLangIcons = (opts) =>
  opts.map((o) => ({
    ...o,
    icon: <IcWorld className='w-5 h-5' />,
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
    <div className='flex justify-end min-w-min'>
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
