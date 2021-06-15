import {FC} from 'react'
import {Formik, Field, Form, FormikHelpers} from 'formik'
import {useTranslation} from 'next-i18next'
import {FormikCheckbox, FormikRange, FormikSegmented} from './FormikComponents'
import FormikAutoSave from '../FormikAutoSave'
import SecondaryButton from '../Buttons/SecondaryButton'
import {SelectItem} from '../Selects/Select'

interface Values {
  condition: SelectItem
  priceRange: {
    priceMin: string
    priceMax: string
  }
  secureDeal: boolean
  withDiscount: boolean
  onlyFavorite: boolean
}
const DefaultForm: FC = () => {
  const {t} = useTranslation()
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
  return (
    <Formik
      validateOnChange
      initialValues={{
        condition: conditionOptions[0],
        priceRange: {
          priceMin: '',
          priceMax: '',
        },
        secureDeal: false,
        withDiscount: false,
        onlyFavorite: false,
      }}
      onSubmit={(values: Values, {setSubmitting}: FormikHelpers<Values>) => {
        console.log(values)
        setSubmitting(false)
      }}>
      {({handleReset}) => (
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
              name='secureDeal'
              component={FormikCheckbox}
              label={t('WITH_PHOTO')}
            />
            <Field
              name='withDiscount'
              component={FormikCheckbox}
              label={t('ONLY_WITH_DISCOUNT')}
            />
            <Field
              name='onlyFavorite'
              component={FormikCheckbox}
              label={t('SHOW_ADVERTS_FROM_FAVORITE_SELLERS')}
            />
          </div>
          <div className='pt-6'>
            <SecondaryButton onClick={handleReset} className='w-full'>
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
