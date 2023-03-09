import {FC, useState} from 'react'
import {OwnerModel} from 'front-api/src/models'
import useEmblaCarousel from 'embla-carousel-react'
import {SettingsLanguageModel} from 'front-api'
import {FieldProps, Field} from 'formik'
import {useTranslation} from 'next-i18next'
import {useRouter} from 'next/router'
import IcExclamation from 'icons/material/Exclamation.svg'
import {get, toArray} from 'lodash'
import Button from '../Buttons/Button'
import {FormikSwitch} from '../FormikComponents'
import Tip from './Tip'
import ImageWrapper from '../ImageWrapper'
import {handleMetrics} from '../../helpers'
import {window} from '../../types'

interface Props {
  user: OwnerModel
  languagesByIsoCode: Record<string, SettingsLanguageModel>
  maxDescriptionLength: number
  className: string
}
const AdvertDescription: FC<Props & FieldProps> = ({
  field,
  form,
  user,
  languagesByIsoCode,
  maxDescriptionLength,
  className,
}) => {
  const {query} = useRouter()
  const {t} = useTranslation()
  const {name, value} = field
  const {setFieldValue, errors, setFieldError} = form
  const [language, setLanguage] = useState(user.mainLanguage.isoCode)
  const error = get(errors, name)
  const [viewportRef] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    slidesToScroll: 1,
  })

  const userLanguages = [
    user.mainLanguage,
    ...toArray(user.additionalLanguages),
  ]
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
    <div className={`w-screen-offset-8 s:w-full ${className}`}>
      {/* <div className='flex'> */}
      {/*  <div className='overflow-hidden relative' ref={viewportRef}> */}
      {/*    <div className='flex mb-4 space-x-2'> */}
      {/*      {userLanguages.map((l, index) => { */}
      {/*        return ( */}
      {/*          <Button */}
      {/*            id={`ad-language-select-${l.isoCode}`} */}
      {/*            key={l.isoCode} */}
      {/*            onClick={() => setLanguage(l.isoCode)} */}
      {/*            className={`px-3.5 py-2.5 text-body-16 rounded-lg shadow-md whitespace-nowrap hover:bg-nc-accent flex items-center ${ */}
      {/*              // eslint-disable-next-line no-nested-ternary */}
      {/*              language === l.isoCode */}
      {/*                ? 'text-greyscale-900 bg-nc-accent' */}
      {/*                : 'text-nc-link' */}
      {/*            }`}> */}
      {/*            <div className='shrink-0 mr-2 w-5 h-5'> */}
      {/*              <ImageWrapper */}
      {/*                type={`/img/flags/${l.isoCode}.png`} */}
      {/*                alt={l.isoCode} */}
      {/*                width={20} */}
      {/*                height={20} */}
      {/*              /> */}
      {/*            </div> */}

      {/*            {languagesByIsoCode[l.isoCode]?.name} */}
      {/*            {error && index === 0 && ( */}
      {/*              <IcExclamation className='ml-2 w-4 h-4' /> */}
      {/*            )} */}
      {/*          </Button> */}
      {/*        ) */}
      {/*      })} */}
      {/*    </div> */}
      {/*  </div> */}
      {/* </div> */}
      <div className='flex flex-col w-full rounded-b-lg'>
        <div className='flex items-center mb-1'>
          <div className='w-full'>
            <span className='text-body-16 text-greyscale-900 font-bold mr-1'>
              {t('TITLE')}
            </span>
            <span className='text-body-16 text-error'>*</span>
          </div>
          <span className='text-greyscale-800 text-body-10 font-normal'>
            {`${title.length}/150`}
          </span>
        </div>

        <input
          placeholder={t('ENTER_THE_TITLE')}
          className={`border bg-greyscale-50 text-body-16 rounded-xl py-4 px-5 mb-4 w-full text-greyscale-900 ${
            error ? 'border-error' : 'border-transparent'
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
            handleMetrics(window.dataLayer.push('addAdvt_title', title))
          }}
        />

        <div className='flex items-center mb-1'>
          <div className='w-full'>
            <span className='text-body-16 text-greyscale-900 font-bold mr-1'>
              {t('DESCRIPTION_TAB')}
            </span>
          </div>
          <span className='text-greyscale-800 text-body-10 font-normal'>
            {`${description.length}/${maxDescriptionLength}`}
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
          className='rounded-xl text-body-16 py-4 px-5 text-greyscale-900 w-full bg-greyscale-50'
        />
      </div>
      <div className='flex w-full justify-between pr-4 mt-1 mb-2'>
        <span className='text-body-12 text-error'>{error}</span>
      </div>
      {/* {query.action === 'create' && ( */}
      {/*  <div className='flex space-x-2 items-center mt-4'> */}
      {/*    <div className='bg-nc-accent rounded-lg flex w-min py-3 px-5 '> */}
      {/*      <Field */}
      {/*        component={FormikSwitch} */}
      {/*        name='isExclusive' */}
      {/*        label={t('ONLY_ON_VOOXEE')} */}
      {/*        labelPosition='right' */}
      {/*      /> */}
      {/*    </div> */}
      {/*    <Tip message={t('EXCLUSIVE_VOOXEE_TEXT')} placement='left' /> */}
      {/*  </div> */}
      {/* )} */}
    </div>
  )
}

export default AdvertDescription
