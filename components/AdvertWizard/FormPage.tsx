import {FC, useEffect, useRef, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import {Formik, Form, Field, useFormikContext} from 'formik'
import {
  CACategoryDataFieldModel,
  CACategoryDataModel,
  FieldsModel,
} from 'front-api/src/models/index'
import {isEmpty, isEqual, parseInt, size} from 'lodash'
import {toast} from 'react-toastify'
import {useRouter} from 'next/router'
import {AdvertPages, PageProps} from './AdvertWizard'
import {makeRequest} from '../../api'
import {
  FormikCreateField,
  FormikSelect,
  FormikSwitch,
} from '../FormikComponents'
import AdvertDescription from './AdvertDescription'
import {useGeneralStore} from '../../providers/RootStoreProvider'
import AdvertPrice from './AdvertPrice'
import AdvertPhotos from './AdvertMedia/AdvertPhotos'
import AdvertVideos from './AdvertMedia/AdvertVideos'
import PrimaryButton from '../Buttons/PrimaryButton'
import OutlineButton from '../Buttons/OutlineButton'
import AdvertFormField from './AdvertFormField'
import AdvertFormHeading from './AdvertFormHeading'

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
const FormPage: FC<PageProps> = observer(({state, dispatch}) => {
  const {push} = useRouter()
  const [currencies, setCurrencies] = useState<[]>([])
  const [initialValues, setInitialValues] = useState({})
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
    if (size(currencies)) {
      if (state.formData) {
        setInitialValues(state.formData)
      } else {
        setInitialValues({
          fields: {},
          content: [],
          photos: [],
          videos: [],
          condition: null,
          isBargainPossible: false,
          isSwapPossible: false,
          isExclusive: false,
          isTop: false,
          isSecureDeal: false,
          isVip: false,
          isFastSale: false,
          price: '',
          // @ts-ignore
          currency: currencies[0],
        })
      }
    }
  }, [state.formData, currencies])
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
      location,
      condition: condition?.value,
      fields: mappedFields,
      degradation: state.degradation,
    }
    makeRequest({
      url: '/api/submit-draft',
      data: {
        params: data,
      },
      method: 'post',
    }).then((res) => {
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

  if (!category || isEmpty(currencies) || !user) return null

  return (
    <div className='w-full'>
      <h3 className='text-headline-8 text-hc-title font-bold mb-2 mt-8'>
        {category.data.name}
      </h3>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validate={(values) => {
          const errors: any = {}
          const {photos, content, condition, price} = values

          const categoryData = category.data

          const mainContent = content.find(
            (c) => c.langCode === user.mainLanguage.isoCode,
          )
          let isMissingFields = false
          const missingFieldsMsg = t('ADVERT_CREATING_HELP_ALERT')

          if (!price && !categoryData.allowFree) {
            isMissingFields = true
            errors.price = missingFieldsMsg
          }

          if (!condition) {
            isMissingFields = true
            errors.condition = missingFieldsMsg
          }

          if (!mainContent.title) {
            isMissingFields = true
            errors.content = missingFieldsMsg
          }

          if (size(photos) < categoryData.minPhotos) {
            const msg = t('PHOTO_ERROR', {minPhotos: categoryData.minPhotos})
            errors.photos = msg
            toast.error(msg)
          }

          if (isMissingFields) {
            toast.error(missingFieldsMsg)
          }
          return errors
        }}
        validateOnBlur={false}
        validateOnChange={false}
        onSubmit={onSubmit}>
        {({submitForm, values}) => (
          <Form className='w-full space-y-12 my-6 pb-20'>
            <div>
              <AdvertFormHeading title={t('ENTER_TITLE_AND_DESCRIPTION')} />
              <AdvertFormField
                body={
                  <div className='w-8/12'>
                    <Field
                      name='content'
                      component={AdvertDescription}
                      user={user}
                      languagesByIsoCode={languagesByIsoCode}
                    />
                  </div>
                }
                label={t('TITLE_AND_DESCRIPTION')}
                labelClassName='mt-2'
                isRequired
              />
            </div>

            <div>
              <AdvertFormHeading title={t('UPLOAD_PHOTO_AND_VIDEO')} />
              <AdvertFormField
                body={
                  <div className='w-8/12'>
                    <Field
                      component={AdvertPhotos}
                      name='photos'
                      maxPhotos={category.data.maxPhotos}
                    />
                  </div>
                }
                label={t('PRODUCT_PHOTOS')}
                isRequired
              />
              <AdvertFormField
                body={
                  <div className='w-8/12'>
                    <Field
                      component={AdvertVideos}
                      name='videos'
                      // maxVideoDuration={category.data.maxVideoDuration}
                    />
                  </div>
                }
                label={t('PRODUCT_VIDEO')}
                hide={!category.data.allowVideo}
              />
            </div>

            <div>
              <AdvertFormHeading title={t('ENTER_PRICE')} />
              <div className='space-y-4'>
                <AdvertFormField
                  body={
                    <div className='w-4/12'>
                      <Field
                        name='price'
                        component={AdvertPrice}
                        currencies={currencies}
                        allowSecureDeal={category.data.allowSecureDeal}
                      />
                    </div>
                  }
                  isRequired={!category.data.allowFree}
                  label={t('PRICE')}
                  labelClassName='mt-2'
                />
                <AdvertFormField
                  body={
                    <div className='w-4/12'>
                      <Field name='isSwapPossible' component={FormikSwitch} />
                    </div>
                  }
                  className='items-center'
                  label={t('EXCHANGE')}
                />
                <AdvertFormField
                  body={
                    <div className='w-4/12'>
                      <Field
                        name='isBargainPossible'
                        component={FormikSwitch}
                      />
                    </div>
                  }
                  className='items-center'
                  label={t('BARGAIN')}
                />
              </div>
            </div>
            <div>
              <AdvertFormHeading title={t('PRODUCT_FEATURES')} />
              <div className='space-y-4'>
                <AdvertFormField
                  body={
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
                  }
                  className='items-center'
                  isRequired
                  labelClassName='mt-2'
                  label={t('CONDITION')}
                />
                {fieldsArray.map((f) => (
                  <AdvertFormField
                    key={f.id}
                    body={
                      <div className='w-5/12'>
                        <FormikCreateField field={f} />
                      </div>
                    }
                    className='items-center'
                    isRequired={f.isFillingRequired}
                    label={f.name}
                  />
                ))}
              </div>
            </div>

            <div className='fixed inset-x-0 bottom-0 flex justify-between bg-white shadow-2xl px-29 py-2.5 z-10'>
              <OutlineButton
                onClick={() => {
                  dispatch({
                    type: 'setFormData',
                    page: values,
                  })
                  dispatch({
                    type: 'setPage',
                    page: AdvertPages.categoryPage,
                  })
                }}>
                {t('BACK')}
              </OutlineButton>
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

export default FormPage
