import {FC, ReactNode} from 'react'

interface Props {
  title: string
  rightContent?: ReactNode
}

const TitleWithSeparator: FC<Props> = ({title, rightContent}) => {
  return (
    <div className='mx-4 s:mx-8 m:mx-0 text-black-b text-h-2 pb-4 mb-6 border-b border-shadow-b flex justify-between items-center'>
      {title}
      {rightContent}
    </div>
  )
}
export default TitleWithSeparator
