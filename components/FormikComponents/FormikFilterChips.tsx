import React, {FC} from 'react'
import {CACategoryDataFieldModel} from 'front-api'
import {FormikFilterField} from './index'

const FormikFilterChips: FC<{
  fieldsArray: CACategoryDataFieldModel[]
}> = ({fieldsArray}) => {
  return (
    <>
      {fieldsArray.map((f) => {
        // @ts-ignore
        if (f.fieldType === 'array') {
          return <FormikFilterChips fieldsArray={f.arrayTypeFields} />
        }

        if (f.fieldType === 'checkbox') {
          return <FormikFilterField field={f} />
        }

        return null
      })}
    </>
  )
}
export default FormikFilterChips
