import {
  ComponentClass,
  Dispatch,
  SetStateAction,
  useCallback,
  useRef,
  useState,
} from 'react'
import {SortableContainer, SortableContainerProps} from 'react-sortable-hoc'
import {random} from 'lodash'
import {AxiosRequestConfig} from 'axios'
import useDropListener from '../../../hooks/useDropListener'
import {rotate} from '../../../utils'
import AdvertUploadButton from './AdvertUploadButton'
import DropZone from './DropZone'
import AdvertPhoto from './AdvertPhoto'
import {PhotoFile} from '../../../types'
import {makeRequest} from '../../../api'

const getNextDegree = (current) => {
  const next = current + 90
  if (next > 270) return 0
  return next
}

const AdvertPhotosContainer: ComponentClass<
  {
    maxPhotos: number
    photos: PhotoFile[]
    error: boolean
    setPhotos: Dispatch<SetStateAction<PhotoFile[]>>
  } & SortableContainerProps
> = SortableContainer(({maxPhotos, photos, setPhotos, error}) => {
  const [isDragging, setIsDragging] = useState(false)
  const canAddMore = maxPhotos > photos.length

  const originalPhotos = useRef({})
  useDropListener({
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
  })

  const onDrop = useCallback(
    (acceptedFiles) => {
      const maxAcceptedFiles = maxPhotos - photos.length
      const slicedAcceptedFiles = acceptedFiles.slice(0, maxAcceptedFiles)
      slicedAcceptedFiles.forEach(async (f) => {
        const promise = new Promise((resolve) => {
          const image = new Image()
          image.onload = () => {
            // eslint-disable-next-line no-param-reassign
            f.width = image.width
            // eslint-disable-next-line no-param-reassign
            f.height = image.height
            resolve(f)
          }
          image.src = URL.createObjectURL(f)
        })
        await promise
        const id = random(99999).toString()

        originalPhotos.current[id] = {file: f, degree: 0}

        const formData = new FormData()
        formData.append('image', f)
        const url = URL.createObjectURL(f)
        setPhotos((prevPhotos) => [
          ...prevPhotos,
          Object.assign(f, {
            url,
            hash: id,
            id,
            loading: true,
          }),
        ])

        const config: AxiosRequestConfig = {
          headers: {'Content-Type': 'multipart/form-data'},
          method: 'post',
          data: formData,
          url: '/api/upload/image',
        }
        makeRequest(config, {
          retries: 2,
          retryDelay: () => 2000,
        }).then((res) => {
          setPhotos((prevPhotos) =>
            prevPhotos.map((p) => {
              if (p.hash === id) {
                return {...res.data.items[0], id}
              }
              return p
            }),
          )
        })
      })
    },
    [photos],
  )

  return (
    <div className='mb-4 w-full relative'>
      <div
        className={`${
          isDragging && canAddMore ? 'absolute inset-0 min-h-full' : 'hidden'
        }`}>
        <DropZone
          onDrop={onDrop}
          disabled={!canAddMore}
          maxFiles={maxPhotos}
          type='photo'
        />
      </div>
      <div
        className={`flex flex-wrap gap-2 ${
          isDragging && canAddMore ? 'invisible' : ''
        }`}>
        {photos.map((p, index) => (
          <AdvertPhoto
            id={p.id}
            loading={p.loading}
            url={p.url}
            index={index}
            key={p.hash}
            onRemove={() => {
              setPhotos(photos.filter((v) => v.hash !== p.hash))
            }}
            onRotate={async () => {
              const dict = originalPhotos.current
              if (dict[p.id]?.file) {
                const nextDegrees = getNextDegree(dict[p.id].degree)
                const blob = await rotate({
                  degrees: nextDegrees,
                  file: dict[p.id].file,
                })
                if (!blob) return
                const formData = new FormData()
                formData.append('image', blob)
                setPhotos((prevState) =>
                  prevState.map((v) =>
                    v.hash === p.hash ? {...v, loading: true} : v,
                  ),
                )
                makeRequest({
                  headers: {'Content-Type': 'multipart/form-data'},
                  method: 'post',
                  data: formData,
                  url: '/api/upload/image',
                }).then((res) => {
                  dict[p.id].degree = nextDegrees
                  setPhotos(
                    photos.map((v) => {
                      if (v.hash === p.hash) {
                        return {...res.data.items[0], id: p.id}
                      }
                      return v
                    }),
                  )
                })
              }
            }}
          />
        ))}
        {canAddMore && (
          <AdvertUploadButton
            onDrop={onDrop}
            disabled={!canAddMore}
            maxFiles={maxPhotos}
            type='photo'
            error={error}
          />
        )}
      </div>
    </div>
  )
})

export default AdvertPhotosContainer
