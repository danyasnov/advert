import React, {Dispatch, FC, SetStateAction} from 'react'
import {isEmpty} from 'lodash'
import {ArrowLeft, Filter} from 'react-iconly'
import {Field, useFormikContext} from 'formik'
import {useTranslation} from 'next-i18next'
import {observer} from 'mobx-react-lite'
import ReactModal from 'react-modal'
import {CACategoryModel} from 'front-api'
import {SelectItem} from '../Selects/Select'
import {
  FormikChips,
  FormikFilterFields,
  FormikSelect,
  FormikSwitch,
  getSelectOptions,
} from '../FormikComponents'
import {useProductsStore} from '../../providers/RootStoreProvider'
import {Values} from './FilterForm'
import ListWithFilter from '../Selects/ListWithFilter'
import ChipButton from '../Buttons/ChipButton'
import {getChipTitle, getPriceChipTitle} from './utils'
import Chip from './Chip'
import Range from './Range'
import useDisableBodyScroll from '../../hooks/useDisableBodyScroll'
import Button from '../Buttons/Button'
import FormikTransportFields from '../FormikComponents/FormikTransportFields'
import SelectWrapper from '../SelectWrapper'
import {FilterStyles} from '../Selects/styles'
import SortSelect from '../SortSelect'
import FormikRangeInline from '../FormikComponents/FormikRangeInline'
import PrimaryButton from '../Buttons/PrimaryButton'

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
const TransportFilterForm: FC<Props> = observer(
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
    const {aggregatedFields, count} = useProductsStore()
    const {values, setFieldValue} = useFormikContext<Values>()
    const hasPrice = !!(values.priceRange[0] || values.priceRange[1])
    const {t} = useTranslation()
    useDisableBodyScroll(showFilters)
    const mobileStyles = {}
    return (
      <>
        <div className='mb-4'>
          <div className='flex overflow-y-scroll -mx-4'>
            <div className='mr-2 ml-4'>
              <Chip
                hasValue
                name={t('SUBCATEGORY')}
                chipTitle={currentCategory.name}
                value={currentCategoryOption}
                fixHeight
                onChange={onChangeCategory}>
                {(props) => (
                  <ListWithFilter
                    value={props.value}
                    onChange={props.onChange}
                    items={categoriesOptions}
                  />
                )}
              </Chip>
            </div>
            {aggregatedFields.map((f) => {
              const {name, multiselects, isFilterable, fieldType, id} = f
              const isEmptyOptions =
                isEmpty(getSelectOptions(multiselects)) &&
                ['select', 'multiselect', 'iconselect'].includes(fieldType)
              const value = values.fields[id] || []
              const items = getSelectOptions(multiselects)
              const onChange = (v) => setFieldValue(`fields.${id}`, v || [])

              if (!isEmptyOptions && [1991, 1992, 17].includes(id)) {
                return (
                  <div className='mr-2' key={id}>
                    <Chip
                      // @ts-ignore
                      hasValue={!!value.length}
                      name={name}
                      chipTitle={getChipTitle(value, name)}
                      value={value}
                      fixHeight
                      onChange={onChange}>
                      {(props) => (
                        <ListWithFilter
                          value={props.value}
                          onChange={props.onChange}
                          items={items}
                          isMulti
                          isSearchable={isFilterable}
                        />
                      )}
                    </Chip>
                  </div>
                )
              }
              return null
            })}
            <div className='mr-2'>
              <Chip
                onChange={(v) => {
                  setFieldValue('priceRange', v)
                }}
                value={values.priceRange}
                name={t('PRICE')}
                chipTitle={getPriceChipTitle(values.priceRange, t)}
                validate={(value) => {
                  const [priceMin, priceMax] = value
                  let error
                  if (priceMin && priceMax) {
                    const parsedMin = parseFloat(priceMin)
                    const parsedMax = parseFloat(priceMax)
                    if (parsedMin > parsedMax) {
                      error = t('FILTER_PRICE_ERROR')
                    }
                  }
                  return error
                }}
                hasValue={hasPrice}>
                {(props) => (
                  <div className='mx-4 mb-4'>
                    <Range value={props.value} onChange={props.onChange} />
                  </div>
                )}
              </Chip>
            </div>
            {currentCategory?.extras?.allowUsed && (
              <div className='mr-2'>
                <Chip
                  onChange={(v) => {
                    setFieldValue('condition', v)
                  }}
                  value={values.condition}
                  name={t('PROD_CONDITION')}
                  chipTitle={
                    values.condition.value !== 0
                      ? values.condition.label
                      : t('PROD_CONDITION')
                  }
                  hasValue={values.condition.value !== 0}>
                  {(props) => (
                    <ListWithFilter
                      value={props.value}
                      onChange={props.onChange}
                      items={conditionOptions}
                    />
                  )}
                </Chip>
              </div>
            )}
            {!isEmpty(aggregatedFields) && (
              <div className='mr-4'>
                <ChipButton onClick={() => setShowFilters(!showFilters)}>
                  <Filter size={12} filled />
                  <span className='ml-1'>{t('MORE_FILTERS')}</span>
                </ChipButton>
              </div>
            )}
          </div>
        </div>
        <ReactModal
          isOpen={showFilters}
          onRequestClose={() => setShowFilters(false)}
          shouldCloseOnOverlayClick={false}
          ariaHideApp={false}
          contentLabel='Filters'
          className='absolute w-full bg-white-a inset-x-0 mx-auto flex outline-none'
          overlayClassName='fixed inset-0 bg-shadow-overlay max-h-screen z-20 overflow-y-auto flex flex-col'>
          <div className='space-y-6 mx-4 w-full py-8'>
            <div className='flex'>
              <Button onClick={() => setShowFilters(false)}>
                <ArrowLeft size={28} />
              </Button>
              <p className='text-h-4 font-bold text-greyscale-900 w-full ml-4'>
                {t('REFINE_SEARCH')}
              </p>
              {showReset && (
                <Button
                  className='text-primary-500 text-body-12'
                  onClick={onReset}>
                  {t('RESET')}
                </Button>
              )}
            </div>
            <SortSelect id='mobile-sort' />

            <SelectWrapper
              filterStyle
              id='SUBCATEGORY'
              placeholder={t('SUBCATEGORY')}
              value={currentCategoryOption}
              options={categoriesOptions}
              onChange={onChangeCategory}
            />
            {currentCategory?.extras?.allowUsed && (
              <Field
                name='condition'
                placeholder={t('PROD_CONDITION')}
                options={conditionOptions}
                component={FormikSelect}
                isFilterable={false}
              />
            )}
            <Field
              component={FormikRangeInline}
              name='priceRange'
              placeholder={t('PRICE')}
            />
            <Field
              name='withPhoto'
              component={FormikSwitch}
              label={t('WITH_PHOTO')}
            />
            <Field
              name='onlyDiscounted'
              component={FormikSwitch}
              label={t('ONLY_WITH_DISCOUNT')}
            />
            <FormikTransportFields fieldsArray={aggregatedFields} />
            <PrimaryButton
              onClick={() => setShowFilters(false)}
              className='w-full mt-5'>
              {t('SHOW_ADVERTS', {count})}
            </PrimaryButton>
          </div>
        </ReactModal>
      </>
    )
  },
)

export default TransportFilterForm
