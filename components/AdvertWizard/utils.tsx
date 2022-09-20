import {get, isEmpty, isEqual, omit, parseInt, size, toNumber} from 'lodash'
import {
  CACategoryDataFieldModel,
  CACategoryDataModel,
  FieldsModel,
} from 'front-api/src/models'
import {FC, ReactNode, useEffect, useRef, useState} from 'react'
import {FormikErrors, useFormikContext} from 'formik'
import ReactModal from 'react-modal'
import {useTranslation} from 'next-i18next'
import {toast} from 'react-toastify'
import IcKeyboardArrowLeft from 'icons/material/KeyboardArrowLeft.svg'
import {ArrowLeft, TickSquare} from 'react-iconly'
import IcArrowDown from 'icons/material/ArrowDown.svg'
import Button from '../Buttons/Button'
import useDisableBodyScroll from '../../hooks/useDisableBodyScroll'
import PrimaryButton from '../Buttons/PrimaryButton'
import {AdvertPages} from './AdvertWizard'
import OutlineButton from '../Buttons/OutlineButton'

export const findSelectValue = (id, options) => {
  const option = options.find((o) => id === o.id) || {}
  return {
    label: option.value,
    value: option.id,
  }
}

export const getFields = (
  fieldsById: Record<string, CACategoryDataFieldModel>,
) => {
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
        if (!field) return [key]
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
export const validateCommunication = (phone, t) => {
  const errors: FormikErrors<any> = {}
  if (!phone) {
    errors.phone = t('FIELD_REQUIRED_ERROR', {
      field: t('FORM_PHONE'),
    })
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

export const validateCondition = (condition, allowUsed, isProduct, t) => {
  const errors: FormikErrors<any> = {}
  if (!condition && allowUsed && isProduct) {
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
            overlayClassName='z-30 fixed inset-0 '
            className='w-full h-full bg-white overflow-y-scroll'>
            <div className='flex flex-col w-full'>
              <div className='flex items-center h-14 px-4 s:px-8 space-x-2'>
                <Button
                  onClick={() => {
                    formik.setErrors({})
                    setIsOpen(false)
                  }}>
                  <ArrowLeft size={28} />
                </Button>
                <h2 className='text-h-5 font-bold'>{title}</h2>
              </div>
              <div className='px-4 s:px-8 pt-4 pb-20'>{body}</div>
              <div className='fixed inset-x-0 bottom-0 flex justify-between bg-white shadow-2xl px-4 s:px-8 py-2.5 z-10 space-x-2'>
                <OutlineButton
                  className='w-full s:w-auto'
                  id='ad-back-button'
                  onClick={() => {
                    formik.setErrors({})
                    setIsOpen(false)
                  }}>
                  {t('BACK')}
                </OutlineButton>
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
                className='w-full rounded-3xl drop-shadow-card bg-white'
                onClick={() => {
                  setIsOpen(true)
                }}>
                <div className='flex w-full px-4 py-3 s:px-8 s:pt-6 s:pb-8'>
                  <div className='w-full flex flex-col items-start'>
                    <div className='pb-1 font-semibold text-body-16'>
                      <span className='text-greyscale-900'>{title}</span>
                      {countMeta.isRequired && (
                        <span className='text-error pl-1'>*</span>
                      )}
                    </div>

                    <span
                      className={`text-body-14 s:text-body-16 font-normal ${
                        showSummaryErrors ? 'text-error' : 'text-greyscale-600'
                      }`}>
                      {t('NUMBER_FROM_NUMBER', {
                        from: countMeta.filledCount,
                        to: countMeta.maxFilled,
                      })}
                    </span>
                  </div>
                  <div className='flex items-center justify-center'>
                    {countMeta.isRequiredFilled ? (
                      <div className='text-primary-500'>
                        <TickSquare filled size={24} />
                      </div>
                    ) : (
                      <IcArrowDown className='fill-current text-greyscale-600 h-6 w-6 -rotate-90' />
                    )}
                  </div>
                </div>
              </Button>
            )}
          </>
        )}
      </div>
      <div className='hidden m:block bg-white'>
        {showWholeForm ? (
          <div className='not-last:mb-6 flex flex-col space-y-4'>
            {header}
            {body}
          </div>
        ) : (
          <div
            data-test-id={id}
            className={`p-8 rounded-lg hidden s:block max-w-[656px] ${
              !countMeta.isRequiredFilled && !isExpanded ? 'invalid-group' : ''
            }`}>
            <div className='flex flex-col pb-3'>
              <div className='flex justify-between'>
                {header}
                <Button onClick={() => setIsExpanded(!isExpanded)}>
                  <IcKeyboardArrowLeft
                    className={`fill-current text-black-c w-6 h-6 m:hidden ${
                      isExpanded ? 'rotate-90' : '-rotate-90'
                    }`}
                  />
                </Button>
              </div>
              <div className='text-body-14 text-greyscale-900 mt-1 m:hidden'>
                <span
                  className={
                    !countMeta.isRequiredFilled && !isExpanded
                      ? 'text-error'
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
