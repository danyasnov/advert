import {Dispatch, FC, SetStateAction} from 'react'
import {isEmpty} from 'lodash'
import {CloseSquare, Filter} from 'react-iconly'
import {Field, useFormikContext} from 'formik'
import {useTranslation} from 'next-i18next'
import {observer} from 'mobx-react-lite'
import {useRouter} from 'next/router'
import {CACategoryModel} from 'front-api'
import Button from '../Buttons/Button'
import {shallowUpdateQuery} from '../../helpers'
import SelectWrapper from '../SelectWrapper'
import {FilterStyles} from '../Selects/styles'
import {SelectItem} from '../Selects/Select'
import SortSelect from '../SortSelect'
import {
  FormikChips,
  FormikFilterChips,
  FormikFilterFields,
  FormikRange,
  FormikSelect,
} from '../FormikComponents'
import {useProductsStore} from '../../providers/RootStoreProvider'
import {Values} from './FilterForm'

interface Props {
  setShowFilters: Dispatch<SetStateAction<boolean>>
  showFilters: boolean
  showReset: boolean
  getInitialValues: (reset?: boolean) => Values
  currentCategoryOption: {value: number; label: string; slug: string}
  categoriesOptions: {value: number; label: string; slug: string}[]
  currentCategory: CACategoryModel
  conditionOptions: {value: number; label: string}[]
  onChangeCategory: (opt: SelectItem & {slug: string}) => void
  onReset: () => void
}
const GeneralFilterForm: FC<Props> = observer(
  ({
    setShowFilters,
    showFilters,
    showReset,
    onReset,
    currentCategoryOption,
    categoriesOptions,
    currentCategory,
    conditionOptions,
    onChangeCategory,
  }) => {
    const {aggregatedFields} = useProductsStore()
    const {t} = useTranslation()
    const mobileStyles = {
      singleValue: 'text-body-12',
      valueContainer: 'py-[10px] h-10',
    }
    return (
      <>
        <div className='mb-4 flex space-x-6'>
          {!isEmpty(aggregatedFields) && (
            <Button
              onClick={() => {
                setShowFilters(!showFilters)
              }}
              className='text-primary-500 space-x-2'>
              <Filter size={16} filled />
              <span className='text-body-12 text-greyscale-900 hover:text-primary-500 font-medium'>
                {t(showFilters ? 'CLOSE_FILTERS' : 'SHOW_ALL_FILTERS')}
              </span>
            </Button>
          )}
          {showReset && (
            <Button onClick={onReset} className='text-primary-500 space-x-2'>
              <CloseSquare size={16} filled />
              <span className='text-body-12 text-greyscale-900 hover:text-primary-500 font-medium'>
                {t('RESET_FILTER')}
              </span>
            </Button>
          )}
        </div>
        <div className='grid grid-cols-2 s:grid-cols-4 m:grid-cols-6 gap-x-2 s:gap-x-4 gap-y-4 s:gap-y-3 mb-6'>
          <SelectWrapper
            styles={FilterStyles}
            id='SUBCATEGORY'
            filterStyle
            placeholder={t('SUBCATEGORY')}
            value={currentCategoryOption}
            options={categoriesOptions}
            onChange={onChangeCategory}
            classNameOpt={mobileStyles}
          />

          <SortSelect id='mobile-sort' filterStyle />

          {currentCategory?.extras?.allowUsed && (
            <Field
              name='condition'
              placeholder={t('PROD_CONDITION')}
              options={conditionOptions}
              component={FormikSelect}
              filterStyle
              isFilterable={false}
            />
          )}
          <Field
            name='priceRange'
            component={FormikRange}
            placeholder={t('PRICE')}
            validate={(value) => {
              const [priceMin, priceMax] = value
              let error
              if (priceMin && priceMax) {
                const parsedMin = parseFloat(priceMin)
                const parsedMax = parseFloat(priceMax)
                if (parsedMin > parsedMax) {
                  error = 'priceMin should be lesser than priceMax'
                }
              }
              return error
            }}
          />
          {!isEmpty(aggregatedFields) && showFilters && (
            <FormikFilterFields fieldsArray={aggregatedFields} />
          )}
        </div>
        <div className='flex flex-wrap mb-10 z-[1] relative'>
          <Field
            name='withPhoto'
            component={FormikChips}
            label={t('WITH_PHOTO')}
          />
          <Field
            name='onlyDiscounted'
            component={FormikChips}
            label={t('ONLY_WITH_DISCOUNT')}
          />
          {!isEmpty(aggregatedFields) && showFilters && (
            <FormikFilterChips fieldsArray={aggregatedFields} />
          )}
        </div>
      </>
    )
  },
)

export default GeneralFilterForm
