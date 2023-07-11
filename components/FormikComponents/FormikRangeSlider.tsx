import React, {FC} from 'react'
import {FieldProps} from 'formik'
import Slider from 'rc-slider'
import {toNumber, toString} from 'lodash'
import {useTranslation} from 'next-i18next'
import {IFormikRange} from '../../types'

const FormikRangeSlider: FC<FieldProps & Partial<IFormikRange>> = ({
  field,
  form,
  minValue,
  maxValue,
}) => {
  const {name, value} = field
  const {setFieldValue} = form
  // const formattedValue = [
  //   value[0] === '' ? 1000 : 0,
  //   value[1] === '' ? 100000 : 0,
  // ]
  const {t} = useTranslation()
  return (
    <Slider
      trackStyle={{backgroundColor: '#7210FF', height: 2}}
      railStyle={{
        backgroundColor: 'rgba(12, 13, 13, 0.1)',
        height: 2,
      }}
      range
      step={1000}
      value={value}
      onChange={(newPrice) => {
        setFieldValue(name, newPrice)
      }}
      handleStyle={{
        height: 24,
        width: 24,
        marginTop: -10,
        backgroundColor: '#7210FF',
        border: '1px solid #7210FF',
        boxShadow: 'none',
        opacity: 1,
      }}
      handleRender={(el, renderProps) => {
        return (
          <div className='relative'>
            {el}
            <div
              className='absolute top-5 font-medium text-body-16 whitespace-nowrap'
              style={{
                left: `${parseInt(el.props.style.left as string, 10) - 2}%`,
              }}>
              {t('FROM')} {renderProps.value}
            </div>
          </div>
        )
      }}
      min={minValue}
      max={maxValue}
    />
  )
}

export default FormikRangeSlider
