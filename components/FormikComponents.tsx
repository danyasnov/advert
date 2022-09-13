import React, {FC, useEffect, useRef, useState} from 'react'
import {Field, FieldProps, useFormikContext} from 'formik'
import {useTranslation} from 'next-i18next'
import NumberFormat, {NumberFormatProps} from 'react-number-format'
import IcCheck from 'icons/material/Check.svg'
import {CACategoryDataFieldModel} from 'front-api/src/models'
import {get, isEmpty, isEqual, toNumber} from 'lodash'
import IcVisibility from 'icons/material/Visibility.svg'
import IcHidden from 'icons/material/Hidden.svg'
import Switch from 'react-switch'
import {useWindowSize} from 'react-use'
import Select, {SelectItem} from './Selects/Select'
import Button from './Buttons/Button'
import MobileSelect from './Selects/MobileSelect'
import AdvertFormField from './AdvertWizard/AdvertFormField'
import {makeRequest} from '../api'

interface IFormikSegmented {
  options: SelectItem[]
}
interface IFormikCheckbox {
  label: string
  labelClassname: string
  hideLabel?: boolean
  labelPosition?: 'left' | 'right'
}
interface IFormikSelect {
  label: string
  options: SelectItem[]
  placeholder: string
  isFilterable: boolean
  isClearable: boolean
  isMulti: boolean
}
interface IFormikRange {
  placeholder: string
  minValue?: number
  maxValue?: number
}
interface IFormikNumber {
  placeholder: string
  value: number
  mask?: string
  maxLength?: number
  format?: string
  thousandSeparator?: string
  allowEmptyFormatting?: boolean
  disableTrack?: boolean
}
interface IFormikField {
  field: CACategoryDataFieldModel
}

interface FieldOptions {
  options?: SelectItem[]
  placeholder?: string
  label?: string
  isFilterable?: boolean
  isMulti?: boolean
  hideLabel?: boolean
  maxLength?: number
  maxValue?: number
  minValue?: number
  validate?: (value: any) => string
}

export const getSelectOptions = (multiselects = {}) => {
  return [
    // @ts-ignore
    ...multiselects.top,
    // @ts-ignore
    ...(multiselects.other
      ? // @ts-ignore
        multiselects.other
      : []),
  ]
    .map((o) =>
      o.isOther
        ? null
        : {
            value: o.id,
            label: o.value,
            disabled: o.itemType === 'title',
          },
    )
    .filter((o) => !!o)
}

export const FormikFilterField: FC<IFormikField> = ({field}) => {
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
      break
    }
    case 'checkbox': {
      component = FormikCheckbox
      props.label = name
      break
    }
    default: {
      component = null
    }
  }
  if (!component) return null
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Field name={`fields.${id}`} component={component} {...props} />
}

// @ts-ignore
export const FormikCreateFields: FC<{
  fieldsArray: any[]
  id?: number
  hasArrayType?: boolean
}> = ({fieldsArray, id, hasArrayType}) => {
  let checkboxesGroup = null
  let description = null
  let fields = fieldsArray

  if (id === 2058) {
    checkboxesGroup = fieldsArray.filter((f) => f.fieldType === 'checkbox')
    fields = fieldsArray.filter((f) => f.fieldType !== 'checkbox')
    description = 'FACILITIES_TIP'
  }
  const {width} = useWindowSize()

  const fieldsGroup = fields.map((f) => {
    if (f.fieldType === 'array') {
      return <FormikCreateFields fieldsArray={f.arrayTypeFields} hasArrayType />
    }
    const isEmptyOptions =
      isEmpty(getSelectOptions(f.multiselects)) &&
      ['select', 'multiselect', 'iconselect'].includes(f.fieldType)

    if (!isEmptyOptions && f.itemType !== 'title') {
      if (f.dependenceSequenceId) {
        return <FormikDependentFields field={f} />
      }
      return (
        <AdvertFormField
          key={f.id}
          id={`form-field-${f.fieldType}-${f.slug}`}
          body={
            <div
              className={`w-full s:w-1/2 ${
                hasArrayType ? 'l:w-full' : 'l:w-5/12'
              }`}>
              <FormikCreateField field={f} />
            </div>
          }
          labelClassName='text-greyscale-900'
          orientation={width >= 768 ? 'horizontal' : 'vertical'}
          isRequired={f.isFillingRequired}
          label={width < 768 && f.fieldType === 'checkbox' ? undefined : f.name}
        />
      )
    }
    if (f.itemType === 'title') {
      return <FormikTitle label={f.name} />
    }
    return null
  })
  return (
    <>
      {fieldsGroup}
      {!!checkboxesGroup && (
        <FormikCheckboxesGroup
          description={description}
          fields={checkboxesGroup}
        />
      )}
    </>
  )
}

export const FormikTitle: FC<{label: string}> = ({label}) => {
  return (
    <div className='text-greyscale-900 text-body-18 font-semibold pb-4'>
      {label}
    </div>
  )
}

export const FormikCheckboxesGroup: FC<{
  fields: CACategoryDataFieldModel[]
  description?: string
}> = ({fields, description}) => {
  const formik = useFormikContext()
  const {t} = useTranslation()
  const {values, setFieldValue} = formik
  return (
    <div>
      {!!description && (
        <div className='bg-greyscale-50 rounded-lg py-3 px-4 mb-4'>
          <span className='text-body-14'>{t(description)}</span>
        </div>
      )}
      <div className='flex flex-wrap'>
        {fields.map((f) => {
          const name = `fields.${f.id}`
          const value = get(values, name)
          return (
            <Button
              onClick={() => setFieldValue(name, !value)}
              key={f.id}
              className={`text-body-16 text-greyscale-900 p-4 rounded-lg mr-3 mb-3 ${
                value ? 'bg-nc-accent' : 'bg-nc-back'
              }`}>
              {f.name}
            </Button>
          )
        })}
      </div>
    </div>
  )
}

export const FormikCreateField: FC<IFormikField> = ({field}) => {
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
      props.options = getSelectOptions(multiselects)
      props.placeholder = name
      props.isFilterable = isFilterable
      props.isMulti = fieldType === 'multiselect'
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

export const FormikSegmented: FC<IFormikSegmented & FieldProps> = ({
  field,
  form,
  options,
}) => {
  const {name, value} = field
  const {setFieldValue} = form
  return (
    <div className='flex divide-x'>
      {options.map((o) => (
        <Button
          key={o.label + o.value}
          onClick={() => setFieldValue(name, o)}
          className={`h-7 text-body-14 text-black-c flex-1 border-t border-b
           border-shadow-b first:rounded-l-2xl last:rounded-r-2xl first:border-l
            last:border-r segmented-option-border-fix ${
              o?.value === value?.value ? 'bg-brand-a2' : ''
            }`}>
          {o.label}
        </Button>
      ))}
    </div>
  )
}

export const FormikNumber: FC<IFormikNumber & FieldProps> = ({
  field,
  form,
  maxLength,
  placeholder,
  mask,
  format,
  allowEmptyFormatting,
  thousandSeparator = ' ',
  disableTrack,
}) => {
  const {name, value} = field
  const {setFieldValue, errors, setFieldError} = form
  const error = get(errors, name)
  const isValid = !error
  const isAllowed = (p: NumberFormatProps) => {
    if (!maxLength) return true
    if (p.value.toString().length > maxLength) return false
    return true
  }
  return (
    <div data-test-id={name}>
      <NumberFormat
        value={value}
        onValueChange={({value: inputValue}) => {
          setFieldValue(name, inputValue)
          if (error) setFieldError(name, undefined)
        }}
        isAllowed={isAllowed}
        mask={mask}
        allowEmptyFormatting={allowEmptyFormatting}
        format={format}
        thousandSeparator={thousandSeparator}
        placeholder={placeholder}
        className={`rounded-2xl bg-greyscale-50 py-4 px-5 w-full text-greyscale-900 text-body-16 ${
          disableTrack ? 'ym-disable-keys' : ''
        } ${isValid ? '' : 'border border-error text-error'}`}
      />
      <span className='text-body-12 text-error'>{error}</span>
    </div>
  )
}
export const FormikText: FC<
  {
    placeholder: string
    value: number
    rows?: number
    maxLength?: number
    type?: string
    disabled: boolean
    isTextarea?: boolean
    disableTrack?: boolean
    submitOnEnter?: boolean
  } & FieldProps
> = ({
  field,
  form,
  rows,
  placeholder,
  type = 'text',
  disabled,
  isTextarea,
  maxLength,
  disableTrack,
  submitOnEnter,
}) => {
  const {name, value} = field
  const {setFieldValue, errors, setFieldError} = form
  const error = get(errors, name)
  const isValid = !error
  const props = {
    'data-test-id': name,
    disabled,
    rows,
    type,
    value: value || '',
    onChange: (e) => {
      const str = e.target.value
      if (maxLength) {
        if (str.length <= maxLength) setFieldValue(name, str)
      } else {
        setFieldValue(name, str)
      }
      if (error) setFieldError(name, undefined)
    },
    placeholder,
    className: `border bg-greyscale-50 rounded-lg py-4 px-5 w-full text-greyscale-900 text-body-16 ${
      disableTrack ? 'ym-disable-keys' : ''
    } ${isValid ? 'border-greyscale-50' : 'border-error'}`,
    onKeyDown: (e) => {
      if (e.keyCode === 13 && e.shiftKey === false && submitOnEnter) {
        e.preventDefault()
        form.handleSubmit()
      }
    },
  }

  // eslint-disable-next-line react/jsx-props-no-spreading
  const Component = isTextarea ? <textarea {...props} /> : <input {...props} />
  return (
    <div className='flex flex-col'>
      {Component}
      <span className='text-body-12 text-error pt-3'>{error}</span>
    </div>
  )
}

export const FormikPassword: FC<
  {placeholder: string; value: number} & FieldProps
> = ({field, form, placeholder}) => {
  const {name, value} = field
  const {setFieldValue, errors} = form
  const error = get(errors, name)
  const isValid = !error
  const [type, setType] = useState('password')
  return (
    <div className='flex flex-col'>
      <div className='relative'>
        <input
          data-test-id={name}
          type={type}
          value={value || ''}
          onChange={(e) => {
            setFieldValue(name, e.target.value)
          }}
          placeholder={placeholder}
          className={`border bg-greyscale-50 rounded-lg py-4 px-5 pr-10 w-full text-greyscale-900 ym-disable-keys text-body-16 ${
            isValid ? 'border-greyscale-50' : 'border-error'
          }`}
        />
        <div className='absolute top-4 right-5'>
          {type === 'password' && (
            <Button onClick={() => setType('text')}>
              <IcVisibility className='fill-current text-black-c h-6 w-6' />
            </Button>
          )}
          {type === 'text' && (
            <Button onClick={() => setType('password')}>
              <IcHidden className='fill-current text-black-c h-6 w-6' />
            </Button>
          )}
        </div>
      </div>
      <span className='text-body-12 text-error pt-3'>{error}</span>
    </div>
  )
}

export const FormikRange: FC<FieldProps & IFormikRange> = ({
  field,
  form,
  placeholder,
}) => {
  const {name, value} = field
  const {setFieldValue, errors} = form
  const {t} = useTranslation()
  const error = get(errors, name)
  const isValid = !error
  const commonClass = `w-1/2 py-3 px-3.5 text-greyscale-900 text-body-14 ${
    isValid ? '' : 'border-error'
  }`
  const mappedValue = Array.isArray(value) ? value : ['', '']
  return (
    <div className='flex text-greyscale-900 text-body-14'>
      <NumberFormat
        value={mappedValue[0]}
        onValueChange={({value: min}) => {
          setFieldValue(name, [min, mappedValue[1]])
        }}
        thousandSeparator={' '}
        placeholder={t('TITLE_FROM', {title: placeholder})}
        className={`border rounded-l-2xl focus:relative ${commonClass}`}
      />
      <NumberFormat
        value={mappedValue[1]}
        onValueChange={({value: max}) => {
          setFieldValue(name, [mappedValue[0], max])
        }}
        thousandSeparator={' '}
        placeholder={t('UP_TO')}
        className={`border rounded-r-2xl focus:relative ${commonClass}`}
      />
    </div>
  )
}

export const FormikCheckbox: FC<IFormikCheckbox & FieldProps> = ({
  field,
  form,
  label,
  hideLabel,
  labelClassname,
}) => {
  const {name, value} = field
  const {setFieldValue, errors} = form
  const error = get(errors, name)

  const input = (
    <>
      <input
        type='checkbox'
        name={name}
        checked={value}
        id={name}
        onChange={() => setFieldValue(name, !value)}
        className='opacity-0 absolute h-4.5 w-4.5 cursor-pointer'
      />
      <div
        className={`bg-white border-2 rounded h-4.5 w-4.5 flex
       shrink-0 justify-center items-center mr-2 ${
         error ? 'border-error' : 'border-black-d'
       }`}>
        <IcCheck className='fill-current text-black-c h-4.5 w-4.5 hidden' />
      </div>
    </>
  )
  return (
    <div>
      {hideLabel ? (
        input
      ) : (
        // eslint-disable-next-line jsx-a11y/label-has-associated-control
        <label
          className={`select-none text-greyscale-900 cursor-pointer flex items-center ${labelClassname}`}>
          {input}
          <span
            dangerouslySetInnerHTML={{
              __html: label,
            }}
          />
        </label>
      )}
      <span className='text-body-12 text-error'>{error}</span>
    </div>
  )
}

export const FormikSwitch: FC<IFormikCheckbox & FieldProps> = ({
  field,
  form,
  label,
  hideLabel,
  labelPosition = 'left',
}) => {
  const {name, value} = field
  const {setFieldValue} = form
  const input = (
    <Switch
      offColor='#ACB9C3'
      onColor='#7210FF'
      uncheckedIcon={false}
      checkedIcon={false}
      height={16}
      width={28}
      handleDiameter={14}
      onChange={(checked) => setFieldValue(name, checked)}
      checked={!!value}
    />
  )
  return (
    <div>
      {hideLabel ? (
        input
      ) : (
        // eslint-disable-next-line jsx-a11y/label-has-associated-control
        <label className='flex items-center justify-between'>
          {label && (
            <span
              className={`text-greyscale-900 text-body-16 whitespace-nowrap ${
                labelPosition === 'left' ? 'mr-3' : 'order-last ml-3'
              }`}>
              {label}
            </span>
          )}
          {input}
        </label>
      )}
    </div>
  )
}

export const FormikDependentFields: FC<IFormikField> = ({field}) => {
  const {values, setFieldValue} = useFormikContext()
  const prevValues = useRef(values)
  const {width} = useWindowSize()
  // @ts-ignore
  const nextFields = values.fields
  // @ts-ignore
  const prevFields = prevValues.current.fields
  const [fields, setFields] = useState([
    {...field, value: nextFields[field.id]?.value},
  ])

  // @ts-ignore
  useEffect(async () => {
    console.log('fields', fields)
    const newFields = []
    let shouldClearNext = false
    // eslint-disable-next-line guard-for-in,no-restricted-syntax
    for (const index in fields) {
      const current = fields[index]
      const nextValue = nextFields[current.id]?.value
      const prevValue = prevFields[current.id]?.value

      if (shouldClearNext) {
        setFieldValue(`fields.${current.id}`, undefined)
      } else if (nextValue !== prevValue) {
        if (nextValue) {
          newFields.push({...current, value: nextValue})
          const result =
            get(
              // eslint-disable-next-line no-await-in-loop
              await makeRequest({
                url: '/api/field-dependent',
                method: 'post',
                data: {
                  dependenceSequenceId: field.dependenceSequenceId,
                  dependenceSequence: newFields.map(
                    (f) => nextFields[f.id]?.value,
                  ),
                  otherValueWasSelected: true,
                },
              }),
              'data.result',
            ) || {}
          setFields([
            ...newFields,
            ...(result.nextField ? [result.nextField] : []),
          ])
          shouldClearNext = true
        }
      } else {
        newFields.push({...current, value: nextValue})
      }
    }

    if (!isEqual(nextFields, prevFields)) {
      prevValues.current = values
    }
  }, [values])
  return (
    <>
      {fields.map((f) => (
        <AdvertFormField
          key={f.id}
          id={`form-field-${f.fieldType}-${f.slug}`}
          body={
            <div className='w-full s:w-1/2 l:w-5/12'>
              <FormikCreateField field={f} />
            </div>
          }
          labelClassName='text-greyscale-900'
          orientation={width >= 768 ? 'horizontal' : 'vertical'}
          isRequired={f.isFillingRequired}
          label={f.name}
        />
      ))}
    </>
  )
}
export const FormikSelect: FC<IFormikSelect & FieldProps> = ({
  field,
  form,
  options,
  placeholder,
  isFilterable,
  isMulti,
  isClearable,
}) => {
  const {width} = useWindowSize()
  const {name, value} = field
  const {setFieldValue, errors, setFieldError} = form
  const error = get(errors, name)
  const props = {
    id: name,
    value: value || [],
    options,
    isClearable,
    placeholder,
    isSearchable: isFilterable,
    isMulti,
    isInvalid: !!error,
    onChange: (item) => {
      setFieldValue(name, item)
      if (error) setFieldError(name, undefined)
    },
  }

  return (
    <>
      {width >= 768 ? (
        //  eslint-disable-next-line react/jsx-props-no-spreading
        <Select {...props} />
      ) : (
        // eslint-disable-next-line react/jsx-props-no-spreading
        <MobileSelect {...props} />
      )}
      <span className='text-body-12 text-error'>{error}</span>
    </>
  )
}
