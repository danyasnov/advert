import {FC, useCallback, useState} from 'react'
import useDropListener from '../../../hooks/useDropListener'
import {makeRequest} from '../../../api'
import DropZone from './DropZone'
import AdvertUploadButton from './AdvertUploadButton'
import AdvertVideo from './AdvertVideo'
import {VideoFile} from '../../../types'

const AdvertVideos: FC = () => {
  const [video, setVideo] = useState<VideoFile>()
  const [isDragging, setIsDragging] = useState(false)

  useDropListener({
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
  })

  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0]
      const formData = new FormData()
      formData.append('video', file)
      setVideo({...file, loading: true})
      makeRequest({
        headers: {'Content-Type': 'multipart/form-data'},
        method: 'post',
        data: formData,
        url: '/api/upload/video',
      }).then((res) => {
        setVideo(res.data.items[0])
      })
    },
    [video],
  )
  return (
    <div className='mb-4 w-full relative'>
      <div
        className={`${
          isDragging && !video ? 'absolute inset-0 min-h-full' : 'hidden'
        }`}>
        <DropZone onDrop={onDrop} disabled={!!video} type='video' />
      </div>
      <div
        className={`flex flex-wrap gap-2 ${
          isDragging && !video ? 'invisible' : ''
        }`}>
        {video && (
          <AdvertVideo
            loading={video.loading}
            url={video.url}
            onRemove={() => {
              setVideo(null)
            }}
          />
        )}

        {!video && (
          <AdvertUploadButton onDrop={onDrop} disabled={!!video} type='video' />
        )}
      </div>
    </div>
  )
}

export default AdvertVideos
