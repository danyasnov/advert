import {FC, useCallback, useContext, useEffect, useRef, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import {Formik, Form, Field, FormikValues} from 'formik'
import {
  CACategoryDataFieldModel,
  CACategoryDataModel,
} from 'front-api/src/models'
import {debounce, first, get, isEmpty, isEqual, size} from 'lodash'
import {toast} from 'react-toastify'
import {useRouter} from 'next/router'
import IcArrowBack from 'icons/material/ArrowBack.svg'
import {useWindowSize} from 'react-use'
import {AdvertPages, WizardContext} from './AdvertWizard'
import {makeRequest} from '../../api'
import AdvertDescription from './AdvertDescription'
import {useGeneralStore} from '../../providers/RootStoreProvider'
import AdvertPhotos from './AdvertMedia/AdvertPhotos'
import AdvertVideos from './AdvertMedia/AdvertVideos'
import PrimaryButton from '../Buttons/PrimaryButton'
import OutlineButton from '../Buttons/OutlineButton'
import AdvertFormField from './AdvertFormField'
import AdvertFormHeading from './AdvertFormHeading'
import SideNavigation from './SideNavigation'
import Button from '../Buttons/Button'
import FormikAdvertAutoSave from './FormikAdvertAutoSave'
import {
  CategoryUpdater,
  FormGroup,
  mapCategoryData,
  mapFormikFields,
  mapOriginalFields,
  validateCondition,
  validateFields,
  validatePhoto,
  validatePrice,
  validateTitle,
} from './utils'
import AdvertPrice from './AdvertPrice'
import {
  FormikCreateFields,
  FormikSelect,
  FormikSwitch,
} from '../FormikComponents'
import FormProgressBar from './FormProgressBar'

const FormPage: FC = observer(() => {
  const {state, dispatch} = useContext(WizardContext)
  const {push, query} = useRouter()
  const hash = first(query.hash)

  const formRef = useRef()

  const {width} = useWindowSize()
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
        currency: state.draft.currencies[0],
      })
    }
  }, [state.draft])

  const onSubmit = (values: FormikValues, saveDraft) => {
    const {fields, condition} = values

    const mappedFields = mapFormikFields(fields, category.fieldsById)

    const data = {
      ...state.draft,
      ...values,
      userHash: user.hash,
      condition: condition?.value,
      fields: mappedFields,
      hash,
    }

    if (saveDraft) {
      makeRequest({
        url: '/api/save-draft',
        method: 'post',
        data: {
          hash,
          draft: {...data, data: category.data},
        },
      })
    } else {
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
  let hasArrayType = false
  if (category?.data?.fields) {
    fieldsArray = category.data.fields
    hasArrayType = fieldsArray.some((f) => f.fieldType === 'array')
  }

  const conditionComponent = (
    <div className='w-full s:w-1/2 l:w-5/12'>
      <Field
        component={FormikSelect}
        name='condition'
        options={conditionOptions.current}
        placeholder={t('PROD_CONDITION')}
      />
    </div>
  )
  const arrayMobileView = hasArrayType && width < 768
  if (!category || !user) return null
  return (
    <div className='max-w-screen w-full'>
      <div className='flex items-center p-4 s:hidden'>
        <Button
          onClick={() => {
            dispatch({
              type: 'setPage',
              page: AdvertPages.categoryPage,
            })
          }}>
          <IcArrowBack className='w-6 h-6 fill-current text-nc-icon mr-4' />
        </Button>
        <h2 className='text-nc-title font-medium text-h-2'>
          {category.data.name}
        </h2>
      </div>
      {/* <h3 className='text-headline-8 text-hc-title font-bold mb-2 mt-8 hidden s:block'> */}
      {/*  {category.data.name} */}
      {/* </h3> */}
      <Formik
        enableReinitialize
        initialValues={initialValues}
        innerRef={formRef}
        validate={(values) => {
          const errors: any = {}
          // @ts-ignore
          const {photos, content, condition, price} = values
          const categoryData = category.data
          const titleError = validateTitle(content, user.mainLanguage, t)
          const photoError = validatePhoto(photos, categoryData.minPhotos, t)
          const priceError = validatePrice(price, categoryData.allowFree, t)
          const conditionError = validateCondition(
            condition,
            categoryData.allowUsed,
            t,
          )
          return {
            ...errors,
            ...titleError,
            ...photoError,
            ...priceError,
            ...conditionError,
          }
        }}
        validateOnBlur={false}
        validateOnChange={false}
        onSubmit={(val) => onSubmit(val, false)}>
        {({submitForm, values}) => {
          const validationState = [
            {
              key: 'TITLE_AND_DESCRIPTION',
              state: validateTitle(
                // @ts-ignore
                values.content,
                user.mainLanguage,
                t,
                true,
              ),
            },
            {
              key: 'PHOTO_AND_VIDEO',

              state: validatePhoto(
                // @ts-ignore
                values.photos,
                category.data.minPhotos,
                t,
                true,
              ),
            },
            {
              key: 'PRICE',

              state: validatePrice(
                // @ts-ignore
                values.price,
                category.data.allowFree,
                t,
                true,
              ),
            },
            ...(hasArrayType
              ? fieldsArray.map((fieldArray, index) => {
                  const {name, arrayTypeFields} = fieldArray
                  return {
                    key: name,
                    state: {
                      ...(index === 0
                        ? validateCondition(
                            // @ts-ignore
                            values.condition,
                            category.data.allowUsed,
                            t,
                            true,
                          )
                        : {}),
                      ...validateFields(
                        // @ts-ignore
                        values,
                        arrayTypeFields,
                        t,
                        true,
                      ),
                    },
                  }
                })
              : [
                  {
                    key: t('PARAMETERS'),
                    state: {
                      ...validateCondition(
                        // @ts-ignore
                        values.condition,
                        category.data.allowUsed,
                        t,
                        true,
                      ),
                      ...validateFields(
                        // @ts-ignore
                        values,
                        fieldsArray,
                        t,
                        true,
                      ),
                    },
                  },
                ]),
          ]
          return (
            <div className='flex px-4 s:px-0'>
              <div className='mr-12 hidden m:flex w-full max-w-288px '>
                <SideNavigation
                  categoryName={category.data.name}
                  draft={state.draft}
                  validationState={validationState}
                />
              </div>

              <Form
                className={`flex flex-col ${
                  arrayMobileView ? 'space-y-4' : 'space-y-6'
                } s:space-y-12 mt-6 mb-24 w-full`}>
                {arrayMobileView && (
                  <FormProgressBar
                    category={category.data}
                    values={values}
                    mainLanguage={user.mainLanguage}
                  />
                )}
                <div>
                  <FormGroup
                    webDefaultExpanded
                    expandView={arrayMobileView}
                    validate={(silently) =>
                      validateTitle(
                        // @ts-ignore
                        values.content,
                        user.mainLanguage,
                        t,
                        silently,
                      )
                    }
                    title={t('TITLE_AND_DESCRIPTION')}
                    getCountMeta={() => {
                      let filledCount = 0
                      let isRequiredFilled
                      const title = get(values, 'content[0].title')
                      const description = get(values, 'content[0].description')
                      if (title) {
                        isRequiredFilled = true
                        filledCount += 1
                      }
                      if (description) {
                        filledCount += 1
                      }
                      return {
                        isRequiredFilled,
                        filledCount,
                        maxFilled: 2,
                      }
                    }}
                    header={
                      <AdvertFormHeading
                        title={t('ENTER_TITLE_AND_DESCRIPTION')}
                        ref={(ref) => {
                          headerRefs.current[0] = {
                            ref,
                            title: t('TITLE_AND_DESCRIPTION'),
                          }
                        }}
                      />
                    }
                    body={
                      <AdvertFormField
                        body={
                          <Field
                            name='content'
                            maxDescriptionLength={
                              category.data.descriptionLengthMax
                            }
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
                    }
                  />
                </div>
                <div>
                  <FormGroup
                    webDefaultExpanded
                    expandView={arrayMobileView}
                    title={t('PHOTOS_AND_VIDEOS')}
                    header={
                      <AdvertFormHeading
                        title={t('UPLOAD_PHOTO_AND_VIDEO')}
                        ref={(ref) => {
                          headerRefs.current[1] = {
                            ref,
                            title: t('PHOTO_AND_VIDEO'),
                          }
                        }}
                      />
                    }
                    body={
                      <>
                        <AdvertFormField
                          body={
                            <div className='w-full'>
                              <p className='text-body-2 text-nc-title mb-3 hidden s:block'>
                                {t('ADD_PHOTO_HINT')}
                              </p>
                              <p className='text-body-2 text-nc-title mb-3 s:hidden'>
                                {t('SELECT_PHOTO_FROM_PHONE')}
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
                          labelDescription={t(
                            'PHOTOS_AND_VIDEOS_PROPERTY_TEXT',
                          )}
                          isRequired={category.data.minPhotos > 0}
                        />
                        <AdvertFormField
                          body={
                            <div className='w-8/12'>
                              <Field
                                component={AdvertVideos}
                                name='videos'
                                categoryId={category.data.id}
                                maxVideoDuration={
                                  category.data.maxVideoDuration
                                }
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
                      </>
                    }
                    getCountMeta={() => {
                      let filledCount = 0
                      let isRequiredFilled

                      const photos = get(values, 'photos')
                      const video = get(values, 'videos[0]')
                      if (size(photos) >= category.data.minPhotos) {
                        isRequiredFilled = true
                        filledCount += 1
                      }
                      if (video) {
                        filledCount += 1
                      }

                      return {
                        isRequiredFilled,
                        filledCount,
                        maxFilled: category.data.allowVideo ? 2 : 1,
                      }
                    }}
                    validate={() =>
                      // @ts-ignore
                      validatePhoto(values.photos, category.data.minPhotos, t)
                    }
                  />
                </div>

                <div>
                  <FormGroup
                    webDefaultExpanded
                    expandView={arrayMobileView}
                    title={t('PRICE')}
                    header={
                      <AdvertFormHeading
                        title={t('ENTER_PRICE')}
                        ref={(ref) => {
                          headerRefs.current[2] = {
                            ref,
                            title: t('PRICE'),
                          }
                        }}
                      />
                    }
                    body={
                      <div className='space-y-4'>
                        <AdvertFormField
                          body={
                            <div className='w-full s:w-1/3 l:w-4/12'>
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
                                <div className='w-full s:w-4/12'>
                                  <Field
                                    name='isSwapPossible'
                                    component={FormikSwitch}
                                    // eslint-disable-next-line react/jsx-props-no-spreading
                                    {...(width < 768
                                      ? {
                                          label: t('EXCHANGE'),
                                        }
                                      : {})}
                                  />
                                </div>
                              }
                              labelTip={t('POSSIBLE_EXCHANGE_TIP')}
                              className='l:items-center'
                              label={width < 768 ? undefined : t('EXCHANGE')}
                            />
                            <AdvertFormField
                              body={
                                <div className='w-full s:w-4/12'>
                                  <Field
                                    name='isBargainPossible'
                                    component={FormikSwitch}
                                    // eslint-disable-next-line react/jsx-props-no-spreading
                                    {...(width < 768
                                      ? {
                                          label: t('BARGAIN'),
                                        }
                                      : {})}
                                  />
                                </div>
                              }
                              className='l:items-center'
                              label={width < 768 ? undefined : t('BARGAIN')}
                            />
                          </>
                        )}
                      </div>
                    }
                    getCountMeta={() => {
                      let filledCount = 0
                      let isRequiredFilled

                      const price = get(values, 'price')
                      if (price) {
                        isRequiredFilled = true
                        filledCount += 1
                      }

                      return {
                        isRequiredFilled,
                        filledCount,
                        maxFilled: 1,
                      }
                    }}
                    validate={() =>
                      // @ts-ignore
                      validatePrice(values.photos, category.data.allowFree, t)
                    }
                  />
                </div>
                {hasArrayType
                  ? fieldsArray.map((fieldArray, index) => {
                      const {name, arrayTypeFields} = fieldArray
                      return (
                        <FormGroup
                          expandView={arrayMobileView}
                          title={name}
                          header={
                            <AdvertFormHeading
                              title={name}
                              ref={(ref) => {
                                headerRefs.current[3] = {
                                  ref,
                                  title: name,
                                }
                              }}
                            />
                          }
                          body={
                            <div className='space-y-4'>
                              {category.data.allowUsed && index === 0 && (
                                <AdvertFormField
                                  body={conditionComponent}
                                  className='l:items-center'
                                  isRequired
                                  labelClassName='mt-2'
                                  label={t('PROD_CONDITION')}
                                />
                              )}
                              <FormikCreateFields
                                fieldsArray={arrayTypeFields}
                              />
                            </div>
                          }
                          getCountMeta={() => {
                            const hasCondition =
                              index === 0 && category.data.allowUsed
                            let filledCount = 0
                            let isRequiredFilled = true

                            arrayTypeFields.forEach(
                              ({id, isFillingRequired}) => {
                                // @ts-ignore
                                if (get(values, `fields.${id}`)) {
                                  filledCount += 1
                                } else if (isFillingRequired) {
                                  isRequiredFilled = false
                                }
                              },
                            )

                            const maxFilled = arrayTypeFields.filter(
                              ({itemType}) => itemType === 'simple',
                            )

                            return {
                              isRequiredFilled,
                              filledCount,
                              maxFilled: hasCondition
                                ? maxFilled.length + 1
                                : maxFilled.length,
                            }
                          }}
                          validate={() => ({
                            ...(index === 0
                              ? validateCondition(
                                  // @ts-ignore
                                  values.condition,
                                  category.data.allowUsed,
                                  t,
                                )
                              : {}),
                            ...validateFields(
                              // @ts-ignore
                              values,
                              arrayTypeFields,
                              t,
                            ),
                          })}
                          webDefaultExpanded={false}
                        />
                      )
                    })
                  : (category.data.allowUsed || !isEmpty(fieldsArray)) && (
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
                              body={conditionComponent}
                              className='l:items-center'
                              isRequired
                              labelClassName='mt-2'
                              label={t('PROD_CONDITION')}
                            />
                          )}
                          <FormikCreateFields fieldsArray={fieldsArray} />
                        </div>
                      </div>
                    )}
                <div className='fixed inset-x-0 bottom-0 flex justify-between bg-white shadow-2xl px-8 m:px-10 l:px-29 py-2.5 z-10 justify-around'>
                  <div className='w-full l:w-1208px flex justify-between'>
                    <OutlineButton
                      onClick={() => {
                        dispatch({
                          type: 'setPage',
                          page: AdvertPages.categoryPage,
                        })
                      }}
                      className={`${
                        query.action === 'create' ? 'visible' : 'invisible'
                      } hidden s:block`}>
                      {t('BACK')}
                    </OutlineButton>
                    <PrimaryButton
                      onClick={submitForm}
                      className='w-full s:w-auto'>
                      {t('CONTINUE')}
                    </PrimaryButton>
                  </div>
                </div>
                <CategoryUpdater onChangeFields={onChangeFields} />
                {query.action === 'create' && (
                  <FormikAdvertAutoSave onSubmit={onSubmit} />
                )}
              </Form>
            </div>
          )
        }}
      </Formik>
    </div>
  )
})

export default FormPage
