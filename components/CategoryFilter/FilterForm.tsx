import {FC, useEffect, useMemo, useRef, useState} from 'react'
import {Formik, Field, Form, FormikHelpers, FormikProps} from 'formik'
import {useTranslation} from 'next-i18next'
import {useRouter} from 'next/router'
import {isEmpty} from 'lodash'
import {observer} from 'mobx-react-lite'
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
} from '../../helpers'

interface Values {
  condition: SelectItem
  priceRange: {
    priceMin: string
    priceMax: string
  }
  onlyWithPhoto: boolean
  onlyDiscounted: boolean
  onlyFromSubscribed: boolean
  fields?: Record<string, unknown>
}

const FilterForm: FC = observer(() => {
  const {t} = useTranslation()
  const router = useRouter()
  const {setFilter, resetFilter, fetchProducts, aggregatedFields} =
    useProductsStore()
  const {categoryDataFieldsBySlug, categories} = useCategoriesStore()
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

  const getInitialValues = (): Values => {
    return {
      condition: conditionOptions[0],
      priceRange: {
        priceMin: '',
        priceMax: '',
      },
      onlyWithPhoto: false,
      onlyDiscounted: false,
      onlyFromSubscribed: false,
      fields: {},
    }
  }

  useEffect(() => {
    if (formikRef.current) {
      formikRef.current.resetForm({values: getInitialValues()})
      resetFilter()
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [conditionOptions, resetFilter, router.asPath])

  const [initialValue, setInitialValue] = useState<Values>(getInitialValues())

  const currentCategoriesOptions = findCurrentCategoriesOptionsyByQuery(
    router.query.categories,
    categories,
  )

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
      initialValues={initialValue}
      onSubmit={(values: Values, {setSubmitting}: FormikHelpers<Values>) => {
        const {
          priceRange,
          onlyWithPhoto,
          onlyDiscounted,
          onlyFromSubscribed,
          fields,
        } = values
        const mappedFields = Object.fromEntries(
          Object.entries(fields)
            .map(([key, value]) => {
              const field = categoryDataFieldsBySlug[key]
              let mappedValue
              switch (field.fieldType) {
                case 'select': {
                  const fieldValue = value as SelectItem
                  if (fieldValue?.value) mappedValue = [fieldValue.value]
                  break
                }
                case 'multiselect': {
                  if (Array.isArray(value) && value.length)
                    mappedValue = value.map((v) => v.value)
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
          priceMin: parseInt(priceRange.priceMin, 10) || undefined,
          priceMax: parseInt(priceRange.priceMax, 10) || undefined,
          onlyWithPhoto,
          onlyDiscounted,
          onlyFromSubscribed,
          fields: mappedFields,
        }
        setFilter(filter)
        fetchProducts().then(() => setSubmitting(false))
      }}>
      {({resetForm}) => (
        <Form className='space-y-8 divide-y'>
          <div className='space-y-6'>
            <Select
              id='SUBCATEGORY'
              placeholder={t('SUBCATEGORY')}
              value={currentOption}
              options={options}
              onChange={(opt: SelectItem & {slug: string}) => {
                if (opt?.value) setFilter({categoryId: opt.value as number})
                if (currentCategory.items.length) {
                  router.push(`${router.asPath}/${opt.slug}`)
                } else {
                  const pathArray = router.asPath.split('/')
                  pathArray[pathArray.length - 1] = opt.slug
                  router.push(pathArray.join('/'))
                }
              }}
            />
            <Field
              name='condition'
              options={conditionOptions}
              component={FormikSegmented}
            />
            <Field
              name='priceRange'
              component={FormikRange}
              validate={(value) => {
                const {priceMin, priceMax} = value
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
            <Field
              name='onlyFromSubscribed'
              component={FormikCheckbox}
              label={t('SHOW_ADVERTS_FROM_FAVORITE_SELLERS')}
            />
          </div>
          <div className='pt-8 flex justify-center'>
            <SecondaryButton
              onClick={() => {
                resetForm({values: getInitialValues()})
                resetFilter()
                fetchProducts()
              }}
              className='w-full max-w-64'>
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
