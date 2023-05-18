import React, {FC, useEffect, useRef, useState} from 'react'
import {useFormikContext} from 'formik'
import {useWindowSize} from 'react-use'
import {get, isEqual, size} from 'lodash'
import {makeRequest} from '../../api'
import AdvertFormField from '../AdvertWizard/AdvertFormField'
import {IFormikDependentField, IFormikField} from '../../types'
import FormikCreateField from './FormikCreateField'

const FormikDependentFields: FC<IFormikField & IFormikDependentField> = ({
  field,
  onFieldsChange,
  allFields,
}) => {
  const {values, setFieldValue} = useFormikContext()
  const prevValues = useRef(values)
  const [isInited, setIsInited] = useState(false)
  const {width} = useWindowSize()
  // @ts-ignore
  const nextFields = values.fields
  // @ts-ignore
  const prevFields = prevValues.current.fields
  const [fields, setFields] = useState([
    {...field, value: nextFields[field.id]?.value},
    ...allFields
      // eslint-disable-next-line no-underscore-dangle
      // @ts-ignore
      .filter((f) => f._dependenceSequenceId === field.dependenceSequenceId)
      .map((f) => ({...f, value: nextFields[f.id]?.value})),
  ])

  // @ts-ignore
  useEffect(() => {
    const cb = async () => {
      const newFields = []
      let shouldClearNext = false
      let otherValueWasSelected = false
      // eslint-disable-next-line guard-for-in,no-restricted-syntax
      for (const index in fields) {
        const current = fields[index]
        const nextValue = nextFields[current.id]?.value
        const prevValue = prevFields[current.id]?.value
        const currentOption = current.multiselects.top.find(
          (o) => o.id === nextValue,
        )
        if (currentOption && !otherValueWasSelected) {
          otherValueWasSelected = !currentOption.isVisible
        }

        if (shouldClearNext) {
          setFieldValue(`fields.${current.id}`, undefined)
        } else if (nextValue !== prevValue || !isInited) {
          setIsInited(true)
          // @todo fix multiple requests
          if (nextValue) {
            newFields.push({...current, value: nextValue})
            const params = {
              dependenceSequenceId: field.dependenceSequenceId,
              dependenceSequence: newFields.map((f) => nextFields[f.id]?.value),
              otherValueWasSelected,
            }

            const result =
              get(
                // eslint-disable-next-line no-await-in-loop
                await makeRequest({
                  url: '/api/field-dependent',
                  method: 'post',
                  data: params,
                }),
                'data.result',
              ) || {}
            const resultFields = [
              ...newFields,
              ...(result.nextField ? [result.nextField] : []),
            ]
            setFields(resultFields)
            if (size(resultFields) > 1) {
              onFieldsChange(resultFields)
            }
            if (isInited) shouldClearNext = true
          }
        } else {
          newFields.push({...current, value: nextValue})
        }
      }

      if (!isEqual(nextFields, prevFields)) {
        prevValues.current = values
      }
    }
    cb()
  }, [values])
  return (
    <>
      {fields.map((f) => (
        <AdvertFormField
          key={f.id}
          id={`form-field-${f.fieldType}-${f.slug}`}
          body={
            <div className='w-full s:w-1/2 l:w-72'>
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

export default FormikDependentFields
