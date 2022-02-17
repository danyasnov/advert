import {FC} from 'react'
import {useTranslation} from 'next-i18next'
import {CACategoryDataModel, LanguageModel} from 'front-api/src/models'
import {FormikValues} from 'formik'
import {get, size} from 'lodash'

interface Props {
  category: CACategoryDataModel
  values: FormikValues
  mainLanguage: LanguageModel
}
const FormProgressBar: FC<Props> = ({category, values, mainLanguage}) => {
  const {t} = useTranslation()
  const {photos, content, condition, price, videos} = values
  const {minPhotos, allowVideo, allowUsed} = category
  let summary = 0
  let filled = 0

  const mainContent = (content || []).find(
    (c) => c.langCode === mainLanguage.isoCode,
  )
  summary += 2
  if (mainContent?.title) {
    filled += 1
  }
  if (mainContent?.description) {
    filled += 1
  }

  if (minPhotos) {
    summary += 1
    if (size(photos) >= minPhotos) {
      filled += 1
    }
  }

  if (allowVideo) {
    summary += 1
    if (size(videos)) {
      filled += 1
    }
  }

  summary += 1
  if (price) {
    filled += 1
  }

  if (allowUsed) {
    summary += 1
    if (condition) {
      filled += 1
    }
  }

  category.fields.forEach(({arrayTypeFields}) => {
    // @ts-ignore
    arrayTypeFields.forEach(({id, fieldType, itemType}) => {
      if (fieldType !== 'checkbox' && itemType === 'simple') {
        summary += 1
        if (get(values, `fields.${id}`)) {
          filled += 1
        }
      }
    })
  })

  const progress = Math.ceil((filled / summary) * 100)

  return (
    <div className='flex flex-col'>
      <span className='text-h-2 text-nc-title mb-1'>
        {t('PERCENTAGE_FILLED_ADS_TITLE', {fillPercentage: `${progress}%`})}
      </span>
      <span className='text-body-2 text-nc-secondary-text mb-3'>
        {t('AD_IS_FILLED_INFO')}
      </span>
      <div className='w-full bg-nc-info rounded-full h-2 mb-2'>
        <div
          className='bg-nc-success h-2 rounded-full'
          style={{width: `${progress}%`}}
        />
      </div>
    </div>
  )
}

export default FormProgressBar
