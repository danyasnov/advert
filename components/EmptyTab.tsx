import {FC} from 'react'
import {useTranslation} from 'next-i18next'
import ImageWrapper from './ImageWrapper'

interface Props {
  description: string
  img: string
}

const EmptyTab: FC<Props> = ({description, img}) => {
  const {t} = useTranslation()

  return (
    <div className='my-4 s:my-8 flex flex-col justify-center max-w-[600px]'>
      <div className='flex justify-center mb-8'>
        <ImageWrapper
          type={img}
          alt='empty page'
          quality={100}
          width={140}
          height={140}
        />
      </div>
      <span
        className='text-body-16 text-greyscale-900 text-center whitespace-pre-wrap'
        dangerouslySetInnerHTML={{
          __html: t(description),
        }}
      />
    </div>
  )
}

export default EmptyTab
