import {FC, useCallback, useEffect, useRef, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import {Formik, Form, Field, useFormikContext} from 'formik'
import {
  CACategoryDataFieldModel,
  CACategoryDataModel,
  FieldsModel,
} from 'front-api/src/models/index'
import {debounce, isEmpty, isEqual, parseInt, size} from 'lodash'
import {toast} from 'react-toastify'
import {useRouter} from 'next/router'
import {AdvertPages, PageProps} from './AdvertWizard'
import {makeRequest} from '../../api'
import {
  FormikCreateField,
  FormikSelect,
  FormikSwitch,
  getCreateOptions,
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
import SideNavigation from './SideNavigation'

const findSelectValue = (id, options) => {
  const option = options.find((o) => id === o.id)
  return {
    label: option.value,
    value: option.id,
  }
}
const mapFormikFields = (rawFields = [], fieldsById = {}) => {
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
const mapOriginalFields = (rawFields = {}, fieldsById = {}) => {
  return Object.fromEntries(
    Object.entries(rawFields)
      .map(([key, value]) => {
        const field = fieldsById[key]
        let mappedValue
        switch (field.fieldType) {
          case 'select':
          case 'iconselect': {
            mappedValue = findSelectValue(value[0], field.multiselects.top)
            break
          }
          case 'multiselect': {
            if (Array.isArray(value) && value.length) {
              mappedValue = value.map((v) =>
                findSelectValue(v, field.multiselects.top),
              )
            }
            break
          }
          default: {
            // eslint-disable-next-line prefer-destructuring
            if (value) mappedValue = value[0]
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
  console.log(state.draft)
  const {push, query} = useRouter()

  const headerRefs = useRef([])

  const [initialValues, setInitialValues] = useState({})
  const {languagesByIsoCode, user} = useGeneralStore()
  const fieldsRef = useRef({})
  const {t} = useTranslation()
  const conditionOptions = useRef([
    {
      value: 'new',
      label: t('NEW_PRODUCT'),
    },
    {
      value: 'used',
      label: t('USED_PRODUCT'),
    },
  ])
  const [category, setCategoryData] = useState<{
    data: CACategoryDataModel
    fieldsById: Record<string, CACategoryDataFieldModel>
  } | null>(() => mapCategoryData(state.draft.data))

  const {categoryId} = state.draft

  useEffect(() => {
    if (size(state.draft.currencies)) {
      const {draft} = state
      const mappedFields = mapOriginalFields(draft.fields, category.fieldsById)
      setInitialValues({
        fields: mappedFields,
        content: draft.content ?? [],
        photos: draft.photos ?? [],
        videos: draft.videos ?? [],
        condition: draft.condition
          ? conditionOptions.current.find((c) => draft.condition === c.value)
          : null,
        isBargainPossible: draft.isBargainPossible ?? false,
        isSwapPossible: draft.isSwapPossible ?? false,
        isExclusive: draft.isExclusive ?? false,
        isTop: draft.isTop ?? false,
        isSecureDeal: draft.isSecureDeal ?? false,
        isVip: draft.isVip ?? false,
        isFastSale: draft.isFastSale ?? false,
        price: draft.price ?? '',
        // @ts-ignore
        currency: state.draft.currencies[0],
      })
    }
  }, [state.draft])

  const onSubmit = (values) => {
    const {fields, condition} = values

    const mappedFields = mapFormikFields(fields, category.fieldsById)

    const data = {
      ...state.draft,
      ...values,
      userHash: user.hash,
      condition: condition?.value,
      fields: mappedFields,
    }

    makeRequest({
      url: '/api/submit-draft',
      data: {
        params: data,
        shouldUpdate: query.action === 'edit',
      },
      method: 'post',
    }).then((res) => {
      if (res.data.status === 200) {
        push(`/user/${user.hash}?activeTab=1`)
      } else if (res.data.error) {
        toast.error(t(res.data.error))
      }
    })
  }

  const onChangeFields = useCallback(
    debounce((newFields) => {
      const mappedFields = mapFormikFields(newFields, category.fieldsById)
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
    }, 1000),
    [category, fieldsRef],
  )

  let fieldsArray = []
  if (category?.data?.fields) {
    fieldsArray = category.data.fields
  }

  if (!category || !user) return null

  return (
    <div className=''>
      <h3 className='text-headline-8 text-hc-title font-bold mb-2 mt-8'>
        {category.data.name}
      </h3>
      <div className='flex'>
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

            if (!price && !categoryData.allowFree) {
              errors.price = t('PRICE_ERROR')
              toast.error(errors.price)
            }

            if (!condition && category.data.allowUsed) {
              errors.condition = t('FIELD_REQUIRED_ERROR', {
                field: t('ADVERT_TYPE'),
              })
              toast.error(errors.condition)
            }

            if (!mainContent?.title) {
              errors.content = t('EMPTY_TITLE_AND_DESCRIPTION')
              toast.error(errors.content)
            }

            if (size(photos) < categoryData.minPhotos) {
              const msg = t('PHOTO_ERROR', {minPhotos: categoryData.minPhotos})
              errors.photos = msg
              toast.error(msg)
            }

            // console.log('errors', errors)
            return errors
          }}
          validateOnBlur={false}
          validateOnChange={false}
          onSubmit={onSubmit}>
          {({submitForm}) => (
            <Form className='flex flex-col space-y-12 mt-6 mb-24 w-full'>
              <div>
                <AdvertFormHeading
                  title={t('ENTER_TITLE_AND_DESCRIPTION')}
                  ref={(ref) => {
                    headerRefs.current[0] = {
                      ref,
                      title: t('TITLE_AND_DESCRIPTION'),
                    }
                  }}
                />
                <AdvertFormField
                  body={
                    <Field
                      name='content'
                      maxDescriptionLength={category.data.descriptionLengthMax}
                      component={AdvertDescription}
                      user={user}
                      languagesByIsoCode={languagesByIsoCode}
                    />
                  }
                  labelDescription={t('TIP_DESCRIPTION_CREATE_ADV')}
                  label={t('TITLE_AND_DESCRIPTION')}
                  labelClassName='mt-2'
                  isRequired
                />
              </div>
              <div>
                <AdvertFormHeading
                  title={t('UPLOAD_PHOTO_AND_VIDEO')}
                  ref={(ref) => {
                    headerRefs.current[1] = {
                      ref,
                      title: t('PHOTO_AND_VIDEO'),
                    }
                  }}
                />
                <AdvertFormField
                  body={
                    <div className='w-full'>
                      <p className='text-body-2 text-nc-title mb-3'>
                        {t('ADD_PHOTO_HINT')}
                      </p>

                      <Field
                        component={AdvertPhotos}
                        name='photos'
                        maxPhotos={category.data.maxPhotos}
                      />
                      <p className='text-body-3 text-nc-secondary-text mb-6 mt-2'>
                        {t('TIP_FOR_ADDING_A_PHOTO', {
                          maxPhotos: category.data.maxPhotos,
                        })}
                      </p>
                    </div>
                  }
                  label={t('PRODUCT_PHOTOS')}
                  labelDescription={t('PHOTOS_AND_VIDEOS_PROPERTY_TEXT')}
                  isRequired={category.data.minPhotos > 0}
                />
                <AdvertFormField
                  body={
                    <div className='w-8/12'>
                      <Field
                        component={AdvertVideos}
                        name='videos'
                        categoryId={category.data.id}
                        maxVideoDuration={category.data.maxVideoDuration}
                      />
                      <p className='text-body-3 text-nc-secondary-text mb-6 mt-2'>
                        {t('INFORMATION_ BY_DOWNLOADING_VIDEO', {
                          descriptionLengthMax: `${
                            category.data.maxVideoDuration || 30
                          } MB`,
                        })}
                      </p>
                    </div>
                  }
                  label={t('PRODUCT_VIDEO')}
                  labelDescription={t('TIP_FOR_VIDEO')}
                  hide={!category.data.allowVideo}
                />
              </div>

              <div>
                <AdvertFormHeading
                  title={t('ENTER_PRICE')}
                  ref={(ref) => {
                    headerRefs.current[2] = {
                      ref,
                      title: t('PRICE'),
                    }
                  }}
                />
                <div className='space-y-4'>
                  <AdvertFormField
                    body={
                      <div className='w-1/3 l:w-4/12'>
                        <Field
                          name='price'
                          component={AdvertPrice}
                          currencies={state.draft.currencies}
                          allowSecureDeal={category.data.allowSecureDeal}
                        />
                      </div>
                    }
                    isRequired={!category.data.allowFree}
                    label={t('PRICE')}
                    labelTip={t('PRICE_TIP')}
                    labelClassName='mt-2'
                  />
                  {!!category.data.isProduct && (
                    <>
                      <AdvertFormField
                        body={
                          <div className='w-4/12'>
                            <Field
                              name='isSwapPossible'
                              component={FormikSwitch}
                            />
                          </div>
                        }
                        labelTip={t('POSSIBLE_EXCHANGE_TIP')}
                        className='l:items-center'
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
                        className='l:items-center'
                        label={t('BARGAIN')}
                      />
                    </>
                  )}
                </div>
              </div>
              {(category.data.allowUsed || !isEmpty(fieldsArray)) && (
                <div className='mb-96'>
                  <AdvertFormHeading
                    title={t('PRODUCT_FEATURES')}
                    ref={(ref) => {
                      headerRefs.current[3] = {
                        ref,
                        title: t('PARAMETERS'),
                      }
                    }}
                  />
                  <div className='space-y-4'>
                    {category.data.allowUsed && (
                      <AdvertFormField
                        body={
                          <div className='w-1/2 l:w-5/12'>
                            <Field
                              component={FormikSelect}
                              name='condition'
                              options={conditionOptions.current}
                              placeholder={t('PROD_CONDITION')}
                            />
                          </div>
                        }
                        className='l:items-center'
                        isRequired
                        labelClassName='mt-2'
                        label={t('PROD_CONDITION')}
                      />
                    )}
                    {fieldsArray.map((f) => {
                      return isEmpty(getCreateOptions(f.multiselects)) &&
                        ['select', 'multiselect', 'iconselect'].includes(
                          f.fieldType,
                        ) ? null : (
                        <AdvertFormField
                          key={f.id}
                          body={
                            <div className='w-1/2 l:w-5/12'>
                              <FormikCreateField field={f} />
                            </div>
                          }
                          className='l:items-center'
                          isRequired={f.isFillingRequired}
                          label={f.name}
                        />
                      )
                    })}
                  </div>
                </div>
              )}

              <div className='fixed inset-x-0 bottom-0 flex justify-between bg-white shadow-2xl px-8 m:px-10 l:px-29 py-2.5 z-10'>
                <OutlineButton
                  onClick={() => {
                    dispatch({
                      type: 'setPage',
                      page: AdvertPages.categoryPage,
                    })
                  }}
                  className={
                    query.action === 'create' ? 'visible' : 'invisible'
                  }>
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
        <div className='ml-12 hidden m:flex w-full max-w-288px '>
          <SideNavigation items={headerRefs.current} />
        </div>
      </div>
    </div>
  )
})

export default FormPage
