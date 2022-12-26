import {FC, useEffect, useMemo, useRef, useState} from 'react'
import {Field, Form, FormikHelpers, useFormik, FormikProvider} from 'formik'
import {useTranslation} from 'next-i18next'
import {useRouter} from 'next/router'
import {isEmpty, isEqual, omit} from 'lodash'
import {observer} from 'mobx-react-lite'
import {CloseSquare, Filter} from 'react-iconly'
import {toJS} from 'mobx'
import {
  FormikChips,
  FormikFilterChips,
  FormikFilterFields,
  FormikRange,
  FormikSelect,
} from '../FormikComponents'
import FormikAutoSave from '../FormikAutoSave'
import Select, {SelectItem} from '../Selects/Select'
import {
  useCategoriesStore,
  useProductsStore,
} from '../../providers/RootStoreProvider'
import {
  findCategoryByQuery,
  findCurrentCategoriesOptionsyByQuery,
  getUrlQueryFromFilter,
  getFormikInitialFromQuery,
  shallowUpdateQuery,
  getMappedFieldsByKey,
} from '../../helpers'
import {clearUrlFromQuery} from '../../utils'
import SortSelect from '../SortSelect'
import {FilterStyles} from '../Selects/styles'
import Button from '../Buttons/Button'
import {defaultFilter} from '../../stores/ProductsStore'

interface Values {
  condition: SelectItem
  priceRange: string[]
  withPhoto: boolean
  onlyDiscounted: boolean
  fields?: Record<string, unknown>
}

const isFilterChanged = (filter) => {
  return !isEqual(
    {...defaultFilter, ...omit(filter, ['categoryId'])},
    defaultFilter,
  )
}

const FilterForm: FC = observer(() => {
  const {t} = useTranslation()
  const router = useRouter()
  const {
    setFilter,
    resetFilter,
    fetchProducts,
    aggregatedFields,
    applyFilter,
    filter,
  } = useProductsStore()
  const [showFilters, setShowFilters] = useState(false)
  const [showReset, setShowReset] = useState(false)
  const prevCategoryQueryRef = useRef('')
  const {categoryDataFieldsById, categories} = useCategoriesStore()
  const currentCategory = findCategoryByQuery(
    router.query.categories,
    categories,
  )
  const conditionOptions = useMemo(
    () => [
      {
        value: 0,
        label: t('ALL'),
      },
      {
        value: 1,
        label: t('NEW'),
      },
      {
        value: 2,
        label: t('USED'),
      },
    ],
    [t],
  )

  useEffect(() => {
    setShowReset(isFilterChanged(filter))
  }, [filter])

  const getInitialValues = (reset?: boolean): Values => {
    // #todo it was hotfix, needs to be refactored
    const onlyDiscounted = reset
      ? false
      : router.query.onlyDiscounted === 'true'
    const priceRange = [
      '',
      // eslint-disable-next-line no-nested-ternary
      reset ? '' : router.query.priceMax === '0' ? '0' : '',
    ]
    const defaultValues = {
      condition: conditionOptions[0],
      priceRange,
      withPhoto: false,
      onlyDiscounted,
      fields: {},
    }
    if (reset || isEmpty(aggregatedFields)) return defaultValues
    const queryFilter = getFormikInitialFromQuery(
      router.query,
      aggregatedFields.reduce((acc, val) => ({...acc, [val.slug]: val}), {}),
    )

    if (queryFilter) {
      let condition = conditionOptions[0]
      // eslint-disable-next-line prefer-destructuring
      if (queryFilter.condition === '1') condition = conditionOptions[1]
      // eslint-disable-next-line prefer-destructuring
      if (queryFilter.condition === '2') condition = conditionOptions[2]
      const values: Partial<Values> = {
        ...queryFilter,
        condition,
      }

      return {...defaultValues, ...values}
    }

    return defaultValues
  }

  useEffect(() => {
    if (currentCategory) {
      setFilter({categoryId: currentCategory.id})
    }
  }, [currentCategory, setFilter])

  const [initialValues, setInitialValue] = useState<Values>(getInitialValues())

  const currentCategoriesOptions =
    findCurrentCategoriesOptionsyByQuery(router.query.categories, categories) ||
    []

  const options = currentCategoriesOptions.map((i) => ({
    value: i.id,
    label: i.name,
    slug: i.slug,
  }))
  const currentOption =
    options.find((o) => o.value === currentCategory.id) ?? null
  const formik = useFormik({
    validateOnChange: false,
    enableReinitialize: true,
    initialValues,
    onSubmit: (values: Values, {setSubmitting}: FormikHelpers<Values>) => {
      const {priceRange, withPhoto, onlyDiscounted, fields} = values
      const mappedFields = Object.fromEntries(
        Object.entries(fields)
          .map(([key, value]) => {
            const mappedCategoryFields = getMappedFieldsByKey(
              categoryDataFieldsById,
            )
            const field = mappedCategoryFields[key]
            let mappedValue
            switch (field.fieldType) {
              case 'select':
              case 'iconselect':
              case 'multiselect': {
                if (Array.isArray(value) && value.length) {
                  mappedValue = value.map((v) => v.value)
                }
                break
              }
              case 'int': {
                mappedValue = []
                if (Array.isArray(value)) {
                  if (value[0] || value[0] === 0) {
                    mappedValue[0] = parseInt(value[0], 10)
                  }
                  if (value[1] || value[1] === 0) {
                    mappedValue[1] = parseInt(value[1], 10)
                  }
                }
                break
              }
              default: {
                if (value) {
                  mappedValue = [value]
                }
              }
            }
            return [key, mappedValue]
          })
          .filter(([, value]) => !!value),
      )

      setInitialValue(values)
      let condition = ''
      if (values.condition.value === 1) condition = '1'
      if (values.condition.value === 2) condition = '2'

      const filterResult = {
        condition,
        priceMin: parseInt(priceRange[0], 10) ?? undefined,
        priceMax: parseInt(priceRange[1], 10) ?? undefined,
        withPhoto,
        onlyDiscounted,
        fields: mappedFields,
      }

      const updatedFilter = setFilter(filterResult)
      const params = new URLSearchParams(window.location.search)
      const sortBy = params.get('sortBy')
      const newParams = new URLSearchParams(
        getUrlQueryFromFilter(
          updatedFilter,
          aggregatedFields.reduce((acc, val) => ({...acc, [val.id]: val}), {}),
        ),
      )
      if (sortBy) newParams.set('sortBy', sortBy)
      shallowUpdateQuery(newParams.toString())
      fetchProducts({query: router.query}).then(() => {
        setSubmitting(false)
        applyFilter()
      })
    },
  })
  const {resetForm} = formik
  useEffect(() => {
    if (prevCategoryQueryRef.current) {
      resetForm({values: getInitialValues(true)})
      resetFilter()
    } else {
      prevCategoryQueryRef.current = JSON.stringify(router.query.categories)
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [JSON.stringify(router.query.categories)])
  return (
    <FormikProvider value={formik}>
      <Form className='w-full'>
        <div className='mb-4 flex space-x-6'>
          {!isEmpty(aggregatedFields) && (
            <Button
              onClick={() => {
                setShowFilters(!showFilters)
              }}
              className='text-primary-500 space-x-3'>
              <Filter size={24} filled />
              <span className='text-body-12 font-normal'>
                {t(showFilters ? 'CLOSE_FILTERS' : 'SHOW_ALL_FILTERS')}
              </span>
            </Button>
          )}
          {showReset && (
            <Button
              onClick={() => {
                resetForm({values: getInitialValues(true)})
                shallowUpdateQuery()
                resetFilter()
                fetchProducts({query: router.query}).then(() => applyFilter())
              }}
              className='text-primary-500 space-x-3'>
              <CloseSquare size={24} filled />
              <span className='text-body-12 font-normal'>
                {t('RESET_FILTER')}
              </span>
            </Button>
          )}
        </div>
        <div className='grid grid-cols-2 s:grid-cols-4 m:grid-cols-6 gap-x-2 s:gap-x-4 gap-y-4 s:gap-y-3 mb-6'>
          {!isEmpty(options) && (
            <Select
              styles={FilterStyles}
              id='SUBCATEGORY'
              placeholder={t('SUBCATEGORY')}
              value={currentOption}
              options={options}
              onChange={(opt: SelectItem & {slug: string}) => {
                if (opt?.value) setFilter({categoryId: opt.value as number})
                if (currentCategory.items.length) {
                  router.push(`${clearUrlFromQuery(router.asPath)}/${opt.slug}`)
                } else {
                  const pathArray = clearUrlFromQuery(router.asPath).split('/')
                  pathArray[pathArray.length - 1] = opt.slug
                  router.push(pathArray.join('/'))
                }
              }}
            />
          )}
          <SortSelect id='mobile-sort' />

          <Field
            name='condition'
            placeholder={t('PROD_CONDITION')}
            options={conditionOptions}
            component={FormikSelect}
            filterStyle
            isFilterable={false}
          />
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
        <div className='flex space-x-3 flex-wrap mb-10 z-[1] relative'>
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
        <FormikAutoSave />
      </Form>
    </FormikProvider>
  )
})

export default FilterForm
