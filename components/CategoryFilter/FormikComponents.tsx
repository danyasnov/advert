import {FC} from 'react'
import {Field, FieldProps} from 'formik'
import {useTranslation} from 'next-i18next'
import NumberFormat from 'react-number-format'
import IcCheck from 'icons/material/Check.svg'
import {CACategoryDataFieldModel} from 'front-api/src/models/index'
import {get} from 'lodash'
import Select, {SelectItem} from '../Selects/Select'
import Button from '../Buttons/Button'

interface IFormikSegmented {
  options: SelectItem[]
}
interface IFormikCheckbox {
  label: string
}
interface IFormikSelect {
  label: string
  options: SelectItem[]
  placeholder: string
  isFilterable: boolean
  isMulti: boolean
}
interface IFormikNumber {
  placeholder: string
  minValue?: number
  maxValue?: number
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
  maxValue?: number
  minValue?: number
  validate?: (value: any) => string
}

const getSelectOptions = (o) => ({
  value: o.id,
  label: o.value,
  // disabled: o.count === 0,
})

export const FormikField: FC<IFormikField> = ({field}) => {
  // @ts-ignore
  const {
    fieldType,
    multiselects,
    id,
    name,
    isFilterable,
    maxValue,
    minValue,
    slug,
  } = field
  let component
  const props: FieldOptions = {}
  switch (fieldType) {
    case 'select':
    case 'iconselect':
    case 'multiselect': {
      component = FormikSelect
      props.options = [
        // @ts-ignore
        ...multiselects.top.map(getSelectOptions),
        // @ts-ignore
        ...(multiselects.other
          ? // @ts-ignore
            multiselects.other
          : []
        ).map(getSelectOptions),
      ]
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
  placeholder,
}) => {
  const {name, value} = field
  const {setFieldValue, errors} = form
  const isValid = !errors[name]
  return (
    <NumberFormat
      value={value || ''}
      onValueChange={({floatValue}) => {
        setFieldValue(name, floatValue)
      }}
      thousandSeparator={' '}
      placeholder={placeholder}
      className={`border rounded-lg py-3 px-3.5 w-full text-black-b text-body-2 ${
        isValid ? '' : 'border-error'
      }`}
    />
  )
}
export const FormikText: FC<IFormikNumber & FieldProps> = ({
  field,
  form,
  placeholder,
}) => {
  const {name, value} = field
  const {setFieldValue, errors} = form
  const isValid = !errors[name]
  return (
    <input
      value={value || ''}
      onChange={(e) => {
        setFieldValue(name, e.target.value)
      }}
      placeholder={placeholder}
      className={`border rounded-lg py-3 px-3.5 w-full text-black-b text-body-2 ${
        isValid ? '' : 'border-error'
      }`}
    />
  )
}

export const FormikRange: FC<FieldProps & IFormikNumber> = ({
  field,
  form,
  placeholder,
}) => {
  const {name, value} = field
  const {setFieldValue, errors} = form
  const {t} = useTranslation()
  const isValid = !get(errors, name)
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
        className={`border rounded-l-2xl ${commonClass}`}
      />
      <NumberFormat
        value={mappedValue[1]}
        onValueChange={({value: max}) => {
          setFieldValue(name, [mappedValue[0], max])
        }}
        thousandSeparator={' '}
        placeholder={t('UP_TO')}
        className={`border-t border-b border-r rounded-r-2xl ${commonClass}`}
      />
    </div>
  )
}

export const FormikCheckbox: FC<IFormikCheckbox & FieldProps> = ({
  field,
  form,
  label,
}) => {
  const {name, value} = field
  const {setFieldValue} = form
  return (
    <div className=''>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className='select-none text-black-b cursor-pointer flex items-center'>
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
       flex-shrink-0 justify-center items-center mr-2'>
          <IcCheck className='fill-current text-black-c h-4.5 w-4.5 hidden' />
        </div>
        {label}
      </label>
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
  const {setFieldValue} = form
  return (
    <Select
      id={name}
      value={value || []}
      options={options}
      isClearable
      placeholder={placeholder}
      isSearchable={isFilterable}
      isMulti={isMulti}
      onChange={(item) => setFieldValue(name, item)}
    />
  )
}
