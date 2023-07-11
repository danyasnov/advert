import {FC} from 'react'
import {observer} from 'mobx-react-lite'
import {toJS} from 'mobx'
import {useTranslation} from 'next-i18next'
import {useRouter} from 'next/router'
import {FilterProps} from '../types'
import PopularCars from './PopularCars'
import CategoryPreview from './CategoryPreview'
import {
  useCategoriesStore,
  useGeneralStore,
} from '../providers/RootStoreProvider'
import LinkWrapper from './Buttons/LinkWrapper'
import TitleWithSeparator from './TitleWithSeparator'
import {clearUrlFromQuery} from '../utils'

const TransportMain: FC<FilterProps> = observer(({conditionOptions}) => {
  const {categoriesById} = useCategoriesStore()
  const {t} = useTranslation()
  const router = useRouter()
  const transportCategoriesById = categoriesById[1].items.reduce((acc, val) => {
    return {...acc, [val.id]: val}
  }, {})
  const previewClassname = 'flex w-full space-x-8 l:space-x-12'
  return (
    <div className='flex flex-col'>
      <div className='grid grid-rows-3 grid-flow-col gap-x-4 gap-y-2 mb-6'>
        {categoriesById[1].items.map((i) => (
          <LinkWrapper
            title={i.name}
            href={`${clearUrlFromQuery(router.asPath)}/${i.slug}`}
            className='px-4 py-2 font-medium text-body-16'>
            {i.name}
          </LinkWrapper>
        ))}
      </div>
      <PopularCars conditionOptions={conditionOptions} />
      <div className='flex-col hidden m:flex space-y-12 mt-12'>
        <div className={previewClassname}>
          <CategoryPreview category={transportCategoriesById[27]} />
          <CategoryPreview category={transportCategoriesById[10077]} />
        </div>
        <div className={previewClassname}>
          <CategoryPreview category={transportCategoriesById[10071]} />
          <CategoryPreview category={transportCategoriesById[12271]} />
        </div>
        <div className={previewClassname}>
          <CategoryPreview category={transportCategoriesById[25]} />
        </div>
      </div>
      <div className='mt-12'>
        <TitleWithSeparator title={t('RECOMMENDATIONS_FOR_YOU')} />
      </div>
    </div>
  )
})

export default TransportMain
