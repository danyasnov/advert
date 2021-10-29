import {FC, useEffect, useRef, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import {Formik, Form, Field, useFormikContext} from 'formik'
import {
  CACategoryDataFieldModel,
  CACategoryDataModel,
  CAParamContent,
  CurrencyModel,
  FieldsModel,
} from 'front-api/src/models/index'
import {isEmpty, isEqual, parseInt, size} from 'lodash'
import {toast} from 'react-toastify'
import {useRouter} from 'next/router'
import {PageProps} from './AdvertWizard'
import {makeRequest} from '../../api'
import {
  FormikCreateField,
  FormikSelect,
  FormikSwitch,
} from '../FormikComponents'
import FormikAutoSave from '../FormikAutoSave'
import AdvertDescription from './AdvertDescription'
import {useGeneralStore} from '../../providers/RootStoreProvider'
import AdvertPrice from './AdvertPrice'
import AdvertPhotos from './AdvertMedia/AdvertPhotos'
import AdvertVideos from './AdvertMedia/AdvertVideos'
import PrimaryButton from '../Buttons/PrimaryButton'

const mapFields = (rawFields, fieldsById) => {
  return Object.fromEntries(
    Object.entries(rawFields)
      .map(([key, value]) => {
        const field = fieldsById[key]
        let mappedValue
        switch (field.fieldType) {
          case 'select':
          case 'iconselect': {
            // @ts-ignore
            if (value?.value) {
              // @ts-ignore
              mappedValue = [value.value]
            }
            break
          }
          case 'multiselect': {
            if (Array.isArray(value) && value.length) {
              mappedValue = value.map((v) => v.value)
            }
            break
          }
          case 'int': {
            const formattedValue = parseInt(value as string, 10)
            if (!Number.isNaN(formattedValue)) {
              mappedValue = [formattedValue]
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
}
const mapCategoryData = (
  category: CACategoryDataModel,
): {
  data: CACategoryDataModel
  fieldsById: Record<string, CACategoryDataFieldModel>
} => {
  return {
    data: category,
    fieldsById: category.fields.reduce((acc, value) => {
      acc[value.id] = value
      return acc
    }, {}),
  }
}
const FormPage: FC<PageProps> = observer(({state, dispatch}) => {
  const {push} = useRouter()
  const [currencies, setCurrencies] = useState<[]>([])
  const {languagesByIsoCode, user} = useGeneralStore()
  const fieldsRef = useRef({})
  const {t} = useTranslation()
  const [category, setCategoryData] = useState<{
    data: CACategoryDataModel
    fieldsById: Record<string, CACategoryDataFieldModel>
  } | null>(null)

  const categoryId = state.category.id
  const location = {
    latitude: state.location.lat,
    longitude: state.location.lng,
  }
  useEffect(() => {
    makeRequest({
      url: '/api/category-data',
      method: 'post',
      data: {
        id: categoryId,
      },
    }).then((data) => {
      setCategoryData(mapCategoryData(data.data.result))
    })
    makeRequest({
      url: '/api/currencies-by-gps',
      method: 'post',
      data: {
        location,
      },
    }).then((data) => {
      setCurrencies(data.data.result)
    })
  }, [])
  const onSubmit = async (values) => {
    const {fields, condition} = values

    const mappedFields = mapFields(fields, category.fieldsById)

    const data = {
      ...values,
      price: values.price,
      categoryId,
      userHash: user.hash,
      videos: [],
      location,
      condition: condition?.value,
      fields: mappedFields,
      degradation: 'absent',
      isTop: false,
      isSecureDeal: false,
      isVip: false,
      isFastSale: false,
    }
    makeRequest({
      url: '/api/submit-draft',
      data: {
        params: data,
      },
      method: 'post',
    }).then((res) => {
      console.log(res)
      if (res.status === 200) {
        push(`/user/${user.hash}`)
      }
    })
  }

  const onChangeFields = (fields) => {
    const mappedFields = mapFields(fields, category.fieldsById)
    if (!isEqual(mappedFields, fieldsRef.current)) {
      fieldsRef.current = mappedFields
      makeRequest({
        url: '/api/category-data',
        method: 'post',
        data: {
          id: categoryId,
          editFields: mappedFields,
        },
      }).then((res) => {
        setCategoryData(mapCategoryData(res.data.result))
      })
    }
  }

  let fieldsArray = []
  if (category?.data?.fields) {
    fieldsArray = category.data.fields
  }
  console.log(location)

  if (!category || isEmpty(currencies) || !user) return null
  return (
    <div className='w-full'>
      <h3 className='text-headline-8 text-hc-title font-bold mb-2 mt-8'>
        {t('SELECT_CATEGORY')}
      </h3>
      <Formik
        initialValues={{
          fields: {},
          content: [],
          photos: [],
          videos: [],
          condition: null,
          isBargainPossible: false,
          isSwapPossible: false,
          isExclusive: false,
          price: '',
          // @ts-ignore
          currency: currencies[0],
        }}
        validate={(values) => {
          const errors: any = {}
          const {photos, content} = values

          const categoryData = category.data

          const mainContent = content.find(
            (c) => c.langCode === user.mainLanguage.isoCode,
          )

          if (!mainContent.title) {
            const msg = t('ADVERT_CREATING_HELP_ALERT')
            errors.content = t(msg)
            toast.error(msg)
          }

          if (size(photos) < categoryData.minPhotos) {
            const msg = t('PHOTO_ERROR', {minPhotos: categoryData.minPhotos})
            errors.photos = msg
            toast.error(msg)
          }
          return errors
        }}
        validateOnBlur={false}
        validateOnChange={false}
        onSubmit={onSubmit}>
          {({submitForm}) => (<Form className='w-full space-y-12 my-6 pb-20'>
            <div className='flex w-full'>
              <div className='w-4/12'>
                <span className='text-body-1 text-nc-title'>
                  {t('TITLE_AND_DESCRIPTION')}
                </span>
                <span className='text-body-1 text-nc-primary ml-1'>*</span>
              </div>

              {user && (
                <div className='w-8/12'>
                  <Field
                    name='content'
                    component={AdvertDescription}
                    user={user}
                    languagesByIsoCode={languagesByIsoCode}
                  />
                </div>
              )}
            </div>
            <div className='flex w-full'>
              <div className='w-4/12'>
                <span className='text-body-1 text-nc-title'>
                  {t('PRODUCT_PHOTOS')}
                </span>
                <span className='text-body-1 text-nc-primary ml-1'>*</span>
              </div>
              <div className='w-8/12'>
                <Field
                  component={AdvertPhotos}
                  name='photos'
                  maxPhotos={category.data.maxPhotos}
                />
              </div>
            </div>
            {category.data.allowVideo && (
              <div className='flex w-full'>
                <div className='w-4/12'>
                  <span className='text-body-1 text-nc-title'>
                    {t('PRODUCT_VIDEO')}
                  </span>
                  <span className='text-body-1 text-nc-primary ml-1'>*</span>
                </div>
                <div className='w-8/12'>
                  <AdvertVideos />
                </div>
              </div>
            )}
            <div className='space-y-4'>
              <div className='flex w-full'>
                <div className='w-4/12'>
                  <span className='text-body-1 text-nc-title'>
                    {t('PRICE')}
                  </span>
                  <span className='text-body-1 text-nc-primary ml-1'>*</span>
                </div>
                <div className='w-4/12'>
                  <Field
                    name='price'
                    component={AdvertPrice}
                    currencies={currencies}
                    allowSecureDeal={category.data.allowSecureDeal}
                  />
                </div>
              </div>
              <div className='flex w-full'>
                <div className='w-4/12'>
                  <span className='text-body-1 text-nc-title'>
                    {t('EXCHANGE')}
                  </span>
                </div>
                <div className='w-4/12'>
                  <Field name='isSwapPossible' component={FormikSwitch} />
                </div>
              </div>
              <div className='flex w-full'>
                <div className='w-4/12'>
                  <span className='text-body-1 text-nc-title'>
                    {t('BARGAIN')}
                  </span>
                </div>
                <div className='w-4/12'>
                  <Field name='isBargainPossible' component={FormikSwitch} />
                </div>
              </div>
            </div>
            <div>
              <p className='text-nc-title text-h-2 font-medium mb-6'>
                {t('PRODUCT_FEATURES')}
              </p>
              <div className='space-y-4'>
                <div className='flex items-center'>
                  <span className='w-4/12 text-body-1 text-nc-title'>
                    {t('CONDITION')}

                    <span className='text-body-1 text-nc-primary ml-1'>*</span>
                  </span>
                  <div className='w-5/12'>
                    <Field
                      component={FormikSelect}
                      name='condition'
                      options={[
                        {
                          value: 'new',
                          label: t('NEW_PRODUCT'),
                        },
                        {
                          value: 'used',
                          label: t('USED_PRODUCT'),
                        },
                      ]}
                      placeholder={t('CONDITION')}
                    />
                  </div>
                </div>
                {fieldsArray.map((f) => (
                  <div className='flex items-center' key={f.id}>
                    <span className='w-4/12 text-body-1 text-nc-title'>
                      {f.name}
                      {f.isFillingRequired ? (
                        <span className='text-body-1 text-nc-primary ml-1'>
                          *
                        </span>
                      ) : (
                        ''
                      )}
                    </span>
                    <div className='w-5/12'>
                      <FormikCreateField field={f} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className='fixed inset-x-0 bottom-0 flex justify-end bg-white shadow-2xl px-29 py-2.5 z-10'>
              <PrimaryButton onClick={submitForm}>
                {t('CONTINUE')}
              </PrimaryButton>
            </div>
            <CategoryUpdater onChangeFields={onChangeFields} />
          </Form>
        )}
      </Formik>
    </div>
  )
})

const CategoryUpdater: FC<{onChangeFields: (fields: FieldsModel) => void}> = ({
  onChangeFields,
}) => {
  const {values} = useFormikContext()
  useEffect(() => {
    // @ts-ignore
    onChangeFields(values.fields)
    // @ts-ignore
  }, [values.fields])
  return null
}

export default FormPage
