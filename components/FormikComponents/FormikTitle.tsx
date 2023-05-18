import React, {FC} from 'react'

const FormikTitle: FC<{label: string}> = ({label}) => {
  return (
    <div className='text-greyscale-900 text-body-18 font-semibold pb-4'>
      {label}
    </div>
  )
}

export default FormikTitle
