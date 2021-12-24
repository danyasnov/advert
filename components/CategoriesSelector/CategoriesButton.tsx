import {FC} from 'react'
import {useTranslation} from 'next-i18next'
import IcCategoriesClosed from 'icons/CategoriesClosed.svg'
import IcCategoriesOpen from 'icons/CategoriesOpen.svg'
import Button from '../Buttons/Button'

interface Props {
  show: boolean
  onClick: () => void
}

const CategoriesButton: FC<Props> = ({show, onClick}) => {
  const {t} = useTranslation()

  return (
    <Button
      onClick={onClick}
      id='categories'
      className='bg-black-c rounded-2 h-10 space-x-2 px-2 s:px-3.5'>
      <div className='w-6 h-6 flex justify-center items-center'>
        {show ? (
          <IcCategoriesOpen type='icCategoriesOpen' width={14} height={14} />
        ) : (
          <IcCategoriesClosed
            type='icCategoriesClosed'
            width={24}
            height={24}
          />
        )}
      </div>
      <span className='hidden s:block text-body-2 text-white-a capitalize-first'>
        {t('CATEGORIES')}
      </span>
    </Button>
  )
}
export default CategoriesButton
