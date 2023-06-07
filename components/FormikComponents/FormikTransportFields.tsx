import React, {FC} from 'react'
import {isEmpty} from 'lodash'
import {CACategoryDataFieldModel} from 'front-api'
import {getSelectOptions} from './utils'
import FormikTransportField from './FormikTransportField'

const FormikTransportFields: FC<{
  fieldsArray: CACategoryDataFieldModel[]
}> = ({fieldsArray}) => {
  return (
    <>
      {fieldsArray.map((f) => {
        // @ts-ignore
        if (f.fieldType === 'array') {
          return (
            <FormikTransportFields key={f.id} fieldsArray={f.arrayTypeFields} />
          )
        }
        const isEmptyOptions =
          isEmpty(getSelectOptions(f.multiselects)) &&
          ['select', 'multiselect', 'iconselect'].includes(f.fieldType)

        if (!isEmptyOptions && f.itemType !== 'title') {
          return <FormikTransportField key={f.id} field={f} />
        }
        return null
      })}
    </>
  )
}

export default FormikTransportFields
