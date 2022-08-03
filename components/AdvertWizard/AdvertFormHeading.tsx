import {forwardRef} from 'react'

interface Props {
  title: string
}
const AdvertFormHeading = forwardRef<HTMLElement, Props>(({title}, ref) => {
  return (
    // @ts-ignore
    <p ref={ref} className='text-nc-title text-body-14 font-medium'>
      {title}
    </p>
  )
})

export default AdvertFormHeading
