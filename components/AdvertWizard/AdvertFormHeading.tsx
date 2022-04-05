import {FC, forwardRef} from 'react'
import Tip from './Tip'

interface Props {
  title: string
  label: string
  labelClassName?: string
  labelDescription?: string
  labelTip?: string
  isRequired?: boolean
}
const AdvertFormHeading: FC<Props> = ({
  title,
  label,
  labelClassName,
  labelDescription,
  isRequired,
  labelTip,
}) => {
  return (
    <div className='flex flex-col'>
      {/* @ts-ignore */}
      {!!title && <p className='text-nc-title text-h-2 font-medium'>{title}</p>}
      {!!label && (
        <div
          className={`flex items-center mb-2 s:mb-4 space-x-2 ${
            labelClassName || ''
          }`}>
          <span className='text-body-1 text-nc-title'>
            {label}
            {isRequired && (
              <span className='text-body-1 text-nc-primary ml-1'>*</span>
            )}
          </span>
          {!!labelTip && <Tip message={labelTip} placement='right' />}
        </div>
      )}

      {!!labelDescription && (
        <span className='flex text-nc-primary-text bg-nc-info px-4 py-3 rounded-lg whitespace-pre-line mb-6'>
          {labelDescription}
        </span>
      )}
    </div>
  )
}

export default AdvertFormHeading
