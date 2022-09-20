import {FC} from 'react'
import {useTranslation} from 'next-i18next'
import {CACategoryDataModel} from 'front-api/src/models'
import {FormikValues} from 'formik'
import {get, size} from 'lodash'

interface Props {
  category: CACategoryDataModel
  values: FormikValues
}
const FormProgressBar: FC<Props> = ({category, values}) => {
  const {t} = useTranslation()
  const {photos, condition, price, videos} = values
  const {minPhotos, allowVideo, allowUsed, isProduct} = category
  let summary = 0
  let filled = 0

  const title = get(values, 'content[0].title')
  const description = get(values, 'content[0].description')
  summary += 2
  if (title?.length > 2) {
    filled += 1
  }
  if (description?.length) {
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

  if (allowUsed && isProduct) {
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
      <span className='text-body-18 font-bold text-primary-500 mb-1'>
        {t('AD_IS_FILLED', {percent: `${progress}%`})}
      </span>
      {/* <span className='text-body-14 text-greyscale-900 mb-3'> */}
      {/*  {t('AD_IS_FILLED_INFO')} */}
      {/* </span> */}
      {/* <div className='w-full bg-greyscale-50 rounded-full h-2 mb-2'> */}
      {/*  <div */}
      {/*    className='bg-nc-success h-2 rounded-full' */}
      {/*    style={{width: `${progress}%`}} */}
      {/*  /> */}
      {/* </div> */}
    </div>
  )
}

export default FormProgressBar
