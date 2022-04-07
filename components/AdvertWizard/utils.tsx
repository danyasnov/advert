import {get, isEmpty, isEqual, omit, parseInt, size, toNumber} from 'lodash'
import {
  CACategoryDataFieldModel,
  CACategoryDataModel,
  FieldsModel,
} from 'front-api/src/models'
import {FC, ReactNode, useEffect, useRef, useState} from 'react'
import {FormikErrors, useFormikContext} from 'formik'
import ReactModal from 'react-modal'
import IcClear from 'icons/material/Clear.svg'
import IcKeyboardArrowRight from 'icons/material/KeyboardArrowRight.svg'
import IcCheck from 'icons/material/Check.svg'
import {useTranslation} from 'next-i18next'
import {toast} from 'react-toastify'
import IcKeyboardArrowLeft from 'icons/material/KeyboardArrowLeft.svg'
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
      return [...acc, [value.id, value]]
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

export const hasErrors = (errors: FormikErrors<any>) => {
  return !isEmpty(omit(errors, ['fields'])) || !isEmpty(errors?.fields)
}

export const scrollToFirstError = (): void => {
  setTimeout(() => {
    const inputs = document.querySelectorAll(`.border-error`)
    const input = Array.from(inputs).find((i: HTMLElement) => {
      return i?.offsetParent
    })

    if (input) {
      const formGroup = input.closest('.invalid-group')

      if (formGroup && input) {
        formGroup.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
      } else if (input) {
        input.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
      }
    }
  })
}

export const validateTitle = (content, t) => {
  const errors: FormikErrors<any> = {}
  const title = get(content, '[0].title', '')
  if (title?.length < 3) {
    errors.content = t('EMPTY_TITLE_AND_DESCRIPTION')
  }
  return errors
}

export const validatePhoto = (photos, minPhotos, t) => {
  const errors: FormikErrors<any> = {}
  if (size(photos) < minPhotos) {
    const msg = t('PHOTO_ERROR', {minPhotos})
    errors.photos = msg
  }
  return errors
}

export const validatePrice = (price, allowFree, t) => {
  const errors: FormikErrors<any> = {}
  if (!price && !allowFree) {
    errors.price = t('PRICE_ERROR')
  }
  return errors
}

export const validateCondition = (condition, allowUsed, t) => {
  const errors: FormikErrors<any> = {}
  if (!condition && allowUsed) {
    errors.condition = t('FIELD_REQUIRED_ERROR', {
      field: t('ADVERT_TYPE'),
    })
  }
  return errors
}

export const validateFields = (values, fields, t) => {
  const errors: FormikErrors<any> = {fields: {}}
  fields.forEach(({isFillingRequired, minValue, maxValue, name, id}) => {
    let msg
    const value = get(values, `fields.${id}`)
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
    if (msg) errors.fields[id] = msg
  })

  return errors
}

export const FormGroup: FC<{
  header: ReactNode
  body: ReactNode
  id?: string
  title: string
  hide?: boolean
  showWholeForm: boolean
  getCountMeta: () => Record<string, unknown>
  validate: () => FormikErrors<any>
}> = ({
  header,
  body,
  id,
  title,
  validate,
  getCountMeta,
  hide,
  showWholeForm,
}) => {
  const {t} = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(true)
  const prevValidationState = useRef({})
  const [showSummaryErrors, setShowSummaryErrors] = useState(false)
  useDisableBodyScroll(isOpen)
  const formik = useFormikContext()
  const countMeta = getCountMeta()
  useEffect(() => {
    if (formik.submitCount > 0) {
      const validationState = validate()
      const isNew = !isEqual(validationState, prevValidationState.current)
      if (isNew) {
        prevValidationState.current = validationState
        setShowSummaryErrors(hasErrors(validationState))
      }
    }
  }, [formik.values, formik.submitCount])

  if (hide) return null

  return (
    <>
      <div className='m:hidden'>
        {isOpen ? (
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
                <p className='pl-4 text-nc-title text-h-2 font-medium'>
                  {title}
                </p>
              </div>
              <div className='px-4 pt-4 pb-20'>{body}</div>
              <div className='fixed inset-x-0 bottom-0 flex justify-between bg-white shadow-2xl px-8 py-2.5 z-10 justify-around'>
                <PrimaryButton
                  onClick={() => {
                    // @ts-ignore
                    const errors = validate()
                    formik.setErrors(errors)
                    if (!hasErrors(errors)) {
                      setIsOpen(false)
                    } else {
                      toast.error(t('ADVERT_CREATING_HELP_ALERT'))
                      scrollToFirstError()
                    }
                  }}
                  className='w-full s:w-auto'>
                  {t('CONTINUE')}
                </PrimaryButton>
              </div>
            </div>
          </ReactModal>
        ) : (
          <>
            {showWholeForm ? (
              <div className='mb-6'>
                {header}
                {body}
              </div>
            ) : (
              <Button
                className='w-full shadow rounded-lg '
                onClick={() => {
                  setIsOpen(true)
                }}>
                <div className='flex w-full px-4 py-3 s:px-8 s:pt-6 s:pb-8'>
                  <div className='w-full flex flex-col items-start'>
                    <span className='text-nc-primary-text text-body-1 pb-1'>
                      {title}
                    </span>
                    <span
                      className={`text-body-3 s:text-body-1 ${
                        showSummaryErrors
                          ? 'text-nc-error'
                          : 'text-nc-secondary-text'
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
            )}
          </>
        )}
      </div>
      <div className='hidden m:block'>
        {showWholeForm ? (
          <div className='mb-6 flex flex-col space-y-4'>
            {header}
            {body}
          </div>
        ) : (
          <div
            data-test-id={id}
            className={`p-8 shadow rounded-lg hidden s:block max-w-[656px] ${
              !countMeta.isRequiredFilled && !isExpanded ? 'invalid-group' : ''
            }`}>
            <div className='flex flex-col'>
              <div className='flex justify-between'>
                {header}
                <Button onClick={() => setIsExpanded(!isExpanded)}>
                  <IcKeyboardArrowLeft
                    className={`fill-current text-black-c w-6 h-6 ${
                      isExpanded ? 'rotate-90' : '-rotate-90'
                    }`}
                  />
                </Button>
              </div>
              <div className='text-body-2 text-nc-secondary-text mt-1'>
                <span
                  className={
                    !countMeta.isRequiredFilled && !isExpanded
                      ? 'text-nc-error'
                      : ''
                  }>
                  {t('NUMBER_FROM_NUMBER', {
                    from: countMeta.filledCount,
                    to: countMeta.maxFilled,
                  })}
                </span>
              </div>
            </div>
            <div
              className={`${isExpanded ? 'static' : 'absolute hidden'} pt-6`}>
              {body}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
