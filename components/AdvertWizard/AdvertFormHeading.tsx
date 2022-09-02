import {forwardRef} from 'react'

interface Props {
  title: string
}
const AdvertFormHeading = forwardRef<HTMLElement, Props>(({title}, ref) => {
  return (
    // @ts-ignore
    <p ref={ref} className='text-greyscale-900 text-h-5 font-bold'>
      {title}
    </p>
  )
})

export default AdvertFormHeading
