import {FC, useEffect, useRef, useState} from 'react'
import {Formik, Field, Form, FormikHelpers, FormikProps} from 'formik'
import {useTranslation} from 'next-i18next'
import {useRouter} from 'next/router'
import axios, {CancelTokenSource} from 'axios'
import {toJS} from 'mobx'
import {observer} from 'mobx-react-lite'
import {FormikField} from './FormikComponents'
import FormikAutoSave from '../FormikAutoSave'
import SecondaryButton from '../Buttons/SecondaryButton'
import {SelectItem} from '../Selects/Select'
import {
  useCategoriesStore,
  useProductsStore,
} from '../../providers/RootStoreProvider'
import {findCategoryByQuery} from '../../helpers'

const cancelToken = axios.CancelToken

interface Values {
  condition: SelectItem
  priceRange: {
    priceMin: string
    priceMax: string
  }
  onlyWithPhoto: boolean
  onlyDiscounted: boolean
  onlyFromSubscribed: boolean
}

const getInitialValues = (conditionOptions): Values => {
  return {
    condition: conditionOptions[0],
    priceRange: {
      priceMin: '',
      priceMax: '',
    },
    onlyWithPhoto: false,
    onlyDiscounted: false,
    onlyFromSubscribed: false,
  }
}

const CustomForm: FC = observer(() => {
  const {t} = useTranslation()
  const router = useRouter()
  const cancelTokenSourceRef = useRef<CancelTokenSource>()
  const {setFilter, resetFilter} = useProductsStore()
  const {categoryData} = useCategoriesStore()
  // console.log(toJS(categoryData).fields)
  const formikRef = useRef<FormikProps<Values>>()
  const conditionOptions = [
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
  ]

  useEffect(() => {
    if (formikRef.current) {
      formikRef.current.resetForm({values: getInitialValues(conditionOptions)})
      resetFilter()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.asPath])

  const [initialValue, setInitialValue] = useState<Values>(
    getInitialValues(conditionOptions),
  )
  const {fetchProducts} = useProductsStore()
  const {categories} = useCategoriesStore()

  return (
    <Formik
      validateOnChange
      innerRef={formikRef}
      enableReinitialize
      initialValues={initialValue}
      onSubmit={(values: Values, {setSubmitting}: FormikHelpers<Values>) => {
        return
        const {priceRange, onlyWithPhoto, onlyDiscounted, onlyFromSubscribed} =
          values

        setInitialValue(values)
        let condition = ''
        if (values.condition.value === 1) condition = '1'
        if (values.condition.value === 2) condition = '2'
        const currentCategory = findCategoryByQuery(
          router.query.categories,
          categories,
        )

        const filter = {
          condition,
          priceMin: parseInt(priceRange.priceMin, 10) || undefined,
          priceMax: parseInt(priceRange.priceMax, 10) || undefined,
          onlyWithPhoto,
          onlyDiscounted,
          onlyFromSubscribed,
          // categoryId: currentCategory.id,
        }
        setFilter(filter)
        if (cancelTokenSourceRef.current) cancelTokenSourceRef.current.cancel()
        cancelTokenSourceRef.current = cancelToken.source()
        fetchProducts({
          cancelTokenSource: cancelTokenSourceRef.current,
        }).then(() => setSubmitting(false))
      }}>
      {({resetForm}) => (
        <Form className='pt-8 space-y-6'>
          {categoryData.fields.map((field) => (
            <FormikField field={field} key={field.id} />
          ))}
          <div className='pt-6'>
            <SecondaryButton
              onClick={() => {
                resetForm({values: getInitialValues(conditionOptions)})
                resetFilter()
                if (cancelTokenSourceRef.current)
                  cancelTokenSourceRef.current.cancel()
                cancelTokenSourceRef.current = cancelToken.source()
                fetchProducts({
                  cancelTokenSource: cancelTokenSourceRef.current,
                })
              }}
              className='w-full'>
              {t('RESET_FILTER')}
            </SecondaryButton>
          </div>
          <FormikAutoSave />
        </Form>
      )}
    </Formik>
  )
})

export default CustomForm
