import React, {Dispatch, FC, SetStateAction} from 'react'
import {isEmpty} from 'lodash'
import {ArrowLeft, Filter} from 'react-iconly'
import IcCaretDown from 'icons/material/CarretDown.svg'
import {Field, useFormikContext} from 'formik'
import {useTranslation} from 'next-i18next'
import {observer} from 'mobx-react-lite'
import ReactModal from 'react-modal'
import {CACategoryModel} from 'front-api'
import {useWindowSize} from 'react-use'
import IcClose from 'icons/material/Close.svg'
import {toJS} from 'mobx'
import {SelectItem} from '../Selects/Select'

import {
  FormikFilterChips,
  FormikFilterFields,
  FormikRange,
  FormikSegmented,
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
import Range from '../Range'
import useDisableBodyScroll from '../../hooks/useDisableBodyScroll'
import Button from '../Buttons/Button'
import FormikTransportFields from '../FormikComponents/FormikTransportFields'
import SelectWrapper from '../SelectWrapper'
import SortSelect from '../SortSelect'
import FormikRangeInline from '../FormikComponents/FormikRangeInline'
import PrimaryButton from '../Buttons/PrimaryButton'
import HeaderButtonColumn from './HeaderButtonColumn'
import LinkButton from '../Buttons/LinkButton'

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
const TransportFilterForm: FC<Props> = (props) => {
  return (
    <>
      <div className='hidden s:flex' key='desktop'>
        <DesktopForm {...props} />
      </div>
      <div className='flex s:hidden overflow-x-scroll -mx-4' key='mobile'>
        <MobileForm {...props} />
      </div>
    </>
  )
}

const MobileForm: FC<Props> = observer(
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
    const showCategoriesSlider = !isEmpty(currentCategory.items)

    if (showCategoriesSlider) {
      return (
        <div className='flex mb-4'>
          <CategoriesSlider
            aroundMargin
            categoriesOptions={categoriesOptions}
            onChangeCategory={onChangeCategory}
          />
        </div>
      )
    }

    return (
      <div className='flex'>
        <div className='mb-4'>
          <div className='flex'>
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
          overlayClassName='fixed inset-0 bg-shadow-overlay max-h-screen z-10 overflow-y-auto flex flex-col'>
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
      </div>
    )
  },
)

const DesktopForm: FC<Props> = observer(
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
    const {t} = useTranslation()

    const mainFields = aggregatedFields.filter((f) =>
      [1991, 17, 1992].includes(f.id),
    )
    const restFields = aggregatedFields.filter(
      (f) => ![1991, 17, 1992].includes(f.id),
    )
    const showCategoriesSlider = !isEmpty(currentCategory.items)

    if (showCategoriesSlider) {
      return (
        <div className='flex overflow-x-scroll mb-4'>
          <CategoriesSlider
            categoriesOptions={categoriesOptions}
            onChangeCategory={onChangeCategory}
          />
        </div>
      )
    }
    return (
      <div className='flex flex-col mb-4'>
        {/* {brands && ( */}
        {/*  <HeaderButtonColumn */}
        {/*    title={brands.name} */}
        {/*    items={brands.multiselects.top} */}
        {/*    onClick={} */}
        {/*  /> */}
        {/* )} */}
        <div className='grid grid-cols-3 m:grid-cols-4 gap-4 mb-4 items-center'>
          <Field
            component={FormikSegmented}
            name='condition'
            options={conditionOptions}
          />
          <SortSelect id='mobile-sort' filterStyle />
        </div>

        <div className='grid grid-cols-3 m:grid-cols-4 gap-4 mb-4'>
          {!isEmpty(mainFields) && (
            <FormikFilterFields fieldsArray={mainFields} />
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
          {!isEmpty(restFields) && showFilters && (
            <>
              <FormikFilterFields fieldsArray={restFields} />
              <div className='flex col-span-3 m:col-span-4'>
                <FormikFilterChips fieldsArray={aggregatedFields} />
              </div>
            </>
          )}
        </div>
        <div className='flex space-x-5'>
          <LinkButton
            className='self-start font-normal whitespace-nowrap'
            onClick={() => {
              setShowFilters(!showFilters)
            }}>
            <div className='flex items-center space-x-2'>
              <span>
                {t(showFilters ? 'CLOSE_ALL_PARAMETERS' : 'ALL_PARAMETERS')}
              </span>
              <div className={`w-4 h-4 ${showFilters ? 'rotate-180' : ''}`}>
                <IcCaretDown />
              </div>
            </div>
          </LinkButton>
          {showReset && (
            <Button
              onClick={onReset}
              className='text-greyscale-500 space-x-2 flex items-center'>
              <span className='text-body-14'>{t('RESET')}</span>
              <IcClose className='w-2.5 h-2.5 fill-current' />
            </Button>
          )}
        </div>
      </div>
    )
  },
)

const CategoriesSlider: FC<{
  categoriesOptions: {value: number; label: string; slug: string}[]
  onChangeCategory: (opt: SelectItem & {slug: string}) => void
  aroundMargin?: boolean
}> = ({categoriesOptions, onChangeCategory, aroundMargin}) => {
  return (
    <>
      {categoriesOptions.map((c) => (
        <div className={`mr-2 ${aroundMargin ? 'first:ml-4 last:mr-4' : ''}`}>
          <ChipButton onClick={() => onChangeCategory(c)}>{c.label}</ChipButton>
        </div>
      ))}
    </>
  )
}

export default TransportFilterForm
