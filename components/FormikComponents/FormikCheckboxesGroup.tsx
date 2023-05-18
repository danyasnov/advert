import React, {FC} from 'react'
import {useFormikContext} from 'formik'
import {useTranslation} from 'next-i18next'
import {get} from 'lodash'
import Button from '../Buttons/Button'
import {CACategoryDataFieldModel} from '../../../front-api'

const FormikCheckboxesGroup: FC<{
  fields: CACategoryDataFieldModel[]
  description?: string
}> = ({fields, description}) => {
  const formik = useFormikContext()
  const {t} = useTranslation()
  const {values, setFieldValue} = formik
  return (
    <div>
      {!!description && (
        <div className='bg-greyscale-50 rounded-lg py-3 px-4 mb-4'>
          <span className='text-body-14'>{t(description)}</span>
        </div>
      )}
      <div className='flex flex-wrap'>
        {fields.map((f) => {
          const name = `fields.${f.id}`
          const value = get(values, name)
          return (
            <Button
              onClick={() => setFieldValue(name, !value)}
              key={f.id}
              className={`text-body-16 text-greyscale-900 p-4 rounded-lg mr-3 mb-3 ${
                value ? 'bg-nc-accent' : 'bg-nc-back'
              }`}>
              {f.name}
            </Button>
          )
        })}
      </div>
    </div>
  )
}

export default FormikCheckboxesGroup
