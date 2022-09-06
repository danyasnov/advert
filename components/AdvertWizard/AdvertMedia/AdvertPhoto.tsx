import {ComponentClass} from 'react'
import {SortableElement, SortableElementProps} from 'react-sortable-hoc'
import IcClose from 'icons/material/Close.svg'
import IcRotate from 'icons/material/Rotate.svg'
import CircularProgress from 'react-cssfx-loading/lib/CircularProgress'
import Button from '../../Buttons/Button'
import ImageWrapper from '../../ImageWrapper'

const AdvertPhoto: ComponentClass<
  {
    url: string
    id: number
    loading: boolean
    onRotate: (size: {naturalWidth: number; naturalHeight: number}) => void
    onRemove: () => void
  } & SortableElementProps
> = SortableElement(({onRemove, onRotate, url, loading, id}) => {
  const buttonClassname =
    'w-6 h-6 flex items-center justify-center absolute top-0 mt-2 z-10 rounded-full text-greyscale-900'
  const iconClassname = 'h-3.5 w-3.5 fill-current'
  return (
    <div className='h-[140px] w-[224px] flex rounded-3xl overflow-hidden relative cursor-pointer'>
      {loading && (
        <div className='absolute z-10 inset-0 flex justify-center items-center  '>
          <CircularProgress
            color='#7210FF'
            width='20px'
            height='20px'
            duration='3s'
          />
        </div>
      )}
      <Button
        className={`${buttonClassname} right-0 mr-2`}
        onClick={onRemove}
        disabled={loading}>
        <IcClose className={iconClassname} />
      </Button>
      <Button
        disabled={loading}
        className={`${buttonClassname} left-0 ml-2`}
        onClick={() => onRotate(id)}>
        <IcRotate className={iconClassname} />
      </Button>
      <div className='h-34 w-34 relative'>
        <ImageWrapper
          type={url}
          alt={url}
          objectFit='cover'
          layout='fill'
          id={id}
          key={url}
        />
      </div>
    </div>
  )
})

export default AdvertPhoto
