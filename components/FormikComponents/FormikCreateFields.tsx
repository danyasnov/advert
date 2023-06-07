import React, {FC} from 'react'
import {useWindowSize} from 'react-use'
import {isEmpty} from 'lodash'
import AdvertFormField from '../AdvertWizard/AdvertFormField'
import {getSelectOptions} from './utils'
import {IFormikDependentField} from '../../types'
import FormikDependentFields from './FormikDependentFields'
import FormikTitle from './FormikTitle'
import FormikCheckboxesGroup from './FormikCheckboxesGroup'
import FormikCreateField from './FormikCreateField'

const FormikCreateFields: FC<
  {
    fieldsArray: any[]
    id?: number
    hasArrayType?: boolean
  } & IFormikDependentField
> = ({fieldsArray, id, hasArrayType, onFieldsChange}) => {
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

    // eslint-disable-next-line no-underscore-dangle
    if (!isEmptyOptions && f.itemType !== 'title' && !f._dependenceSequenceId) {
      if (f.dependenceSequenceId) {
        return (
          <FormikDependentFields
            key={f.id}
            field={f}
            allFields={fields}
            onFieldsChange={onFieldsChange}
          />
        )
      }
      return (
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
          label={width < 768 && f.fieldType === 'checkbox' ? undefined : f.name}
        />
      )
    }
    if (f.itemType === 'title') {
      return <FormikTitle key={f.id} label={f.name} />
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

export default FormikCreateFields
