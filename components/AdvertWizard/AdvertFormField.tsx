import {FC} from 'react'
import Tip from './Tip'

interface Props {
  body
  label: string
  orientation?: 'vertical' | 'horizontal'
  labelTip?: string
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
  labelTip,
  orientation = 'vertical',
}) => {
  if (hide) return null
  return (
    <div
      className={`flex w-full ${
        orientation === 'vertical' ? 'flex-col' : 'flex-row'
      }  ${className || ''}`}>
      <div
        className={`flex flex-col ${
          orientation === 'vertical' ? '' : 'w-288px shrink-0 mr-4'
        }`}>
        <div
          className={`flex items-center mb-2 s:mb-4 space-x-2 ${
            labelClassName || ''
          }`}>
          {!!label && (
            <span className='text-body-1 text-nc-title'>
              {label}
              {isRequired && (
                <span className='text-body-1 text-nc-primary ml-1'>*</span>
              )}
            </span>
          )}
          {!!labelTip && <Tip message={labelTip} placement='right' />}
        </div>
        {labelDescription && (
          <span className='flex text-nc-primary-text bg-nc-info px-4 py-3 rounded-lg whitespace-pre-line mb-6'>
            {labelDescription}
          </span>
        )}
      </div>

      {body}
    </div>
  )
}

export default AdvertFormField
