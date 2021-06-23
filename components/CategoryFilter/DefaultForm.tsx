import {FC, useEffect, useRef, useState} from 'react'
import {Formik, Field, Form, FormikHelpers, FormikProps} from 'formik'
import {useTranslation} from 'next-i18next'
import {useRouter} from 'next/router'
import {FormikCheckbox, FormikRange, FormikSegmented} from './FormikComponents'
import FormikAutoSave from '../FormikAutoSave'
import SecondaryButton from '../Buttons/SecondaryButton'
import {SelectItem} from '../Selects/Select'
import {useProductsStore} from '../../providers/RootStoreProvider'

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

const DefaultForm: FC = () => {
  const {t} = useTranslation()
  const router = useRouter()
  const {setFilter, resetFilter} = useProductsStore()
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

  return (
    <Formik
      validateOnChange
      innerRef={formikRef}
      enableReinitialize
      initialValues={initialValue}
      onSubmit={(values: Values, {setSubmitting}: FormikHelpers<Values>) => {
        const {priceRange, onlyWithPhoto, onlyDiscounted, onlyFromSubscribed} =
          values

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
        }
        setFilter(filter)
        fetchProducts().then(() => setSubmitting(false))
      }}>
      {({resetForm}) => (
        <Form className='pt-8 space-y-6 divide-y'>
          <div className='space-y-6'>
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

          <div className='space-y-6 pt-6'>
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
          <div className='pt-6'>
            <SecondaryButton
              onClick={() => {
                resetForm({values: getInitialValues(conditionOptions)})
                resetFilter()
                fetchProducts()
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
}

export default DefaultForm
