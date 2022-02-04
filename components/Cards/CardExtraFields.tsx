import React from 'react'

import {AdvertiseExtraField} from 'front-api'
import {isEmpty} from 'lodash'
import {useTranslation} from 'next-i18next'
import ImageWrapper from '../ImageWrapper'

interface Props {
  extraFields: AdvertiseExtraField[]
}

const onlyText = (f: AdvertiseExtraField) => f.type === 'text' && !!f.text
const onlyIcon = (f: AdvertiseExtraField) => f.type === 'url'

const CardExtraFields: React.FC<Props> = ({extraFields}) => {
  const {t} = useTranslation()
  if (isEmpty(extraFields)) return <div className='py-1' />

  let textFields = extraFields
    .filter(onlyText)
    .map((f: AdvertiseExtraField) => {
      const {text} = f
      return t('EXTRA_FIELD', {
        value: text.value,
        unitCode: text.unitCode ? t(text.unitCode) : undefined,
      })
    })
    .join(' • ')
  const icons = extraFields.filter(onlyIcon)
  if (icons.length > 0) textFields = ` • ${textFields}`

  return (
    <div className='flex items-center py-1'>
      {icons.map((i) => {
        return (
          <ImageWrapper width={16} height={16} type={i.icon} alt={i.icon} />
        )
      })}
      <span className='text-body-3 text-nc-primary-text'>{textFields}</span>
    </div>
  )
}

export default CardExtraFields
