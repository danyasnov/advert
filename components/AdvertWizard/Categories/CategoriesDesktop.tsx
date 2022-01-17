import {Dispatch, FC, SetStateAction} from 'react'
import {CACategoryModel} from 'front-api/src/index'
import {isEmpty} from 'lodash'
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
      <div className='flex flex-wrap gap-x-4 gap-y-8 justify-between m:justify-start'>
        {categories.map((c) => (
          <Button
            key={c.id}
            className='flex flex-col'
            onClick={() => {
              setSelected([c])
            }}>
            <ImageWrapper
              type={`/img/categories/${c.slug}.jpg`}
              width={188}
              height={188}
              alt={c.name}
              className='rounded-xl'
              layout='fixed'
            />
            <span className='text-nc-title text-body-1 mt-2'>{c.name}</span>
          </Button>
        ))}
      </div>
    )
  }
  return (
    <>
      <div className='flex mb-15'>
        <div className='grid grid-cols-3 w-full gap-x-4'>
          {selected.map((parentCategory, index) => (
            <div className='flex flex-col' key={parentCategory.id}>
              {parentCategory.items.map((c) => (
                <Button
                  key={c.id}
                  className={`min-h-10 hover:bg-nc-accent rounded-lg py-2 px-4 ${
                    selected[index + 1]?.id === c.id ? 'bg-nc-accent' : ''
                  }`}
                  onClick={() => {
                    if (selected.length - 1 === index) {
                      setSelected([...selected, c])
                    } else {
                      setSelected([...selected.slice(0, index + 1), c])
                    }
                  }}>
                  <span className='text-nc-title text-body-1 font-normal w-full text-left'>
                    {c.name}
                  </span>
                </Button>
              ))}
            </div>
          ))}
        </div>
        <div className='ml-4 hidden l:block'>
          <ImageWrapper
            type={`/img/categories/${selected[0].slug}.jpg`}
            width={290}
            height={290}
            alt={selected[0].name}
            className='rounded-xl'
            layout='fixed'
          />
        </div>
      </div>
    </>
  )
}

export default CategoriesDesktop
