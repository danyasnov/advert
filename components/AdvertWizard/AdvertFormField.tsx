import {FC} from 'react'

interface Props {
  body
  label: string
  className?: string
  labelClassName?: string
  isRequired?: boolean
  hide?: boolean
}
const AdvertFormField: FC<Props> = ({
  body,
  label,
  isRequired,
  className,
  labelClassName,
  hide,
}) => {
  if (hide) return null
  return (
    <div className={`flex w-full ${className}`}>
      <span className={`w-4/12 text-body-1 text-nc-title ${labelClassName}`}>
        {label}
        {isRequired && (
          <span className='text-body-1 text-nc-primary ml-1'>*</span>
        )}
      </span>
      {body}
    </div>
  )
}

export default AdvertFormField
