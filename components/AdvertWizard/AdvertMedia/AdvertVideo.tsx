import {FC} from 'react'
import IcClose from 'icons/material/Close.svg'
import CircularProgress from 'react-cssfx-loading/lib/CircularProgress'
import Button from '../../Buttons/Button'

const AdvertVideo: FC<{
  url: string
  loading: boolean
  onRemove: () => void
}> = ({onRemove, url, loading}) => {
  return (
    <div className='h-[140px] w-[224px] flex rounded-lg overflow-hidden relative cursor-pointer relative'>
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
        className='w-6 h-6 flex items-center justify-center absolute top-0 mt-2 z-10 rounded-full text-greyscale-900 right-0 mr-2'
        onClick={onRemove}
        disabled={loading}>
        <IcClose className='h-3.5 w-3.5 fill-current' />
      </Button>

      <div className='h-40 w-72 relative'>
        <video
          src={url}
          controls
          disablePictureInPicture
          muted
          controlsList='nodownload noremoteplayback noplaybackrate'
          className='min-w-full h-full'
        />
      </div>
    </div>
  )
}

export default AdvertVideo
