import {Dispatch, FC, SetStateAction, useState} from 'react'
import {CACategoryModel} from 'front-api/src/index'
import {isEmpty, size} from 'lodash'
import Button from '../../Buttons/Button'
import ImageWrapper from '../../ImageWrapper'
import {useGeneralStore} from '../../../providers/RootStoreProvider'
import {handleMetrics} from '../../../helpers'

interface Props {
  selected: CACategoryModel[]
  setSelected: Dispatch<SetStateAction<CACategoryModel[]>>
  categories: CACategoryModel[]
}

const CategoriesDesktop: FC<Props> = ({selected, setSelected, categories}) => {
  const [clickedItem, setClickedItem] = useState(null)
  const {user} = useGeneralStore()
  return (
    <div className='flex mb-15'>
      <div
        className={`flex flex-col ${
          // eslint-disable-next-line no-extra-boolean-cast
          !!clickedItem ? 'border-r border-greyscale-100' : ''
        } `}>
        {categories.map((c, index) => (
          <Button
            key={c.id}
            id={`category-item-${c.id}`}
            className={`min-h-10 hover:text-primary-500 rounded-lg py-2 px-4 ${
              clickedItem === index ? 'text-primary-500' : 'text-greyscale-900'
            }`}
            onClick={() => {
              setSelected([c])
              setClickedItem(index)
              handleMetrics('addAdvt_subCategory', {
                categoryId: c.id,
                userHash: user?.hash,
              })
            }}>
            <span className={`text-body-14 font-normal w-full text-left `}>
              {c.name}
            </span>
          </Button>
        ))}
      </div>
      <div className='grid grid-cols-3 m:grid-cols-5 w-full divide-x divide-greyscale-100'>
        {selected.map(
          (parentCategory, index) =>
            !isEmpty(parentCategory.items) && (
              <div
                className='flex flex-col'
                data-test-id={`parent-category-${parentCategory.id}`}
                key={parentCategory.id}>
                {parentCategory.items.map((c) => (
                  <Button
                    key={c.id}
                    id={`parent-category-item-${c.id}`}
                    className={`min-h-10 hover:text-primary-500 rounded-lg py-2 px-4 ${
                      selected[index + 1]?.id === c.id
                        ? 'text-primary-500'
                        : 'text-greyscale-900'
                    }`}
                    onClick={() => {
                      if (selected.length - 1 === index) {
                        setSelected([...selected, c])
                      } else {
                        setSelected([...selected.slice(0, index + 1), c])
                      }
                      handleMetrics('addAdvt_subCategory', {
                        categoryId: parentCategory.id,
                        subcategoryId: c.id,
                        userHash: user.user?.hash,
                      })
                    }}>
                    <span className='text-body-14 font-normal w-full text-left'>
                      {c.name}
                    </span>
                  </Button>
                ))}
              </div>
            ),
        )}
      </div>
    </div>
  )
}

export default CategoriesDesktop
