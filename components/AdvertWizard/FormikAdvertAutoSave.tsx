import {FC, useCallback, useEffect} from 'react'
import {FormikHelpers, FormikValues, useFormikContext} from 'formik'
import {throttle} from 'lodash'

interface Props {
  onSubmit: ({
    values,
    saveDraft,
    helpers,
  }: {
    values: FormikValues
    helpers: FormikHelpers<any>
    saveDraft: boolean
  }) => void
}
const FormikAdvertAutoSave: FC<Props> = ({onSubmit}) => {
  const formik = useFormikContext()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSubmitCaller = useCallback(
    throttle(
      (ctx: typeof formik) => {
        onSubmit({values: ctx.values, saveDraft: true, helpers: ctx})
      },
      15000,
      {leading: false},
    ),
    [],
  )
  useEffect(() => {
    if (formik.dirty) {
      debouncedSubmitCaller(formik)
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSubmitCaller, formik.dirty, formik.values])

  return null
}

export default FormikAdvertAutoSave
