import {FC, ReactNode} from 'react'

interface Props {
  title: string
  rightContent?: ReactNode
}

const TitleWithSeparator: FC<Props> = ({title, rightContent}) => {
  return (
    <div className='mx-4 s:mx-8 m:mx-0 text-greyscale-900 text-h-4 mb-8 flex justify-between items-center'>
      <span className='font-bold'>{title}</span>
      {rightContent}
    </div>
  )
}
export default TitleWithSeparator
