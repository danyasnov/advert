import {Dispatch, FC, SetStateAction} from 'react'
import {CACategoryModel} from 'front-api/src/index'
import {isEmpty, last} from 'lodash'
import IcKeyboardArrowRight from 'icons/material/KeyboardArrowRight.svg'
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
      className='h-12 items-center w-full px-4'>
      <div className='flex justify-between w-full items-center'>
        <div className='flex items-center'>
          {!!url && (
            <div className='mr-2 flex items-center'>
              <ImageWrapper type={url} width={24} height={24} alt='slug' />
            </div>
          )}
          <span className='text-body-1 text-nc-primary-text'>
            {category.name}
          </span>
        </div>
        {!isEmpty(category.items) && (
          <IcKeyboardArrowRight className='fill-current text-nc-icon h-8 w-8' />
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
  if (isEmpty(selected)) {
    return (
      <div className='divide-y divide-solid'>
        {categories.map((c) => (
          <CategoryButton
            category={c}
            onClick={(category) => setSelected([category])}
          />
        ))}
      </div>
    )
  }
  return (
    <>
      <div className='divide-y divide-solid'>
        {last(selected).items.map((c) => (
          <CategoryButton
            category={c}
            onClick={(category) => {
              if (isEmpty(category.items)) {
                onSubmit(category.id)
              } else {
                setSelected([...selected, category])
              }
            }}
          />
        ))}
      </div>
    </>
  )
}

export default CategoriesMobile
