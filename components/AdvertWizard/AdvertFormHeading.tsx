import {forwardRef} from 'react'

interface Props {
  title: string
}
const AdvertFormHeading = forwardRef<HTMLElement, Props>(({title}, ref) => {
  return (
    // @ts-ignore
    <p ref={ref} className='text-nc-title text-h-2 font-medium mb-6'>
      {title}
    </p>
  )
})

export default AdvertFormHeading
