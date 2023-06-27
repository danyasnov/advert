import React, {FC, useEffect, useRef, useState} from 'react'
import {FieldProps} from 'formik'
import {useTranslation} from 'next-i18next'
import {useWindowSize} from 'react-use'
import {get, isEmpty, isEqual} from 'lodash'
import {FilterStyles} from '../Selects/styles'
import IconSelect from '../Selects/IconSelect'
import Select from '../Selects/Select'
import MobileSelect from '../Selects/MobileSelect'
import {IFormikSelect} from '../../types'

const FormikSelect: FC<IFormikSelect & FieldProps> = ({
  field,
  form,
  options,
  other = [],
  placeholder,
  isFilterable,
  isMulti,
  isClearable,
  filterStyle,
  isIconSelect,
  limit,
}) => {
  const {t} = useTranslation()
  const {width} = useWindowSize()
  const {name, value} = field
  const {setFieldValue, errors, setFieldError} = form
  const error = get(errors, name)
  const prevOptionsRef = useRef(options)
  const [currentOptions, setCurrentOptions] = useState(() => {
    if (!isEmpty(other)) {
      if (value && other.find((o) => o.value === value.value)) {
        return [...options, ...other]
      }
      return [...options, {label: t('OTHER'), value: 'other_value_button'}]
    }
    return options
  })
  useEffect(() => {
    if (!isEqual(prevOptionsRef.current, options)) {
      setCurrentOptions(options)
      prevOptionsRef.current = options
    }
  }, [options])

  const props = {
    id: name,
    value: value || [],
    options: currentOptions,
    isClearable,
    placeholder,
    isSearchable: isFilterable,
    isMulti,
    styles: {},
    classNameOpt: {},
    isInvalid: !!error,
    isIconSelect,
    filterStyle,
    limit,
    onChange: (item) => {
      if (item?.value === 'other_value_button') {
        setCurrentOptions([
          ...options.filter((o) => o.value === 'other_value_button'),
          ...other,
        ])
      } else {
        setFieldValue(name, item)
        if (error) setFieldError(name, undefined)
      }
    },
  }
  if (filterStyle) {
    if (width >= 768) {
      props.styles = FilterStyles
    } else {
      props.classNameOpt = {
        singleValue: 'text-body-12',
        valueContainer: 'py-[10px] h-10',
      }
    }
  }

  let component
  if (width >= 768) {
    if (isIconSelect) {
      component = <IconSelect {...props} />
    } else {
      component = <Select {...props} />
    }
  } else {
    component = <MobileSelect {...props} />
  }

  return (
    <div>
      {component}
      <span className='text-body-12 text-error'>{error}</span>
    </div>
  )
}

export default FormikSelect
