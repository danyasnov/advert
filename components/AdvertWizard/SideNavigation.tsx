import {FC} from 'react'
import {useTranslation} from 'next-i18next'
import IcCheck from 'icons/material/Check.svg'
import {CAParamsModel} from 'front-api/src/index'

interface Props {
  validationState: Record<string, any>
  categoryName: string
  draft: CAParamsModel
}
const SideNavigation: FC<Props> = ({validationState, categoryName, draft}) => {
  const {t} = useTranslation()
  const addressDraft = draft.addressDraft || ''
  // console.log(validationState)
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

  const nextItem = items.find((i) => i.state !== 'done') || null

  return (
    <div className='flex flex-col items-center'>
      {items.map(({title, description, state}, index, arr) => (
        <div className='flex space-x-3 relative' key={title}>
          <div className='flex flex-col items-center '>
            {title === nextItem?.title ? (
              <div className='w-4 h-4 rounded-full bg-[#3EA5FF] flex justify-center items-center shrink-0'>
                <div className='w-3 h-3 bg-[#3EA5FF] border border-white rounded-full' />
              </div>
            ) : (
              <div
                className={`w-4 h-4 rounded-full ${
                  state === 'done' ? 'bg-nc-success' : 'bg-nc-additional'
                } flex justify-center items-center shrink-0`}>
                <IcCheck className='fill-current text-white h-2 w-2' />
              </div>
            )}
            <div
              className={`rounded border-t w-0.5 border border-nc-border my-1 min-h-[16px] h-full ${
                arr.length === index + 1 ? 'hidden' : ''
              }`}
            />
          </div>
          <div className='flex flex-col '>
            <span className='text-body-14 text-primary-500-text w-40'>
              {title}
            </span>
            <span className='text-body-12 text-nc-secondary-text mt-1 mb-2 w-[200px]'>
              {description}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default SideNavigation
