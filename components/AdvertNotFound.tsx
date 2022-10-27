import {FC} from 'react'
import {useTranslation} from 'next-i18next'
import ImageWrapper from './ImageWrapper'

export const Placeholder: FC = () => {
  return (
    <div className='min-w-40 s:w-56 m:w-48 l:w-53 border border-shadow-b rounded-lg overflow-hidden'>
      <div className='h-40 s:h-56 m:h-48 l:h-53 bg-shadow-b' />
      <div className='bg-white flex flex-col p-3 space-y-4'>
        <div className='bg-shadow-b h-5 w-1/2 rounded' />
        <div className='bg-shadow-b h-5 w-5/6 rounded' />
        <div className='bg-shadow-b h-5 w-2/3 rounded' />
      </div>
    </div>
  )
}

const AdvertNotFound: FC = () => {
  return (
    <div className='my-4 s:my-8 flex flex-col justify-center'>
      <div className='space-x-4 s:space-x-8 flex justify-center mb-12'>
        <Placeholder />
        <Placeholder />
      </div>
    </div>
  )
}

const AdvertNotFoundWithDescription: FC = () => {
  const {t} = useTranslation()

  return (
    <div className='my-4 s:my-8 flex flex-col justify-center max-w-[600px]'>
      <div className='flex justify-center mb-8'>
        <ImageWrapper
          type='/img/NothingFound.png'
          alt='nothing found'
          quality={100}
          width={200}
          height={200}
        />
      </div>
      <h2 className='text-h-5 text-greyscale-900 font-bold flex justify-center mb-3'>
        {t('NOTHING_FIND')}
      </h2>
      <span className='text-body-16 text-greyscale-900 text-center'>
        {t('NOTHING_FIND_TEXT')}
      </span>
    </div>
  )
}

export {AdvertNotFound, AdvertNotFoundWithDescription}
