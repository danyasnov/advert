import {FC, useState} from 'react'
import {Field, FieldProps} from 'formik'
import {useTranslation} from 'next-i18next'
import NumberFormat, {NumberFormatProps} from 'react-number-format'
import IcCheck from 'icons/material/Check.svg'
import {CACategoryDataFieldModel} from 'front-api/src/models/index'
import {get, isEmpty, toNumber} from 'lodash'
import IcVisibility from 'icons/material/Visibility.svg'
import IcHidden from 'icons/material/Hidden.svg'
import Switch from 'react-switch'
import {toast} from 'react-toastify'
import {useWindowSize} from 'react-use'
import Select, {SelectItem} from './Selects/Select'
import Button from './Buttons/Button'
import MobileSelect from './Selects/MobileSelect'
import AdvertFormField from './AdvertWizard/AdvertFormField'

interface IFormikSegmented {
  options: SelectItem[]
}
interface IFormikCheckbox {
  label: string
  hideLabel?: boolean
  labelPosition?: 'left' | 'right'
}
interface IFormikSelect {
  label: string
  options: SelectItem[]
  placeholder: string
  isFilterable: boolean
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
export const FormikCreateFields: FC<{fieldsArray: any[]}> = ({fieldsArray}) => {
  const {width} = useWindowSize()

  return fieldsArray.map((f) => {
    if (f.fieldType === 'array') {
      return <FormikCreateFields fieldsArray={f.arrayTypeFields} />
    }
    const isEmptyOptions =
      isEmpty(getSelectOptions(f.multiselects)) &&
      ['select', 'multiselect', 'iconselect'].includes(f.fieldType)
    if (!isEmptyOptions) {
      return (
        <AdvertFormField
          key={f.id}
          body={
            <div className='w-full s:w-1/2 l:w-5/12'>
              <FormikCreateField field={f} />
            </div>
          }
          className='l:items-center'
          isRequired={f.isFillingRequired}
          label={width < 768 && f.fieldType === 'checkbox' ? undefined : f.name}
        />
      )
    }
    return null
  })
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
  } = field
  let component
  const props: FieldOptions = {}
  switch (fieldType) {
    case 'select':
    case 'iconselect':
    case 'multiselect': {
      component = FormikSelect
      props.options = getSelectOptions(field.multiselects)
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
      toast.error(msg)
    }
    if (minValue || maxValue) {
      const num = toNumber(value)
      if (num < minValue || num > maxValue) {
        const error = t('VALUE_MUST_BE_BETWEEN', {
          fieldName: name,
          min: minValue,
          max: maxValue,
        })
        toast.error(msg)
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
          className={`h-7 text-body-2 text-black-c flex-1 border-t border-b
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
  const {setFieldValue, errors} = form
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
        }}
        isAllowed={isAllowed}
        mask={mask}
        allowEmptyFormatting={allowEmptyFormatting}
        format={format}
        thousandSeparator={thousandSeparator}
        placeholder={placeholder}
        className={`border rounded-lg py-3 px-3.5 w-full text-black-b text-body-2 ${
          disableTrack ? 'ym-disable-keys' : ''
        } ${isValid ? '' : 'border-error'}`}
      />
      <span className='text-body-3 text-error'>{error}</span>
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
}) => {
  const {name, value} = field
  const {setFieldValue, errors} = form
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
    },
    placeholder,
    className: `border rounded-lg py-3 px-3.5 w-full text-black-b text-body-2 ${
      disableTrack ? 'ym-disable-keys' : ''
    } ${isValid ? 'border-shadow-b' : 'border-error'}`,
  }
  // eslint-disable-next-line react/jsx-props-no-spreading
  const Component = isTextarea ? <textarea {...props} /> : <input {...props} />
  return (
    <div className='flex flex-col'>
      {Component}
      <span className='text-body-3 text-error'>{error}</span>
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
          className={`border rounded-lg py-3 pl-3.5 pr-10 w-full text-black-b ym-disable-keys text-body-2 ${
            isValid ? 'border-shadow-b' : 'border-error'
          }`}
        />
        <div className='absolute top-2 right-2'>
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
      <span className='text-body-3 text-error'>{error}</span>
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
  const commonClass = `w-1/2 py-3 px-3.5 text-black-b text-body-2 ${
    isValid ? '' : 'border-error'
  }`
  const mappedValue = Array.isArray(value) ? value : ['', '']
  return (
    <div className='flex text-black-b text-body-2'>
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
}) => {
  const {name, value} = field
  const {setFieldValue} = form
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
        className='bg-white border-2 rounded border-black-d h-4.5 w-4.5 flex
       shrink-0 justify-center items-center mr-2'>
        <IcCheck className='fill-current text-black-c h-4.5 w-4.5 hidden' />
      </div>
    </>
  )
  return (
    <div className=''>
      {hideLabel ? (
        input
      ) : (
        // eslint-disable-next-line jsx-a11y/label-has-associated-control
        <label className='select-none text-black-b cursor-pointer flex items-center'>
          {input}
          {label}
        </label>
      )}
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
      onColor='#FF8514'
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
              className={`text-nc-title text-body-1 whitespace-nowrap ${
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

export const FormikSelect: FC<IFormikSelect & FieldProps> = ({
  field,
  form,
  options,
  placeholder,
  isFilterable,
  isMulti,
}) => {
  const {name, value} = field
  const {setFieldValue, errors} = form
  const error = get(errors, name)
  const props = {
    id: name,
    value: value || [],
    options,
    isClearable: true,
    placeholder,
    isSearchable: isFilterable,
    isMulti,
    isInvalid: !!error,
    onChange: (item) => setFieldValue(name, item),
  }

  return (
    <>
      <div className='hidden s:block'>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Select {...props} />
      </div>
      <div className='block s:hidden'>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <MobileSelect {...props} />
      </div>
      <span className='text-body-3 text-error'>{error}</span>
    </>
  )
}
