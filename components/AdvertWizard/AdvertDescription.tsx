import {FC, useState} from 'react'
import {OwnerModel} from 'front-api/src/models'
import useEmblaCarousel from 'embla-carousel-react'
import {SettingsLanguageModel} from 'front-api'
import {FieldProps, Field} from 'formik'
import {useTranslation} from 'next-i18next'
import {useRouter} from 'next/router'
import IcExclamation from 'icons/material/Exclamation.svg'
import {get} from 'lodash'
import Button from '../Buttons/Button'
import useSliderButtons from '../../hooks/useSliderButtons'
import SliderButton from '../Buttons/SliderButton'
import {FormikSwitch} from '../FormikComponents'
import Tip from './Tip'

interface Props {
  user: OwnerModel
  languagesByIsoCode: Record<string, SettingsLanguageModel>
  maxDescriptionLength: number
}
const AdvertDescription: FC<Props & FieldProps> = ({
  field,
  form,
  user,
  languagesByIsoCode,
  maxDescriptionLength,
}) => {
  const {query} = useRouter()
  const {t} = useTranslation()
  const {name, value} = field
  const {setFieldValue, errors, setFieldError} = form
  const [language, setLanguage] = useState(user.mainLanguage.isoCode)
  const error = get(errors, name)
  const [viewportRef, embla] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    slidesToScroll: 1,
  })
  const {scrollNext, scrollPrev, prevBtnEnabled, nextBtnEnabled} =
    useSliderButtons(embla)
  const userLanguages = [user.mainLanguage, ...user.additionalLanguages]
  let valueDict = {}
  // hotfix for jumping caret
  if (Array.isArray(value)) {
    valueDict = value.reduce((acc, val) => {
      acc[val.langCode] = val
      return acc
    }, {})
    if (!value.length) {
      userLanguages.forEach((l) => {
        valueDict[l.isoCode] = {langCode: l.isoCode, title: '', description: ''}
        setFieldValue(name, Object.values(valueDict))
      })
    }
  }
  const title = valueDict[language]?.title ?? ''
  const description = valueDict[language]?.description ?? ''

  return (
    <div className='w-screen-offset-8 s:w-full'>
      <div className='flex'>
        <div className='overflow-hidden relative' ref={viewportRef}>
          <div className='flex'>
            {userLanguages.map((l, index) => {
              const current = valueDict[l.isoCode]
              const isFilled = current?.title || current?.description
              return (
                <Button
                  key={l.isoCode}
                  onClick={() => setLanguage(l.isoCode)}
                  className={`px-4 py-3 text-body-2 border-b whitespace-nowrap hover:bg-nc-accent hover:text-nc-link ${
                    // eslint-disable-next-line no-nested-ternary
                    language === l.isoCode
                      ? 'text-nc-title font-medium border-brand-a1'
                      : isFilled
                      ? 'text-nc-link border-nc-link'
                      : 'text-nc-placeholder'
                  }`}>
                  {languagesByIsoCode[l.isoCode]?.name}
                  {error && index === 0 && (
                    <IcExclamation className='ml-2 w-4 h-4' />
                  )}
                </Button>
              )
            })}
          </div>
        </div>
        <div
          className={`w-18 hidden s:flex items-center space-x-1 h-10 ${
            prevBtnEnabled || nextBtnEnabled ? '' : 'invisible'
          }`}>
          <>
            <SliderButton
              onClick={scrollPrev}
              disabled={!prevBtnEnabled}
              direction='left'
              className={`${prevBtnEnabled ? 'bg-nc-accent' : ''}`}
            />
            <SliderButton
              onClick={scrollNext}
              disabled={!nextBtnEnabled}
              direction='right'
              className={`${nextBtnEnabled ? 'bg-nc-accent' : ''}`}
            />
          </>
        </div>
      </div>
      <div className='flex flex-col w-full rounded-b-lg overflow-hidden'>
        <div className='relative'>
          <input
            placeholder={t('ENTER_THE_TITLE')}
            className={`border text-body-2 py-3 pl-4 pr-15 w-full text-nc-primary-text ${
              error ? 'border-error' : 'border-shadow-b'
            }`}
            value={title}
            maxLength={150}
            onChange={(e) => {
              let updatedValue
              if (!value.find((v) => v.langCode === language)) {
                updatedValue = [
                  ...value,
                  {langCode: language, title: e.target.value, description: ''},
                ]
              } else {
                updatedValue = value.map((v) =>
                  v.langCode === language ? {...v, title: e.target.value} : v,
                )
              }

              setFieldValue(name, updatedValue)
              if (error) setFieldError(name, undefined)
            }}
          />
          <span className='absolute inset-y-0 right-0 text-nc-icon items-center flex text-body-4 mr-4'>
            {`${title.length}/150`}
          </span>
        </div>
        <textarea
          placeholder={t('ENTER_DESCRIPTION')}
          rows={5}
          maxLength={maxDescriptionLength}
          value={description}
          onChange={(e) => {
            let updatedValue
            if (!value.find((v) => v.langCode === language)) {
              updatedValue = [
                ...value,
                {langCode: language, title: '', description: e.target.value},
              ]
            } else {
              updatedValue = value.map((v) =>
                v.langCode === language
                  ? {...v, description: e.target.value}
                  : v,
              )
            }
            setFieldValue(name, updatedValue)
            if (error) setFieldError(name, undefined)
          }}
          className='text-body-1 px-4 pt-3 pb-6 rounded-b-lg text-nc-primary-text w-full pb-4 border border-t-0 border-shadow-b'
        />
      </div>
      <div className='flex w-full justify-between pr-4 mt-1 mb-2'>
        <span className='text-body-3 text-error'>{error}</span>
        <span className='text-nc-icon flex text-body-4 justify-center'>
          {`${description.length}/${maxDescriptionLength}`}
        </span>
      </div>
      <span className='text-body-3 text-nc-secondary-text'>
        {t('OTHER_LANGUAGES_REFERENCE')}
      </span>
      {query.action === 'create' && (
        <div className='flex space-x-2 items-center mt-4'>
          <div className='bg-nc-accent rounded-lg flex w-min py-3 px-5 '>
            <Field
              component={FormikSwitch}
              name='isExclusive'
              label={t('ONLY_ON_ADVERTO')}
              labelPosition='right'
            />
          </div>
          <Tip message={t('EXCLUSIVE_ON_ADVERTO_TIP')} placement='left' />
        </div>
      )}
    </div>
  )
}

export default AdvertDescription
