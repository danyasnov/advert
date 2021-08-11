import {FC, useEffect, useMemo, useRef, useState} from 'react'
import {Formik, Field, Form, FormikHelpers, FormikProps} from 'formik'
import {useTranslation} from 'next-i18next'
import {useRouter} from 'next/router'
import {isEmpty} from 'lodash'
import {observer} from 'mobx-react-lite'
import {toJS} from 'mobx'
import {
  FormikCheckbox,
  FormikField,
  FormikRange,
  FormikSegmented,
} from './FormikComponents'
import FormikAutoSave from '../FormikAutoSave'
import SecondaryButton from '../Buttons/SecondaryButton'
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
} from '../../helpers'
import PrimaryButton from '../Buttons/PrimaryButton'
import {clearUrlFromQuery} from '../../utils'

interface Values {
  condition: SelectItem
  priceRange: string[]
  onlyWithPhoto: boolean
  onlyDiscounted: boolean
  fields?: Record<string, unknown>
}

interface Props {
  setShowFilter?: (val: boolean) => void
}

const FilterForm: FC<Props> = observer(({setShowFilter}) => {
  const {t} = useTranslation()
  const router = useRouter()
  const {
    setFilter,
    resetFilter,
    fetchProducts,
    aggregatedFields,
    newCount,
    applyFilter,
    isFilterApplied,
  } = useProductsStore()

  const {categoryDataFieldsById, categories, categoryDataFieldsBySlug} =
    useCategoriesStore()
  const currentCategory = findCategoryByQuery(
    router.query.categories,
    categories,
  )
  const formikRef = useRef<FormikProps<Values>>()
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

  const getInitialValues = (reset?: boolean): Values => {
    const defaultValues = {
      condition: conditionOptions[0],
      priceRange: ['', ''],
      onlyWithPhoto: false,
      onlyDiscounted: false,
      fields: {},
    }
    if (reset) return defaultValues
    const filter = getFormikInitialFromQuery(
      router.query,
      aggregatedFields.reduce((acc, val) => ({...acc, [val.slug]: val}), {}),
    )

    if (filter) {
      let condition = conditionOptions[0]
      // eslint-disable-next-line prefer-destructuring
      if (filter.condition === '1') condition = conditionOptions[1]
      // eslint-disable-next-line prefer-destructuring
      if (filter.condition === '2') condition = conditionOptions[2]
      const values: Partial<Values> = {
        ...filter,
        condition,
      }

      return {...defaultValues, ...values}
    }

    return defaultValues
  }

  useEffect(() => {
    if (formikRef.current) {
      formikRef.current.resetForm({values: getInitialValues()})
      resetFilter()
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [JSON.stringify(router.query.categories)])
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

  return (
    <Formik
      validateOnChange
      innerRef={formikRef}
      enableReinitialize
      initialValues={initialValues}
      onSubmit={(values: Values, {setSubmitting}: FormikHelpers<Values>) => {
        const {priceRange, onlyWithPhoto, onlyDiscounted, fields} = values

        const mappedFields = Object.fromEntries(
          Object.entries(fields)
            .map(([key, value]) => {
              const field = categoryDataFieldsById[key]
              let mappedValue
              switch (field.fieldType) {
                case 'select':
                case 'iconselect':
                case 'multiselect': {
                  if (Array.isArray(value) && value.length)
                    mappedValue = value.map((v) => v.value)
                  break
                }
                case 'int': {
                  mappedValue = []
                  if (Array.isArray(value)) {
                    if (value[0] || value[0] === 0)
                      mappedValue[0] = parseInt(value[0], 10)
                    if (value[1] || value[1] === 0)
                      mappedValue[1] = parseInt(value[1], 10)
                  }
                  break
                }
                default: {
                  if (value) mappedValue = [value]
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

        const filter = {
          condition,
          priceMin: parseInt(priceRange[0], 10) || undefined,
          priceMax: parseInt(priceRange[1], 10) || undefined,
          onlyWithPhoto,
          onlyDiscounted,
          fields: mappedFields,
        }

        const updatedFilter = setFilter(filter)
        const params = new URLSearchParams(window.location.search)
        const sortBy = params.get('sortBy')
        const newParams = new URLSearchParams(
          getUrlQueryFromFilter(
            updatedFilter,
            aggregatedFields.reduce(
              (acc, val) => ({...acc, [val.id]: val}),
              {},
            ),
          ),
        )
        if (sortBy) newParams.set('sortBy', sortBy)
        shallowUpdateQuery(newParams.toString())
        fetchProducts({query: router.query}).then(() => setSubmitting(false))
      }}>
      {({resetForm}) => (
        <Form className='space-y-8 divide-y w-full'>
          <div className='space-y-6'>
            {!isEmpty(options) && (
              <Select
                id='SUBCATEGORY'
                placeholder={t('SUBCATEGORY')}
                value={currentOption}
                options={options}
                onChange={(opt: SelectItem & {slug: string}) => {
                  if (opt?.value) setFilter({categoryId: opt.value as number})
                  if (currentCategory.items.length) {
                    router.push(
                      `${clearUrlFromQuery(router.asPath)}/${opt.slug}`,
                    )
                  } else {
                    const pathArray = clearUrlFromQuery(router.asPath).split(
                      '/',
                    )
                    pathArray[pathArray.length - 1] = opt.slug
                    router.push(pathArray.join('/'))
                  }
                }}
              />
            )}
            <Field
              name='condition'
              options={conditionOptions}
              component={FormikSegmented}
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
          </div>

          {!isEmpty(aggregatedFields) && (
            <div className='space-y-6 pt-8'>
              {aggregatedFields.map((field) => {
                return <FormikField field={field} key={field.id} />
              })}
            </div>
          )}

          <div className='space-y-6 pt-8'>
            <Field
              name='onlyWithPhoto'
              component={FormikCheckbox}
              label={t('WITH_PHOTO')}
            />
            <Field
              name='onlyDiscounted'
              component={FormikCheckbox}
              label={t('ONLY_WITH_DISCOUNT')}
            />
          </div>
          <div className='pt-4 flex justify-center s:justify-between m:flex-col'>
            {!isFilterApplied && (
              <PrimaryButton
                onClick={() => {
                  if (setShowFilter) setShowFilter(false)
                  applyFilter()
                }}
                className='w-full s:w-min py-3 px-3.5 m:w-full m:mb-2 whitespace-nowrap'>
                {t('SHOW_ADVERTS', {count: newCount})}
              </PrimaryButton>
            )}
            <SecondaryButton
              onClick={() => {
                resetForm({values: getInitialValues(true)})
                shallowUpdateQuery()
                resetFilter()
                fetchProducts({query: router.query}).then(() => applyFilter())
              }}
              className='w-full hidden s:block s:w-min py-3 px-3.5 m:w-full'>
              {t('RESET_FILTER')}
            </SecondaryButton>
          </div>
          <FormikAutoSave />
        </Form>
      )}
    </Formik>
  )
})

export default FilterForm
