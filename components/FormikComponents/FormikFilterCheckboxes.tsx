import React, {FC} from 'react'
import {CACategoryDataFieldModel} from 'front-api'
import {FormikFilterField} from './index'
import FormikFilterFieldsAuto from './FormikFilterFieldsAuto'

const FormikFilterCheckboxes: FC<{
  fieldsArray: CACategoryDataFieldModel[]
}> = ({fieldsArray}) => {
  return (
    <>
      {fieldsArray.map((f) => {
        // @ts-ignore
        if (f.fieldType === 'array') {
          return <FormikFilterCheckboxes fieldsArray={f.arrayTypeFields} />
        }

        if (f.fieldType === 'checkbox') {
          return <FormikFilterFieldsAuto field={f} />
        }

        return null
      })}
    </>
  )
}
export default FormikFilterCheckboxes
