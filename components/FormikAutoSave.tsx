import {FC, useCallback, useEffect} from 'react'
import {useFormikContext} from 'formik'
import debounce from 'lodash.debounce'

const FormikAutoSave: FC = () => {
  const formik = useFormikContext()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSubmitCaller = useCallback(
    debounce((ctx: typeof formik) => {
      ctx.submitForm()
    }, 500),
    [],
  )
  useEffect(() => {
    if (formik.dirty) {
      formik.validateForm(formik.values).then((err) => {
        if (Object.keys(err).length === 0) debouncedSubmitCaller(formik)
      })
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSubmitCaller, formik.dirty, formik.values])

  return null
}

export default FormikAutoSave
