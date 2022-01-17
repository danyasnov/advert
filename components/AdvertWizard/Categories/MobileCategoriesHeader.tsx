import {Dispatch, FC, SetStateAction} from 'react'
import {isEmpty, last} from 'lodash'
import {CACategoryModel} from 'front-api'
import {useTranslation} from 'next-i18next'
import IcArrowBack from 'icons/material/ArrowBack.svg'
import Button from '../../Buttons/Button'

interface Props {
  selected: CACategoryModel[]
  setSelected: Dispatch<SetStateAction<CACategoryModel[]>>
  onBackToMap: () => void
}
const MobileCategoriesHeader: FC<Props> = ({
  selected,
  setSelected,
  onBackToMap,
}) => {
  const {t} = useTranslation()
  return (
    <div className='flex flex-col'>
      <div className='flex items-center p-4'>
        <Button
          onClick={() => {
            if (isEmpty(selected)) {
              onBackToMap()
            } else {
              setSelected(selected.slice(0, -1))
            }
          }}>
          <IcArrowBack className='w-6 h-6 fill-current text-nc-icon mr-4' />
        </Button>
        <h2 className='text-nc-title font-medium text-h-2'>
          {isEmpty(selected) ? t('NEW_AD') : last(selected).name}
        </h2>
      </div>
    </div>
  )
}

export default MobileCategoriesHeader
