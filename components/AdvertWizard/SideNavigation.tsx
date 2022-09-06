import {FC} from 'react'
import {useTranslation} from 'next-i18next'
import IcCheck from 'icons/material/Check.svg'
import {CAParamsModel} from 'front-api/src/index'
import {TickSquare} from 'react-iconly'

interface Props {
  validationState: Record<string, any>
  categoryName: string
  draft: CAParamsModel
}
const SideNavigation: FC<Props> = ({validationState, categoryName, draft}) => {
  const {t} = useTranslation()
  const addressDraft = draft.addressDraft || ''
  const items = [
    {
      title: t('LOCATION'),
      description: addressDraft.split(',').slice(0, 3).join(', '),
      state: 'done',
    },
    {title: t('CATEGORY'), description: categoryName, state: 'done'},
    ...validationState.map(({key, status}) => {
      return {
        title: t(key),
        state: status,
      }
    }),
  ]

  return (
    <div className='flex flex-col items-center bg-white p-6 rounded-2xl'>
      {items.map(({title, description, state}, index, arr) => (
        <div className='flex space-x-3 relative' key={title}>
          <div className='flex flex-col items-center '>
            <div
              className={`${
                state === 'done' ? 'text-primary-500' : 'text-greyscale-400'
              }`}>
              <TickSquare filled size={16} />
            </div>
            <div
              className={`rounded border-t w-0.5 border border-greyscale-200 my-1 min-h-[16px] h-full ${
                arr.length === index + 1 ? 'hidden' : ''
              }`}
            />
          </div>
          <div className='flex flex-col '>
            <span className='text-body-14 text-greyscale-900 w-40'>
              {title}
            </span>
            <span
              className={`text-body-12 text-greyscale-900 mt-2 ${
                arr.length === index + 1 ? '' : 'mb-3'
              } w-[200px]`}>
              {description}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default SideNavigation
