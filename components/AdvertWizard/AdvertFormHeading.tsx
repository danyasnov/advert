import {FC} from 'react'

interface Props {
  title: string
}
const AdvertFormHeading: FC<Props> = ({title}) => {
  return <p className='text-nc-title text-h-2 font-medium mb-6'>{title}</p>
}

export default AdvertFormHeading
