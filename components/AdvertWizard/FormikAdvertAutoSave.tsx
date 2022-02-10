import {FC, useCallback, useEffect} from 'react'
import {FormikValues, useFormikContext} from 'formik'
import {throttle} from 'lodash'

interface Props {
  onSubmit: (values: FormikValues, saveDraft: boolean) => void
}
const FormikAdvertAutoSave: FC<Props> = ({onSubmit}) => {
  const formik = useFormikContext()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSubmitCaller = useCallback(
    throttle(
      (ctx: typeof formik) => {
        onSubmit(ctx.values, true)
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
