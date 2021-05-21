import {FC} from 'react'

interface Props {
  title: string
}

const TitleWithSeparator: FC<Props> = ({title}) => {
  return (
    <div className='mx-4 s:mx-8 m:mx-0 text-black-b text-h-2 pb-4 mb-6 border-b border-shadow-b'>
      {title}
    </div>
  )
}
export default TitleWithSeparator
