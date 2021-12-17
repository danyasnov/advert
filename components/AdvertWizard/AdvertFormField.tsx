import {FC} from 'react'

interface Props {
  body
  label: string
  className?: string
  labelClassName?: string
  labelDescription?: string
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
  labelDescription,
}) => {
  if (hide) return null
  return (
    <div className={`flex-col l:flex-row flex w-full ${className || ''}`}>
      <div className='flex flex-col max-w-288px min-w-288px mr-8'>
        <span
          className={`text-body-1 text-nc-title mb-4 ${labelClassName || ''}`}>
          {label}
          {isRequired && (
            <span className='text-body-1 text-nc-primary ml-1'>*</span>
          )}
        </span>
        {labelDescription && (
          <span className='hidden l:flex text-nc-primary-text bg-nc-info px-4 py-3 rounded-lg whitespace-pre-line'>
            {labelDescription}
          </span>
        )}
      </div>

      {body}
    </div>
  )
}

export default AdvertFormField
