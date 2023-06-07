import React, {FC} from 'react'
import {Field} from 'formik'
import {getSelectOptions} from './utils'
import {FieldOptions, IFormikField} from '../../types'
import FormikSelect from './FormikSelect'
import FormikRange from './FormikRange'
import FormikText from './FormikText'
import {FormikSwitch} from './index'
import FormikRangeInline from './FormikRangeInline'

const FormikTransportField: FC<IFormikField> = ({field}) => {
  const {fieldType, multiselects, id, name, isFilterable, maxValue, minValue} =
    field
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
      props.isClearable = false
      props.isIconSelect = fieldType === 'iconselect'
      break
    }
    case 'int': {
      component = FormikRangeInline
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
      break
    }
    case 'checkbox': {
      component = FormikSwitch
      props.label = name
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

export default FormikTransportField
