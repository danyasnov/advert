import React, {FC} from 'react'
import {Field} from 'formik'
import {useTranslation} from 'next-i18next'
import {FieldTypeModel} from 'front-api'
import {toJS} from 'mobx'
import {getSelectOptions} from './utils'
import {FieldOptions, IFormikField} from '../../types'
import FormikSelect from './FormikSelect'
import FormikRange from './FormikRange'
import FormikText from './FormikText'
import FormikChips from './FormikChips'

const FormikFilterField: FC<IFormikField> = ({field}) => {
  const {fieldType, multiselects, id, name, isFilterable, maxValue, minValue} =
    field
  const {t} = useTranslation()
  let component
  const props: FieldOptions = {}
  switch (fieldType) {
    case 'select':
    case 'iconselect':
    case 'multiselect': {
      component = FormikSelect
      props.options = getSelectOptions(multiselects)
      props.placeholder = name
      props.isFilterable = isFilterable
      props.isMulti = true
      props.filterStyle = true
      props.isClearable = false
      props.isIconSelect = fieldType === 'iconselect'
      break
    }
    case 'int': {
      component = FormikRange
      props.placeholder = name
      props.maxValue = maxValue
      props.minValue = minValue
      props.validate = (value = []) => {
        const [min, max] = value
        let parsedMin
        let parsedMax
        if (min) parsedMin = parseFloat(min)
        if (max) parsedMax = parseFloat(max)
        let error
        if ((parsedMin || parsedMin === 0) && (parsedMax || parsedMax === 0)) {
          if (parsedMin > parsedMax) {
            error = 'parsedMin should be lesser than parsedMax'
          }
        }

        return error
      }
      break
    }
    case 'string': {
      component = FormikText
      props.placeholder = name
      props.filterStyle = true
      break
    }
    case 'checkbox': {
      component = FormikChips
      props.label = name

      break
    }
    case 'price' as FieldTypeModel: {
      component = FormikRange
      props.name = 'priceRange'
      props.placeholder = t('PRICE')

      props.validate = (value) => {
        const [priceMin, priceMax] = value
        let error
        if (priceMin && priceMax) {
          const parsedMin = parseFloat(priceMin)
          const parsedMax = parseFloat(priceMax)
          if (parsedMin > parsedMax) {
            error = 'priceMin should be lesser than priceMax'
          }
        }
        return error
      }
      break
    }
    default: {
      component = null
    }
  }
  if (!component) return null
  // eslint-disable-next-line react/jsx-props-no-spreading
  return (
    <div>
      <Field name={`fields.${id}`} component={component} {...props} />
    </div>
  )
}

export default FormikFilterField
