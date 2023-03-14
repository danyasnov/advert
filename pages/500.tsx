import Error from 'next/error'

export default function Custom500() {
  return (
    <Error
      statusCode={500}
      title='An unexpected error has occurred. We are working to fix it. Please try again later.'
    />
  )
}
