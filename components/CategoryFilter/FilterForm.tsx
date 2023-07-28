import React, {FC, useEffect, useMemo, useRef, useState} from 'react'
import {Form, FormikHelpers, useFormik, FormikProvider} from 'formik'
import {useTranslation} from 'next-i18next'
import {useRouter} from 'next/router'
import {isEmpty, isEqual, omit} from 'lodash'
import {observer} from 'mobx-react-lite'
import {toJS} from 'mobx'
import FormikAutoSave from '../FormikAutoSave'
import {SelectItem} from '../Selects/Select'
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
import {defaultFilter} from '../../stores/ProductsStore'
import GeneralFilterForm from './GeneralFilterForm'
import TransportFilterForm from './TransportFilterForm'
import {clearUrlFromQuery} from '../../utils'
import TransportMain from '../TransportMain'

export interface Values {
  condition: SelectItem
  priceRange: string[]
  withPhoto: boolean
  onlyDiscounted: boolean
  fields?: Record<string, unknown>
}

const isFilterChanged = (filter) => {
  return !isEqual(
    JSON.parse(
      JSON.stringify({...defaultFilter, ...omit(filter, ['categoryId'])}),
    ),
    defaultFilter,
  )
}
const findRootCategory = (items, id) => {
  if (!items) {
    return
  }

  for (const item of items) {
    if (item.id === id) {
      return item
    }

    const child = findRootCategory(item.items, id)
    if (child) {
      return item
    }
  }
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
  const {categoryDataFieldsById, categories, categoryData} =
    useCategoriesStore()
  const currentCategory = findCategoryByQuery(
    router.query.categories,
    categories,
  )
  const conditionOptions = useMemo(
    () => [
      {
        value: 0,
        label: t('OTHER_FILTERS'),
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
    const show = isFilterChanged(filter)
    setShowReset(show)
  }, [filter])

  const getInitialValues = ({
    reset,
    forceQuery,
  }: Partial<{
    reset: boolean
    forceQuery: boolean
  }>): Values => {
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

    if ((reset || isEmpty(aggregatedFields)) && !forceQuery) {
      return defaultValues
    }
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

  const isTransport = categoryData?.id === 1
  const isTransportChild = categoryData?.id === 23
  const [initialValues, setInitialValue] = useState<Values>(
    getInitialValues({
      forceQuery: isTransport,
    }),
  )

  const currentCategoriesOptions =
    findCurrentCategoriesOptionsyByQuery(router.query.categories, categories) ||
    []

  const categoriesOptions = currentCategoriesOptions.map((i) => ({
    value: i.id,
    label: i.name,
    slug: i.slug,
  }))
  const currentCategoryOption =
    categoriesOptions.find((o) => o.value === currentCategory.id) ?? null
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
                    mappedValue[0] = value[0] === 0 ? '0' : value[0]
                  }
                  if (value[1] || value[1] === 0) {
                    mappedValue[1] = value[1]
                  }
                  if (!mappedValue[1]) mappedValue[1] = '1000000000'
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
      const getPrice = (value) => {
        const result = parseInt(value, 10)
        if (result === undefined || result === null || Number.isNaN(result)) {
          return undefined
        }
        return result
      }

      const priceMin = getPrice(priceRange[0])
      const priceMax = getPrice(priceRange[1])

      const filterResult = {
        condition,
        withPhoto,
        onlyDiscounted,
        fields: mappedFields,
        ...(priceMin !== undefined ? {priceMin} : {}),
        ...(priceMax !== undefined ? {priceMax} : {}),
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
        if (!isTransportChild) {
          applyFilter()
        }
      })
    },
  })
  const {resetForm, values} = formik
  const onReset = () => {
    resetForm({values: getInitialValues({reset: true})})
    shallowUpdateQuery()
    resetFilter()
    fetchProducts({query: router.query}).then(() => applyFilter())
  }

  const onChangeCategory = (opt: SelectItem & {slug: string}) => {
    if (opt?.value) setFilter({categoryId: opt.value as number})
    if (currentCategory.items.length) {
      router.push(`${clearUrlFromQuery(router.asPath)}/${opt.slug}`)
    } else {
      const pathArray = clearUrlFromQuery(router.asPath).split('/')
      pathArray[pathArray.length - 1] = opt.slug
      router.push(pathArray.join('/'))
    }
  }
  useEffect(() => {
    if (prevCategoryQueryRef.current) {
      resetForm({values: getInitialValues({reset: true})})
      resetFilter()
    } else {
      prevCategoryQueryRef.current = JSON.stringify(router.query.categories)
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [JSON.stringify(router.query.categories)])
  const filterProps = {
    categoriesOptions,
    conditionOptions,
    currentCategoryOption,
    currentCategory,
    setShowFilters,
    showFilters,
    getInitialValues,
    showReset,
    onChangeCategory,
    onReset,
  }
  let body
  if (isTransport) {
    body = <TransportMain {...filterProps} />
  } else if (isTransportChild) {
    body = <TransportFilterForm {...filterProps} />
  } else {
    body = <GeneralFilterForm {...filterProps} />
  }
  return (
    <FormikProvider value={formik}>
      <Form className='w-full'>
        {body}
        <FormikAutoSave />
      </Form>
    </FormikProvider>
  )
})

export default FilterForm
