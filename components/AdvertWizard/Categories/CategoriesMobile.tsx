import {Dispatch, FC, SetStateAction} from 'react'
import {CACategoryModel} from 'front-api/src/index'
import {isEmpty, last} from 'lodash'
import IcKeyboardArrowRight from 'icons/material/KeyboardArrowRight.svg'
import {ArrowRight} from 'react-iconly'
import IcArrowDown from 'icons/material/ArrowDown.svg'
import Button from '../../Buttons/Button'
import ImageWrapper from '../../ImageWrapper'

const CategoryButton: FC<{
  category: CACategoryModel
  onClick: (category: CACategoryModel) => void
}> = ({category, onClick}) => {
  const url = category.icon?.icon?.url

  return (
    <Button
      key={category.id}
      onClick={() => onClick(category)}
      className='items-center w-full py-4'>
      <div className='flex justify-between w-full items-center text-greyscale-900'>
        <div className='flex items-center'>
          {!!url && (
            <div className='mr-2 flex items-center'>
              <ImageWrapper type={url} width={24} height={24} alt='slug' />
            </div>
          )}
          <span className='text-body-16'>{category.name}</span>
        </div>
        {!isEmpty(category.items) && !!category.parentId && (
          <IcArrowDown className='fill-current text-greyscale-800 h-6 w-6 -rotate-90 ' />
        )}
      </div>
    </Button>
  )
}

interface Props {
  selected: CACategoryModel[]
  setSelected: Dispatch<SetStateAction<CACategoryModel[]>>
  categories: CACategoryModel[]
  onSubmit: (id: number) => void
}
const CategoriesMobile: FC<Props> = ({
  selected,
  setSelected,
  categories,
  onSubmit,
}) => {
  const source = isEmpty(selected) ? categories : last(selected).items
  return (
    <div className='divide-y divide-solid divide-greyscale-200 px-4'>
      {source.map((c) => (
        <CategoryButton
          category={c}
          onClick={(category) => {
            if (isEmpty(selected)) {
              setSelected([category])
            } else if (isEmpty(category.items)) {
              onSubmit(category.id)
            } else {
              setSelected([...selected, category])
            }
          }}
        />
      ))}
    </div>
  )
}

export default CategoriesMobile
