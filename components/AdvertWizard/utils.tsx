import {get, isEmpty, parseInt, size, toNumber} from 'lodash'
import {
  CACategoryDataFieldModel,
  CACategoryDataModel,
  FieldsModel,
} from 'front-api/src/models'
import {FC, ReactNode, useEffect, useState} from 'react'
import {useFormikContext} from 'formik'
import ReactModal from 'react-modal'
import IcClear from 'icons/material/Clear.svg'
import IcKeyboardArrowRight from 'icons/material/KeyboardArrowRight.svg'
import IcCheck from 'icons/material/Check.svg'
import {useTranslation} from 'next-i18next'
import {toast} from 'react-toastify'
import Button from '../Buttons/Button'
import useDisableBodyScroll from '../../hooks/useDisableBodyScroll'
import PrimaryButton from '../Buttons/PrimaryButton'

export const findSelectValue = (id, options) => {
  const option = options.find((o) => id === o.id) || {}
  return {
    label: option.value,
    value: option.id,
  }
}

const getFields = (fieldsById: Record<string, CACategoryDataFieldModel>) => {
  return Object.fromEntries(
    Object.entries(fieldsById).reduce((acc, [, value]) => {
      // @ts-ignore
      if (value.fieldType === 'array') {
        return [...acc, ...value.arrayTypeFields.map((f) => [f.id, f])]
      }
      return acc
    }, []),
  )
}

export const mapFormikFields = (rawFields = [], fieldsById = {}) => {
  return Object.fromEntries(
    Object.entries(rawFields)
      .map(([key, value]) => {
        const field = getFields(fieldsById)[key]
        let mappedValue
        switch (field.fieldType) {
          case 'select':
          case 'iconselect': {
            // @ts-ignore
            if (value?.value) {
              // @ts-ignore
              mappedValue = [value.value]
            }
            break
          }
          case 'multiselect': {
            if (Array.isArray(value) && value.length) {
              mappedValue = value.map((v) => v.value)
            }
            break
          }
          case 'int': {
            const formattedValue = parseInt(value as string, 10)
            if (!Number.isNaN(formattedValue)) {
              mappedValue = [formattedValue]
            }
            break
          }
          default: {
            if (value) mappedValue = [value]
          }
        }
        return [key, mappedValue]
      })
      .filter(([, value]) => !!value),
  )
}
export const mapOriginalFields = (rawFields = {}, fieldsById = {}) => {
  return Object.fromEntries(
    Object.entries(rawFields)
      .map(([key, value]) => {
        const field = getFields(fieldsById)[key]
        let mappedValue
        switch (field.fieldType) {
          case 'select':
          case 'iconselect': {
            mappedValue = findSelectValue(value[0], field.multiselects.top)
            break
          }
          case 'multiselect': {
            if (Array.isArray(value) && value.length) {
              mappedValue = value.map((v) =>
                findSelectValue(v, field.multiselects.top),
              )
            }
            break
          }
          default: {
            // eslint-disable-next-line prefer-destructuring
            if (value) mappedValue = value[0]
          }
        }
        return [key, mappedValue]
      })
      .filter(([, value]) => !!value),
  )
}
export const mapCategoryData = (
  category: CACategoryDataModel,
): {
  data: CACategoryDataModel
  fieldsById: Record<string, CACategoryDataFieldModel>
} => {
  return {
    data: category,
    fieldsById: category.fields.reduce((acc, value) => {
      acc[value.id] = value
      return acc
    }, {}),
  }
}

export const CategoryUpdater: FC<{
  onChangeFields: (fields: FieldsModel) => void
}> = ({onChangeFields}) => {
  const {values} = useFormikContext()
  useEffect(() => {
    // @ts-ignore
    onChangeFields(values.fields)
    // @ts-ignore
  }, [values.fields])
  return null
}

export const validateTitle = (content, mainLanguage, t, silently?) => {
  const errors: Record<string, unknown> = {}
  const mainContent = (content || []).find(
    (c) => c.langCode === mainLanguage.isoCode,
  )
  if (!mainContent?.title) {
    errors.content = t('EMPTY_TITLE_AND_DESCRIPTION')
    if (!silently) toast.error(errors.content)
  }
  return errors
}

export const validatePhoto = (photos, minPhotos, t, silently?) => {
  const errors: Record<string, unknown> = {}
  if (size(photos) < minPhotos) {
    const msg = t('PHOTO_ERROR', {minPhotos})
    errors.photos = msg
    if (!silently) toast.error(msg)
  }
  return errors
}

export const validatePrice = (price, allowFree, t, silently?) => {
  const errors: Record<string, unknown> = {}
  if (!price && !allowFree) {
    errors.price = t('PRICE_ERROR')
    if (!silently) toast.error(errors.price)
  }
  return errors
}

export const validateCondition = (condition, allowUsed, t, silently?) => {
  const errors: Record<string, unknown> = {}
  if (!condition && allowUsed) {
    errors.condition = t('FIELD_REQUIRED_ERROR', {
      field: t('ADVERT_TYPE'),
    })
    if (!silently) toast.error(errors.condition)
  }
  return errors
}

export const validateFields = (values, fields, t, silently?) => {
  const errors: Record<string, unknown> = {}
  fields.forEach(({isFillingRequired, minValue, maxValue, name, id}) => {
    let msg
    const value = get(values, `fields.${id}`)
    if (isFillingRequired && !value) {
      msg = t('FIELD_REQUIRED_ERROR', {
        field: name,
      })
      if (!silently) toast.error(msg)
    }
    if (minValue || maxValue) {
      const num = toNumber(value)
      if (num < minValue || num > maxValue) {
        const error = t('VALUE_MUST_BE_BETWEEN', {
          fieldName: name,
          min: minValue,
          max: maxValue,
        })
        if (!silently) toast.error(msg)
        msg = error
      }
    }
    if (msg) errors[id] = msg
  })

  return errors
}

export const FormGroup: FC<{
  header: ReactNode
  body: ReactNode
  expandView: boolean
  title: string
  getCountMeta: () => Record<string, unknown>
  validate: (silently: boolean) => Record<string, unknown>
}> = ({header, body, expandView, title, validate, getCountMeta}) => {
  const {t} = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [submitCount, setSubmitCount] = useState(0)
  const [showSummaryErrors, setShowSummaryErrors] = useState(false)
  useDisableBodyScroll(isOpen)
  const formik = useFormikContext()
  const countMeta = getCountMeta()
  useEffect(() => {
    if (formik.submitCount !== submitCount) {
      setSubmitCount(formik.submitCount)
      const errors = validate(true)
      setShowSummaryErrors(!isEmpty(errors))
    }
  }, [formik.submitCount])
  if (expandView) {
    if (isOpen) {
      return (
        <ReactModal
          isOpen={isOpen}
          preventScroll
          onRequestClose={() => setIsOpen(false)}
          shouldCloseOnOverlayClick={false}
          ariaHideApp={false}
          overlayClassName='z-30 fixed inset-0'
          className='w-full h-full bg-white overflow-y-scroll'>
          <div className='flex flex-col w-full'>
            <div className='flex  border-b border-shadow-b items-center h-14 px-4'>
              <Button
                onClick={() => {
                  formik.setErrors({})
                  setIsOpen(false)
                }}>
                <IcClear className='fill-current text-nc-icon h-6 w-6' />
              </Button>
              <p className='pl-4 text-nc-title text-h-2 font-medium'>{title}</p>
            </div>
            <div className='px-4 pt-4 pb-20'>{body}</div>
            <div className='fixed inset-x-0 bottom-0 flex justify-between bg-white shadow-2xl px-8 py-2.5 z-10 justify-around'>
              <PrimaryButton
                onClick={() => {
                  // @ts-ignore
                  const errors = validate()
                  formik.setErrors(errors)
                  if (isEmpty(errors)) {
                    setIsOpen(false)
                  }
                }}
                className='w-full s:w-auto'>
                {t('CONTINUE')}
              </PrimaryButton>
            </div>
          </div>
        </ReactModal>
      )
    }
    return (
      <Button
        className='w-full shadow-md	 rounded-lg '
        onClick={() => {
          setIsOpen(true)
        }}>
        <div className='flex w-full px-4 py-3'>
          <div className='w-full flex flex-col items-start'>
            <span className='text-nc-primary-text text-body-1 pb-1'>
              {title}
            </span>
            <span
              className={`text-body-3 ${
                showSummaryErrors ? 'text-nc-error' : 'text-nc-link'
              }`}>
              {t('NUMBER_FROM_NUMBER', {
                from: countMeta.filledCount,
                to: countMeta.maxFilled,
              })}
            </span>
          </div>
          <div>
            {countMeta.isRequiredFilled ? (
              <div className='w-6 h-6 rounded-full flex items-center justify-center bg-nc-success'>
                <IcCheck className='fill-current text-white w-3 h-3' />
              </div>
            ) : (
              <IcKeyboardArrowRight className='fill-current text-nc-icon w-5 h-5' />
            )}
          </div>
        </div>
      </Button>
    )
  }
  return (
    <div>
      {header}
      {body}
    </div>
  )
}
