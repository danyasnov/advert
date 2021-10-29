import {FC, useCallback, useEffect, useState} from 'react'
import {FieldProps} from 'formik'
import {instanceOf} from 'prop-types'
import {swap} from '../../../utils'
import AdvertPhotosContainer from './AdvertPhotosContainer'
import {PhotoFile} from '../../../types'

const AdvertPhotos: FC<
  {
    maxPhotos: number
  } & FieldProps
> = ({maxPhotos, field, form}) => {
  const {name} = field
  const {setFieldValue} = form
  const [photos, setPhotos] = useState<PhotoFile[]>([])
  const onSortEnd = useCallback(
    ({oldIndex, newIndex}) => {
      setPhotos(swap(photos, oldIndex, newIndex))
    },
    [photos],
  )
  useEffect(() => {
    if (!photos.some((p) => p instanceof File)) {
      setFieldValue(name, photos)
    }
  }, [photos])
  return (
    <AdvertPhotosContainer
      distance={1}
      onSortEnd={onSortEnd}
      axis='xy'
      maxPhotos={maxPhotos}
      photos={photos}
      setPhotos={setPhotos}
    />
  )
}

export default AdvertPhotos
