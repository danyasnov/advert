import {FC} from 'react'
import {useTranslation} from 'next-i18next'
import IcCheck from 'icons/material/Check.svg'
import {CAParamsModel} from 'front-api/src/index'
import {hasErrors} from './utils'

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
    ...validationState.map(({key, state}) => {
      return {
        title: t(key),
        state: !hasErrors(state) ? 'done' : 'pending',
      }
    }),
  ]

  const nextItem = items.find((i) => i.state !== 'done') || null

  return (
    <div className='flex flex-col items-center fixed mt-12 '>
      {items
        .map(({title, description, state}) => (
          <div className='flex space-x-3 relative' key={title}>
            <div className='flex'>
              {title === nextItem?.title ? (
                <div className='w-4 h-4 rounded-full bg-[#3EA5FF] flex justify-center items-center'>
                  <div className='w-3 h-3 bg-[#3EA5FF] border border-white rounded-full' />
                </div>
              ) : (
                <div
                  className={`w-4 h-4 rounded-full ${
                    state === 'done' ? 'bg-nc-success' : 'bg-nc-additional'
                  } flex justify-center items-center`}>
                  <IcCheck className='fill-current text-white h-2 w-2' />
                </div>
              )}
            </div>
            <div className='flex flex-col absolute left-5'>
              <span className='text-body-2 text-nc-primary-text w-40'>
                {title}
              </span>
              <span className='text-body-3 text-nc-secondary-text mt-1'>
                {description}
              </span>
            </div>
          </div>
        ))
        .reduce(
          (acc, val, index, arr) =>
            arr.length === index + 1
              ? [...acc, val]
              : [
                  ...acc,
                  val,
                  <div
                    className={`rounded border-t w-0.5 border border-nc-border my-1 ${
                      index === 0 || index === 1 ? 'h-10' : 'h-5'
                    }`}
                  />,
                ],
          [],
        )}
    </div>
  )
}

export default SideNavigation
