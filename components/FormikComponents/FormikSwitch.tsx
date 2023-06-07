import React, {FC} from 'react'
import {FieldProps} from 'formik'
import Switch from 'react-switch'
import {IFormikCheckbox} from '../../types'

const FormikSwitch: FC<IFormikCheckbox & FieldProps> = ({
  field,
  form,
  label,
  hideLabel,
  labelPosition = 'left',
}) => {
  const {name, value} = field
  const {setFieldValue} = form
  const input = (
    <Switch
      offColor='#E0E0E0'
      onColor='#7210FF'
      uncheckedIcon={false}
      checkedIcon={false}
      height={16}
      width={28}
      handleDiameter={14}
      onChange={(checked) => setFieldValue(name, checked)}
      checked={!!value}
    />
  )
  return (
    <div>
      {hideLabel ? (
        input
      ) : (
        // eslint-disable-next-line jsx-a11y/label-has-associated-control
        <label className='flex items-center justify-between'>
          {label && (
            <span
              className={`text-greyscale-900 text-body-16 font-bold whitespace-nowrap ${
                labelPosition === 'left' ? 'mr-3' : 'order-last ml-3'
              }`}>
              {label}
            </span>
          )}
          {input}
        </label>
      )}
    </div>
  )
}
export default FormikSwitch
