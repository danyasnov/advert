import {FC} from 'react'

interface Props {
  body
  label: string
  isRequired: boolean
}
const AdvertFormField: FC<Props> = ({body, label, isRequired}) => {
  return (
    <div className='flex items-center'>
      <span className='w-4/12 text-body-1 text-nc-title'>
        {label}
        {isRequired && (
          <span className='text-body-1 text-nc-primary ml-1'>*</span>
        )}
      </span>
      <div className='w-5/12'>{body}</div>
    </div>
  )
}

export default AdvertFormField
