import React, {FC} from 'react'
import {isEmpty} from 'lodash'
import {CACategoryDataFieldModel} from 'front-api'
import {getSelectOptions} from './utils'
import FormikFilterField from './FormikFilterField'

const FormikFilterFields: FC<{
  fieldsArray: CACategoryDataFieldModel[]
}> = ({fieldsArray}) => {
  return (
    <>
      {fieldsArray.map((f) => {
        // @ts-ignore
        if (f.fieldType === 'array') {
          return (
            <FormikFilterFields key={f.id} fieldsArray={f.arrayTypeFields} />
          )
        }
        const isEmptyOptions =
          isEmpty(getSelectOptions(f.multiselects)) &&
          ['select', 'multiselect', 'iconselect'].includes(f.fieldType)

        if (
          !isEmptyOptions &&
          f.itemType !== 'title' &&
          f.fieldType !== 'checkbox'
        ) {
          return <FormikFilterField key={f.id} field={f} />
        }
        return null
      })}
    </>
  )
}

export default FormikFilterFields
