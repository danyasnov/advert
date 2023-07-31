import {FC, useEffect} from 'react'
import {observer} from 'mobx-react-lite'
import {toJS} from 'mobx'
import {useTranslation} from 'next-i18next'
import {useRouter} from 'next/router'
import {useFormikContext} from 'formik'
import {FilterProps} from '../types'
import PopularCars from './PopularCars'
import CategoryPreview from './CategoryPreview'
import {useCategoriesStore} from '../providers/RootStoreProvider'
import LinkWrapper from './Buttons/LinkWrapper'
import {clearUrlFromQuery} from '../utils'

const TransportMain: FC<FilterProps> = observer(({conditionOptions}) => {
  const {categoriesById} = useCategoriesStore()
  const {t} = useTranslation()
  const {setFieldValue} = useFormikContext()
  const router = useRouter()
  const transportCategoriesById = categoriesById[1].items.reduce((acc, val) => {
    return {...acc, [val.id]: val}
  }, {})
  useEffect(() => {
    setTimeout(() => {
      setFieldValue('priceRange', ['1000', '100000'])
    })
  }, [])
  const previewClassname = 'flex w-full space-x-8 l:space-x-12'
  return (
    <div className='flex flex-col'>
      <div className='grid grid-rows-3 grid-flow-col gap-x-4 gap-y-2 mb-6'>
        {categoriesById[1].items.map((i) => (
          <LinkWrapper
            title={i.name}
            href={`${clearUrlFromQuery(router.asPath)}/${i.slug}`}
            className='px-4 py-2 font-medium text-body-16 hover:bg-primary-100 hover:text-primary-500 w-fit rounded-full'>
            {i.name}
          </LinkWrapper>
        ))}
      </div>
      <PopularCars conditionOptions={conditionOptions} />
      <div className='flex-col hidden s:flex space-y-12 mt-12'>
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
      <div className='mt-12 mb-6'>
        <div className='flex justify-between items-center'>
          <span className='text-h-4 font-bold text-greyscale-900'>
            {t('RECOMMENDED_FOR_YOU')}
          </span>
          <LinkWrapper
            className='text-primary-500 font-bold text-body-16'
            title={t('SEE_ALL')}
            href={`${clearUrlFromQuery(router.asPath)}/vehicles-cars`}>
            {t('SEE_ALL')}
          </LinkWrapper>
        </div>
      </div>
    </div>
  )
})
export default TransportMain
