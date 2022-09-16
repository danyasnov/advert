import {Dispatch, FC, SetStateAction} from 'react'
import {CACategoryModel} from 'front-api/src/index'
import {isEmpty, size} from 'lodash'
import Button from '../../Buttons/Button'
import ImageWrapper from '../../ImageWrapper'

interface Props {
  selected: CACategoryModel[]
  setSelected: Dispatch<SetStateAction<CACategoryModel[]>>
  categories: CACategoryModel[]
}
const CategoriesDesktop: FC<Props> = ({selected, setSelected, categories}) => {
  if (isEmpty(selected)) {
    return (
      <div
        className='grid grid-cols-4 m:grid-cols-6 gap-x-4 gap-y-8 justify-between m:justify-start items-start'
        data-test-id='category-list'>
        {categories.map((c) => (
          <Button
            key={c.id}
            id={`category-item-${c.id}`}
            className='flex flex-col space-y-3 l:space-y-4'
            onClick={() => {
              setSelected([c])
            }}>
            <div className=' w-36 h-36 l:w-[188px] l:h-[188px] relative'>
              <ImageWrapper
                type={`/img/categories/${c.slug}.png`}
                alt={c.name}
                className='rounded-xl'
                layout='fill'
              />
            </div>
            <span className='text-greyscale-900 text-body-16 font-medium'>
              {c.name}
            </span>
          </Button>
        ))}
      </div>
    )
  }
  return (
    <>
      <div className='flex mb-15'>
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
                      className={`min-h-10 hover:text-primary-500 text-greyscale-900 rounded-lg py-2 px-4 ${
                        selected[index + 1]?.id === c.id
                          ? 'text-primary-500'
                          : ''
                      }`}
                      onClick={() => {
                        if (selected.length - 1 === index) {
                          setSelected([...selected, c])
                        } else {
                          setSelected([...selected.slice(0, index + 1), c])
                        }
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
    </>
  )
}

export default CategoriesDesktop
