import {FC, useEffect, useState} from 'react'
import {CAParamContent, OwnerModel} from 'front-api/src/models/index'
import useEmblaCarousel from 'embla-carousel-react'
import {SettingsLanguageModel} from 'front-api'
import {FieldProps, Field} from 'formik'
import {useTranslation} from 'next-i18next'
import {last} from 'lodash'
import Button from '../Buttons/Button'
import useSliderButtons from '../../hooks/useSliderButtons'
import SliderButton from '../Buttons/SliderButton'
import {FormikSwitch} from '../FormikComponents'
import PrimaryButton from '../Buttons/PrimaryButton'

interface Props {
  // value: CAParamContent[]
  // onChange: (value: CAParamContent[]) => void
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
  const {t} = useTranslation()
  const {name, value} = field
  const {setFieldValue, errors, values} = form
  const [language, setLanguage] = useState(user.mainLanguage.isoCode)
  const [valueDict, setValueDict] = useState<Record<string, CAParamContent>>({})

  useEffect(() => {
    if (Array.isArray(value)) {
      const dict = value.reduce((acc, val) => {
        acc[val.langCode] = val
        return acc
      }, {})
      if (!value.length) {
        userLanguages.forEach((l) => {
          dict[l.isoCode] = {langCode: l.isoCode, title: '', description: ''}
          setFieldValue(name, Object.values(dict))
        })
      }
      setValueDict(dict)
    }
  }, [value])
  const [viewportRef, embla] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    slidesToScroll: 1,
  })
  const {scrollNext, scrollPrev, prevBtnEnabled, nextBtnEnabled} =
    useSliderButtons(embla)
  const userLanguages = [user.mainLanguage, ...user.additionalLanguages]

  const title = valueDict[language]?.title ?? ''
  const description = valueDict[language]?.description ?? ''

  return (
    <div className='w-full'>
      <div className='flex'>
        <div className='overflow-hidden relative' ref={viewportRef}>
          <div className='flex'>
            {userLanguages.map((l) => (
              <Button
                key={l.isoCode}
                onClick={() => setLanguage(l.isoCode)}
                className={`px-4 py-3 text-body-2 border-b whitespace-nowrap ${
                  language === l.isoCode
                    ? 'text-nc-title font-medium border-brand-a1'
                    : 'text-nc-link border-nc-link'
                }`}>
                {languagesByIsoCode[l.isoCode]?.name}
              </Button>
            ))}
          </div>
        </div>
        {(prevBtnEnabled || nextBtnEnabled) && (
          <div className='flex items-center space-x-1 h-10'>
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
          </div>
        )}
      </div>
      <div className='flex flex-col w-full rounded-b-lg overflow-hidden'>
        <div className='relative'>
          <input
            className={`border text-body-2 py-3 pl-4 pr-15 w-full text-nc-primary-text ${
              errors[name] ? 'border-error' : 'border-shadow-b'
            }`}
            value={title}
            maxLength={50}
            onChange={(e) => {
              const updatedValue = value.map((v) =>
                v.langCode === language ? {...v, title: e.target.value} : v,
              )
              setFieldValue(name, updatedValue)
            }}
          />
          <span className='absolute inset-y-0 right-0 text-nc-icon items-center flex text-body-4 mr-4'>
            {`${title.length}/50`}
          </span>
        </div>
        <textarea
          rows={5}
          maxLength={maxDescriptionLength}
          value={description}
          onChange={(e) => {
            const updatedValue = value.map((v) =>
              v.langCode === language ? {...v, description: e.target.value} : v,
            )
            setFieldValue(name, updatedValue)
          }}
          className='text-body-1 px-4 pt-3 pb-6 rounded-b-lg text-nc-primary-text w-full pb-4 border border-t-0 border-shadow-b'
        />
      </div>
      <span className='text-nc-icon justify-end flex text-body-4 mr-4 mt-1'>
        {`${description.length}/${maxDescriptionLength}`}
      </span>
      <div className='bg-nc-accent rounded-lg flex w-min py-3 px-5'>
        <Field
          component={FormikSwitch}
          name='isExclusive'
          label={t('ONLY_ON_ADVERTO')}
          labelPosition='right'
        />
      </div>
    </div>
  )
}

export default AdvertDescription
