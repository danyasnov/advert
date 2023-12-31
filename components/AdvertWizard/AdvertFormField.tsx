import {FC} from 'react'
import {InfoSquare} from 'react-iconly'
import Tip from './Tip'

interface Props {
  body
  label?: string
  orientation?: 'vertical' | 'horizontal'
  labelTip?: string
  className?: string
  labelClassName?: string
  labelDescription?: string
  isRequired?: boolean
  hide?: boolean
  id?: string
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
  id,
}) => {
  if (hide) return null
  return (
    <div
      data-test-id={id}
      className={`flex w-full ${
        orientation === 'vertical' ? 'flex-col' : 'flex-row items-center'
      }  ${className || ''}`}>
      <div
        className={`flex flex-col ${
          orientation === 'vertical' ? '' : 'w-288px shrink-0 mr-4'
        }`}>
        <div
          className={`flex items-center mb-2 s:mb-4 m:mb-2 space-x-2 text-body-16 ${
            labelClassName || ''
          }`}>
          {!!label && (
            <span className='text-greyscale-900'>
              {label}
              {isRequired && <span className='ml-1 text-error'>*</span>}
            </span>
          )}
          {!!labelTip && <Tip message={labelTip} placement='right' />}
        </div>
        {labelDescription && (
          <div className='flex items-center rounded-lg bg-yellow px-4 py-3 mb-6 space-x-4'>
            <div className='text-secondary-500'>
              <InfoSquare size={32} filled />
            </div>
            <span className='text-greyscale-900 whitespace-pre-wrap '>
              {labelDescription}
            </span>
          </div>
        )}
      </div>

      {body}
    </div>
  )
}

export default AdvertFormField
