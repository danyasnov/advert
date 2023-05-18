import React, {FC} from 'react'
import {useTranslation} from 'next-i18next'
import {useWindowSize} from 'react-use'
import {toNumber} from 'lodash'
import {Field} from 'formik'
import {getCreateSelectOptions} from './utils'
import {FieldOptions, IFormikField} from '../../types'
import FormikSelect from './FormikSelect'
import FormikNumber from './FormikNumber'
import FormikText from './FormikText'
import FormikSwitch from './FormikSwitch'

const FormikCreateField: FC<IFormikField> = ({field}) => {
  const {t} = useTranslation()
  const {width} = useWindowSize()
  const {
    fieldType,
    id,
    name,
    isFilterable,
    maxValue,
    minValue,
    maxLength,
    isFillingRequired,
    multiselects,
  } = field
  let component
  const props: FieldOptions = {}
  switch (fieldType) {
    case 'select':
    case 'iconselect':
    case 'multiselect': {
      component = FormikSelect
      const {visible, other} = getCreateSelectOptions(multiselects)
      props.options = visible
      props.other = other
      props.placeholder = name
      props.isFilterable = isFilterable
      props.isMulti = fieldType === 'multiselect'
      props.isIconSelect = fieldType === 'iconselect'
      break
    }
    case 'int': {
      component = FormikNumber
      props.placeholder = name
      props.maxValue = maxValue
      props.minValue = minValue
      props.maxLength = maxLength

      break
    }
    case 'string': {
      component = FormikText
      props.placeholder = name
      props.maxLength = maxLength
      break
    }
    case 'checkbox': {
      component = FormikSwitch
      props.label = name
      props.hideLabel = width >= 768
      break
    }
    default: {
      component = null
    }
  }

  const validate = (value) => {
    let msg
    if (isFillingRequired && !value) {
      msg = t('FIELD_REQUIRED_ERROR', {
        field: name,
      })
    }
    if (minValue || maxValue) {
      const num = toNumber(value)
      if (num < minValue || num > maxValue) {
        const error = t('VALUE_MUST_BE_BETWEEN', {
          fieldName: name,
          min: minValue,
          max: maxValue,
        })
        msg = error
      }
    }
    return msg
  }
  if (!component) return null
  return (
    <Field
      name={`fields.${id}`}
      component={component}
      validate={validate}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    />
  )
}

export default FormikCreateField
