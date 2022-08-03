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
import {debounce, first, get, isEqual, size, isEmpty} from 'lodash'
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
  validateCommunication,
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
import AddNumberModal from '../Auth/AddNumber/AddNumberModal'

const FormPage: FC = observer(() => {
  const {state, dispatch} = useContext(WizardContext)
  const {push, query} = useRouter()
  const hash = first(query.hash)

  const {width} = useWindowSize()

  const {languagesByIsoCode, user} = useGeneralStore()
  const [showAddNumber, setShowAddNumber] = useState(false)
  const phoneNumber = user?.settings.personal.phoneNum

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

  // @ts-ignore
  const {categoryId, breadcrumbs} = state.draft
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
        )
          .then((res) => {
            setCategoryData(mapCategoryData(res.data.result))
          })
          .catch((e) => {
            if (!e.response) {
              toast.error('CHECK_CONNECTION_ERROR')
            }
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
    const communicationError = validateCommunication(phoneNumber, t)
    const result = {
      ...errors,
      ...titleError,
      ...photoError,
      ...priceError,
      ...conditionError,
      ...communicationError,
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
          name: t('PRODUCT_FEATURES'),
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
      required: true,
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
    {
      key: 'WAYS_COMMUNICATION',
      validate: () => validateCommunication(phoneNumber, t),
      required: true,
      filled: !!phoneNumber,
    },
    ...(isEmpty(fieldsArray[0]?.arrayTypeFields) && !category.data.allowUsed
      ? []
      : fieldsArray.map((fieldArray, index) => {
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
            required: arrayTypeFields.some((f) =>
              f.isFillingRequired || index === 0
                ? category.data.allowUsed
                : false,
            ),
            filled: arrayTypeFields.some((f) => values.fields[f.id]),
          }
        })),
    {
      key: 'COST_AND_TERMS',
      validate: (val) =>
        validatePrice(
          // @ts-ignore
          val.price,
          category.data.allowFree,
          t,
        ),
      required: !category.data.allowFree,
      filled: !!values.price,
    },
  ]
  const getFormState = (showAll?) => {
    let hasPending = false
    return formItems.map((s) => {
      const validation = s.validate(values, true)
      const validationState = validation
      let status
      if (s.required) {
        status = hasErrors(validation) ? 'pending' : 'done'
      } else {
        status = s.filled ? 'done' : 'pending'
      }

      let visible

      if (showAll || width < 1024) {
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
  // const showWholeForm = !hasArrayType || query.action === 'edit'
  const showWholeForm = !hasArrayType

  const [formStateDict, setFormStateDict] = useState<Record<string, NavItem>>(
    () => {
      return getFormStateDict(getFormState(showWholeForm))
    },
  )

  const conditionComponent = (
    <div
      className={`w-full s:w-1/2  ${hasArrayType ? 'l:w-full' : 'l:w-5/12'}`}>
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
        <h2 className='text-nc-title font-medium text-body-14'>
          {category.data.name}
        </h2>
      </div>
      <FormikProvider value={formik}>
        <div className='flex px-4 s:px-0'>
          <div className='mr-8 hidden m:flex w-full max-w-[280px] shrink-0 sticky mt-8 top-8 h-full'>
            <SideNavigation
              categoryName={breadcrumbs || category.data.name}
              draft={state.draft}
              validationState={formState}
            />
          </div>
          <Form
            className={`flex flex-col space-y-4 w-full ${
              showWholeForm ? 's:space-y-8' : 's:space-y-6'
            }`}>
            <div className={`${showWholeForm ? 'hidden' : 's:hidden'} mt-8`}>
              <FormProgressBar category={category.data} values={values} />
            </div>
            <FormGroup
              id='form-group-title-and-description'
              hide={!formStateDict?.TITLE_AND_DESCRIPTION.visible}
              validate={() =>
                validateTitle(
                  // @ts-ignore
                  values.content,
                  t,
                )
              }
              showWholeForm={showWholeForm}
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
                <AdvertFormHeading title={t('ENTER_TITLE_AND_DESCRIPTION')} />
              }
              body={
                <AdvertFormField
                  id='form-field-content'
                  orientation={
                    width >= 1440 && !hasArrayType ? 'horizontal' : 'vertical'
                  }
                  body={
                    <Field
                      className={`${
                        hasArrayType
                          ? 's:max-w-full m:max-w-[582px] l:max-w-[592px]'
                          : 's:max-w-[656px] l:mt-9'
                      }`}
                      name='content'
                      maxDescriptionLength={category.data.descriptionLengthMax}
                      component={AdvertDescription}
                      user={user}
                      languagesByIsoCode={languagesByIsoCode}
                    />
                  }
                  labelDescription={t('TIP_DESCRIPTION_CREATE_ADV')}
                  label={t('TITLE_AND_DESCRIPTION')}
                  labelClassName='mt-2 text-nc-title'
                  isRequired
                />
              }
            />
            <FormGroup
              id='form-group-photo-and-video'
              hide={!formStateDict?.PHOTO_AND_VIDEO.visible}
              title={t('PHOTO_AND_VIDEO')}
              showWholeForm={showWholeForm}
              header={<AdvertFormHeading title={t('UPLOAD_PHOTO_AND_VIDEO')} />}
              body={
                <div>
                  <AdvertFormField
                    id='form-field-photos'
                    labelClassName='text-nc-title mt-2 l:mt-0'
                    orientation={
                      width >= 1440 && !hasArrayType ? 'horizontal' : 'vertical'
                    }
                    body={
                      <div className='w-full'>
                        <Field
                          component={AdvertPhotos}
                          name='photos'
                          maxPhotos={category.data.maxPhotos}
                        />
                        <p className='text-body-12 text-nc-secondary-text mb-6 mt-2'>
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
                    orientation={
                      width >= 1440 && !hasArrayType ? 'horizontal' : 'vertical'
                    }
                    id='form-field-videos'
                    labelClassName='text-nc-title'
                    body={
                      <div className='w-8/12 l:mt-7'>
                        <Field
                          component={AdvertVideos}
                          name='videos'
                          categoryId={category.data.id}
                          maxVideoDuration={category.data.maxVideoDuration}
                        />
                        <p className='text-body-12 text-nc-secondary-text mb-6 mt-2 whitespace-pre-wrap'>
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
              const {name, arrayTypeFields, id, fieldType} = fieldArray
              if (isEmpty(arrayTypeFields) && !category.data.allowUsed) {
                return null
              }
              return (
                <FormGroup
                  id='form-group-fields'
                  hide={!formStateDict?.[name].visible}
                  key={name}
                  title={name}
                  showWholeForm={showWholeForm}
                  header={<AdvertFormHeading title={name} />}
                  body={
                    <div className='space-y-4'>
                      {category.data.allowUsed && index === 0 && (
                        <AdvertFormField
                          orientation={width >= 768 ? 'horizontal' : 'vertical'}
                          id='form-field-condition'
                          body={conditionComponent}
                          isRequired
                          labelClassName='mt-2 text-nc-secondary-text'
                          label={t('PROD_CONDITION')}
                        />
                      )}
                      <FormikCreateFields
                        fieldsArray={arrayTypeFields}
                        id={id}
                        hasArrayType={fieldType === 'array'}
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
              id='form-group-cost-and-terms'
              hide={!formStateDict?.COST_AND_TERMS.visible}
              title={t('COST_AND_TERMS')}
              showWholeForm={showWholeForm}
              header={<AdvertFormHeading title={t('COST_AND_TERMS')} />}
              body={
                <div className='space-y-4'>
                  <AdvertFormField
                    orientation={width >= 768 ? 'horizontal' : 'vertical'}
                    id='form-field-price'
                    body={
                      <div
                        className={`w-full s:w-1/3 ${
                          hasArrayType ? 'l:w-full' : ''
                        }`}>
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
                    labelClassName='mt-2 text-nc-secondary-text'
                  />
                  {!!category.data.isProduct && (
                    <>
                      <AdvertFormField
                        orientation={width >= 768 ? 'horizontal' : 'vertical'}
                        id='form-field-is-swap-possible'
                        labelClassName='text-nc-secondary-text'
                        body={
                          <div className='w-full s:w-4/12'>
                            <Field
                              name='isSwapPossible'
                              component={FormikSwitch}
                              label={width < 768 ? t('EXCHANGE') : undefined}
                            />
                          </div>
                        }
                        labelTip={t('POSSIBLE_EXCHANGE_TIP')}
                        label={width < 768 ? undefined : t('EXCHANGE')}
                      />
                      <AdvertFormField
                        orientation={width >= 768 ? 'horizontal' : 'vertical'}
                        id='form-field-is-bargain-possible'
                        labelClassName='text-nc-secondary-text'
                        body={
                          <div className='w-full s:w-4/12'>
                            <Field
                              name='isBargainPossible'
                              component={FormikSwitch}
                              label={width < 768 ? t('BARGAIN') : undefined}
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
            <FormGroup
              id='form-group-ways-communication'
              hide={!formStateDict?.WAYS_COMMUNICATION.visible}
              title={t('WAYS_COMMUNICATION')}
              showWholeForm={showWholeForm}
              header={<AdvertFormHeading title={t('WAYS_COMMUNICATION')} />}
              body={
                <div className='space-y-4'>
                  <AdvertFormField
                    orientation={width >= 768 ? 'horizontal' : 'vertical'}
                    id='form-field-phone-number'
                    body={
                      <div
                        className={`w-full s:w-1/3 ${
                          hasArrayType ? 'l:w-full' : ''
                        }`}>
                        <Button
                          onClick={() => {
                            setShowAddNumber(true)
                          }}
                          disabled={!!phoneNumber}
                          className={`w-full text-body-16 px-4 py-2.5 border border-nc-border rounded-lg h-10 ${
                            phoneNumber
                              ? 'text-nc-disabled bg-nc-back'
                              : 'text-nc-primary-text'
                          }`}>
                          <span>{phoneNumber ? `+${phoneNumber}` : ''}</span>
                        </Button>
                      </div>
                    }
                    isRequired={!category.data.allowFree}
                    label={t('PHONE_NUM')}
                    // labelTip={t('PRICE_TIP')}
                    labelClassName='mt-2 text-nc-secondary-text'
                  />
                </div>
              }
              getCountMeta={() => ({
                isRequiredFilled: false,
                filledCount: 0,
                maxFilled: 1,
              })}
              validate={() => validateCommunication(phoneNumber, t)}
            />
            <div className='fixed inset-x-0 bottom-0 flex justify-between bg-white shadow-2xl px-8 m:px-10 l:px-29 py-2.5 z-10 justify-around'>
              <div className='w-full l:w-1208px flex justify-between'>
                <OutlineButton
                  id='ad-back-button'
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
                  id='ad-publish-button'
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
                    } else if (!isSubmitting) {
                      submitForm()
                    }
                    scrollToFirstError()
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
            <AddNumberModal
              onFinish={() => {}}
              isOpen={showAddNumber}
              onClose={() => setShowAddNumber(false)}
            />
          </Form>
        </div>
      </FormikProvider>
    </div>
  )
})

export default FormPage
