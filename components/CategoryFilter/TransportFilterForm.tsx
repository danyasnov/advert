import React, {Dispatch, FC, SetStateAction} from 'react'
import {isEmpty} from 'lodash'
import {ArrowLeft, Filter} from 'react-iconly'
import IcCaretDown from 'icons/material/CarretDown.svg'
import {Field, useFormikContext} from 'formik'
import {useTranslation} from 'next-i18next'
import {observer} from 'mobx-react-lite'
import ReactModal from 'react-modal'
import {CACategoryDataFieldModel, CACategoryModel} from 'front-api'
import {useWindowSize} from 'react-use'
import IcClose from 'icons/material/Close.svg'
import {toJS} from 'mobx'
import {useRouter} from 'next/router'
import {SelectItem} from '../Selects/Select'

import {
  FormikCheckbox,
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
import SortSelect from '../Selects/SortSelect'
import FormikRangeInline from '../FormikComponents/FormikRangeInline'
import PrimaryButton from '../Buttons/PrimaryButton'
import LinkButton from '../Buttons/LinkButton'
import {FilterProps} from '../../types'
import FormikFilterCheckboxes from '../FormikComponents/FormikFilterCheckboxes'
import AutoSortSelect from '../Selects/AutoSortSelect'
import GeneralFilterForm from './GeneralFilterForm'

const TransportFilterForm: FC<FilterProps> = (props) => {
  const {currentCategory, categoriesOptions, onChangeCategory} = props
  const {width} = useWindowSize()
  if (typeof window === 'undefined') return null
  return (
    <div className='flex flex-col'>
      {width >= 768 ? (
        <DesktopForm {...props} key='desktop' />
      ) : (
        <MobileForm {...props} key='mobile' />
      )}
    </div>
  )
}

const MobileForm: FC<FilterProps> = observer(
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

    return (
      <div className='flex'>
        <div className='flex overflow-x-auto mb-4 -mx-4'>
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

const DesktopForm: FC<FilterProps> = observer(
  ({
    setShowFilters,
    showFilters,
    showReset,
    onReset,
    conditionOptions,
    currentCategory,
  }) => {
    const {aggregatedFields, newCount, applyFilter, isFilterApplied} =
      useProductsStore()
    const {t} = useTranslation()
    const mainIds = [1991, 1992, 5, 6, 'price', 12, 17, 7, 2071, 10]
    const {setFieldValue} = useFormikContext()
    const mainFields = mainIds.map((id) => {
      if (id === 'price') {
        return {
          fieldType: 'price',
          multiselects: {top: [], other: []},
        }
      }
      return aggregatedFields.find((f) => {
        return f.id === id
      })
    })
    const restFields = aggregatedFields.filter((f) => !mainIds.includes(f.id))
    const urlParams = new URLSearchParams(window.location.search)
    const probeg = urlParams.get('probeg-km0')

    return (
      <div className='w-full rounded-3xl  flex flex-col py-8 px-6 bg-white mb-6 shadow-[0_45px_80px_rgba(4,6,15,0.08)]'>
        <span className='text-h-4 font-bold mb-6'>{currentCategory.name}</span>
        <div className='grid grid-cols-3 m:grid-cols-4 gap-4 mb-4 items-center'>
          <Field
            component={FormikSegmented}
            name='condition'
            options={conditionOptions}
          />
          <AutoSortSelect />
          <div className='col-span-4 l:col-span-1 flex space-x-4'>
            <Field
              name='withoutRun'
              component={FormikCheckbox}
              label={t('WITHOUT_RUN')}
              customValue={probeg === '0-0'}
              onChange={(value) => {
                const result = value ? ['0', '0'] : undefined
                setFieldValue('fields.12', result)
              }}
              labelClassname='text-body-12 whitespace-nowrap'
            />
            <Field
              name='onlyDiscounted'
              component={FormikCheckbox}
              label={t('WITH_DISCOUNT')}
              labelClassname='text-body-12 whitespace-nowrap'
            />
            <FormikFilterCheckboxes fieldsArray={restFields} />
          </div>
        </div>

        <div className='grid grid-cols-3 m:grid-cols-4 gap-4 mb-4'>
          {!isEmpty(mainFields) && (
            <FormikFilterFields
              fieldsArray={mainFields as CACategoryDataFieldModel[]}
            />
          )}
          {!isEmpty(restFields) && showFilters && (
            <FormikFilterFields fieldsArray={restFields} />
          )}
        </div>
        <div className='flex space-x-5 items-center justify-between'>
          <div className='flex items-center space-x-6'>
            <LinkButton
              className='self-start font-normal whitespace-nowrap'
              onClick={() => {
                setShowFilters(!showFilters)
              }}>
              <div className='flex items-center space-x-2'>
                <span className='text-body-16 font-medium'>
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
                <span className='text-body-16 font-medium'>{t('CLEAR')}</span>
                <IcClose className='w-2.5 h-2.5 fill-current' />
              </Button>
            )}
          </div>
          {!isFilterApplied && (
            <PrimaryButton
              className='s:w-[272px] m:w-[240px] h-10'
              onClick={() => {
                applyFilter()
              }}>
              {t('SHOW_CARS_COUNT', {count: newCount})}
            </PrimaryButton>
          )}
        </div>
      </div>
    )
  },
)

export default TransportFilterForm
