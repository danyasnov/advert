import {FC, useCallback, useContext, useRef, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import {
  Form,
  Field,
  FormikValues,
  FormikHelpers,
  useFormik,
  FormikProvider,
  FormikErrors,
} from 'formik'
import {
  CACategoryDataFieldModel,
  CACategoryDataModel,
} from 'front-api/src/models'
import {debounce, first, get, isEqual, size} from 'lodash'
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
  hasErrors,
  mapCategoryData,
  mapFormikFields,
  mapOriginalFields,
  scrollToFirstError,
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
import {NavItem} from '../../types'

const FormPage: FC = observer(() => {
  const {state, dispatch} = useContext(WizardContext)
  const {push, query} = useRouter()
  const hash = first(query.hash)

  const {width} = useWindowSize()
  const headerRefs = useRef([])

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
  const [initialValues] = useState(() => {
    const {draft} = state
    const mappedFields = mapOriginalFields(draft.fields, category.fieldsById)
    return {
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
    }
  })

  const onSubmit = ({
    values,
    saveDraft,
    helpers,
  }: {
    values: FormikValues
    helpers: FormikHelpers<any>
    saveDraft: boolean
  }) => {
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
      }).then(() => {
        helpers.setSubmitting(false)
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
          helpers.setSubmitting(false)
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
        makeRequest(
          {
            url: '/api/category-data',
            method: 'post',
            data: {
              id: categoryId,
              editFields: mappedFields,
            },
          },
          {
            retries: 2,
            retryDelay: () => 2000,
          },
        ).then((res) => {
          setCategoryData(mapCategoryData(res.data.result))
        })
      }
    }, 1000),
    [category, fieldsRef],
  )

  const validate = (values) => {
    const errors: any = {}
    // @ts-ignore
    const {photos, content, condition, price} = values
    const categoryData = category.data
    const titleError = validateTitle(content, t)
    const photoError = validatePhoto(photos, categoryData.minPhotos, t)
    const priceError = validatePrice(price, categoryData.allowFree, t)
    const conditionError = validateCondition(
      condition,
      categoryData.allowUsed,
      t,
    )
    const result = {
      ...errors,
      ...titleError,
      ...photoError,
      ...priceError,
      ...conditionError,
    }
    if (hasErrors(result)) {
      toast.error(t('ADVERT_CREATING_HELP_ALERT'))
    }
    return result
  }

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: (values, helpers) =>
      onSubmit({values, saveDraft: false, helpers}),
  })
  const {submitForm, values, isSubmitting, setErrors} = formik

  let fieldsArray = []
  let hasArrayType = false
  if (category?.data?.fields) {
    fieldsArray = category.data.fields
    hasArrayType = fieldsArray.some((f) => f.fieldType === 'array')
    if (!hasArrayType) {
      fieldsArray = [
        {
          name: t('PARAMETERS'),
          arrayTypeFields: fieldsArray,
        },
      ]
    }
  }
  const formItems: NavItem[] = [
    {
      key: 'TITLE_AND_DESCRIPTION',
      validate: (val) =>
        validateTitle(
          // @ts-ignore
          val.content,
          t,
        ),
    },
    {
      key: 'PHOTO_AND_VIDEO',
      validate: (val) =>
        validatePhoto(
          // @ts-ignore
          val.photos,
          category.data.minPhotos,
          t,
        ),
    },
    ...fieldsArray.map((fieldArray, index) => {
      const {name, arrayTypeFields} = fieldArray
      return {
        key: name,
        validate: (val) => ({
          ...(index === 0
            ? validateCondition(
                // @ts-ignore
                val.condition,
                category.data.allowUsed,
                t,
              )
            : {}),
          ...validateFields(
            // @ts-ignore
            val,
            arrayTypeFields,
            t,
          ),
        }),
      }
    }),
    {
      key: 'COST_AND_TERMS',
      validate: (val) =>
        validatePrice(
          // @ts-ignore
          val.price,
          category.data.allowFree,
          t,
        ),
    },
  ]
  const getFormState = (showAll?) => {
    let hasPending = false
    return formItems.map((s) => {
      const validation = s.validate(values, true)
      const validationState = validation
      const status = hasErrors(validation) ? 'pending' : 'done'

      let visible

      if (showAll) {
        visible = true
      } else if (hasPending) {
        visible = formStateDict?.[s.key]?.visible || false
      } else if (hasErrors(validationState)) {
        hasPending = true
        visible = true
      } else {
        visible = true
      }

      return {...s, state: validationState, status, visible}
    })
  }

  const getFormStateDict = (items) => {
    return items.reduce((acc, val) => ({...acc, [val.key]: val}), {})
  }
  const showWholeForm = width < 768 || !hasArrayType || query.action === 'edit'

  const [formStateDict, setFormStateDict] = useState<Record<string, NavItem>>(
    () => {
      return getFormStateDict(getFormState(showWholeForm))
    },
  )

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
  const formState = getFormState()
  const currentStep = showWholeForm
    ? undefined
    : formState
        .slice()
        .reverse()
        .find((i) => i.status === 'pending' && i.visible)

  if (!category || !user) return null
  // console.log(category.data)
  return (
    <div className='max-w-screen w-full'>
      <div className='flex items-center p-4 s:hidden border border-b'>
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
      <FormikProvider value={formik}>
        <div className='flex px-4 s:px-0'>
          <div className='mr-12 hidden m:flex w-full max-w-288px '>
            <SideNavigation
              categoryName={category.data.name}
              draft={state.draft}
              validationState={formState}
            />
          </div>
          <Form className='flex flex-col space-y-4 s:space-y-6 s:space-y-12 mt-3 mb-24 w-full'>
            <div className='s:hidden'>
              <FormProgressBar category={category.data} values={values} />
            </div>
            <FormGroup
              hide={!formStateDict?.TITLE_AND_DESCRIPTION.visible}
              validate={() =>
                validateTitle(
                  // @ts-ignore
                  values.content,
                  t,
                )
              }
              title={t('TITLE_AND_DESCRIPTION')}
              getCountMeta={() => {
                let filledCount = 0
                let isRequiredFilled
                const title = get(values, 'content[0].title')
                const description = get(values, 'content[0].description')
                if (title?.length > 2) {
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
              }
            />
            <FormGroup
              hide={!formStateDict?.PHOTO_AND_VIDEO.visible}
              title={t('PHOTO_AND_VIDEO')}
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
                validatePhoto(
                  // @ts-ignore
                  values.photos,
                  category.data.minPhotos,
                  t,
                )
              }
            />
            {fieldsArray.map((fieldArray, index) => {
              const {name, arrayTypeFields, id} = fieldArray
              return (
                <FormGroup
                  hide={!formStateDict?.[name].visible}
                  key={name}
                  title={name}
                  header={
                    <AdvertFormHeading
                      title={name}
                      ref={(ref) => {
                        headerRefs.current[3 + index + 1] = {
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
                          isRequired
                          labelClassName='mt-2'
                          label={t('PROD_CONDITION')}
                        />
                      )}
                      <FormikCreateFields
                        fieldsArray={arrayTypeFields}
                        id={id}
                      />
                    </div>
                  }
                  getCountMeta={() => {
                    const hasCondition = index === 0 && category.data.allowUsed
                    let filledCount = 0
                    let isRequiredFilled = true

                    if (values.condition) {
                      filledCount += 1
                    } else {
                      isRequiredFilled = false
                    }

                    arrayTypeFields.forEach(
                      ({id: fieldId, isFillingRequired}) => {
                        // @ts-ignore
                        if (get(values, `fields.${fieldId}`)) {
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
                />
              )
            })}
            <FormGroup
              hide={!formStateDict?.COST_AND_TERMS.visible}
              title={t('COST_AND_TERMS')}
              header={
                <AdvertFormHeading
                  title={t('COST_AND_TERMS')}
                  ref={(ref) => {
                    headerRefs.current[2] = {
                      ref,
                      title: t('COST_AND_TERMS'),
                    }
                  }}
                />
              }
              body={
                <div className='space-y-4'>
                  <AdvertFormField
                    body={
                      <div className='w-full s:w-1/3'>
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
                validatePrice(
                  // @ts-ignore
                  values.price,
                  category.data.allowFree,
                  t,
                )
              }
            />
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
                  onClick={() => {
                    if (currentStep) {
                      let errors: FormikErrors<any> = {}
                      formState.some((s) => {
                        if (!formStateDict[s.key].visible) return true
                        const validation = s.validate(values)
                        errors = {...errors, ...validation}

                        return s.key === currentStep.key
                      })
                      setErrors(errors)
                      if (hasErrors(errors)) {
                        toast.error(t('ADVERT_CREATING_HELP_ALERT'))
                      }
                      const newFormState = getFormStateDict(formState)
                      setFormStateDict(newFormState)
                      if (width >= 768) {
                        scrollToFirstError()
                      }
                    } else if (!isSubmitting) {
                      submitForm()
                    }
                  }}
                  className='w-full s:w-auto'>
                  {t(currentStep ? 'CONTINUE' : 'PUBLISH')}
                </PrimaryButton>
              </div>
            </div>
            <CategoryUpdater onChangeFields={onChangeFields} />
            {query.action === 'create' && (
              <FormikAdvertAutoSave onSubmit={onSubmit} />
            )}
          </Form>
        </div>
      </FormikProvider>
    </div>
  )
})

export default FormPage
