import {FC} from 'react'
import ReactModal from 'react-modal'
import {useLockBodyScroll} from 'react-use'
import IcClear from 'icons/material/Clear.svg'
import Button from '../Buttons/Button'

interface Props {
  src: string
  isOpen: boolean
  onClose: () => void
}

const VideoModal: FC<Props> = ({src, isOpen, onClose}) => {
  // useLockBodyScroll()

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      shouldCloseOnOverlayClick
      ariaHideApp={false}
      className='absolute h-full s:h-auto inset-x-0 mx-auto s:inset-x-8 m:inset-x-12 l:inset-x-24 s:top-14 m:top-20 l:top-14 flex outline-none flex flex-col'
      overlayClassName='fixed inset-0 bg-shadow-overlay max-h-screen overflow-y-auto z-30'>
      <Button
        onClick={onClose}
        className='absolute top-14 s:top-5 right-5 cursor-pointer z-10'>
        <IcClear className='fill-current text-greyscale-400 h-5 w-5 s:h-8 s:w-8' />
      </Button>
      <div className='flex flex-col w-full flex-1 overflow-hidden bg-black s:bg-white s:rounded-3xl'>
        <div className='overflow-hidden h-full s:h-auto relative s:mx-16'>
          <div className='flex h-full s:h-[364px] m:h-[504px] l:h-[746px]'>
            <video
              src={src}
              // eslint-disable-next-line react/no-array-index-key
              controls
              disablePictureInPicture
              muted
              autoPlay
              controlsList='nodownload noremoteplayback noplaybackrate'
              className='min-w-full h-full s:px-16'
            />
          </div>
        </div>
      </div>
    </ReactModal>
  )
}

export default VideoModal
