import {FC, useState} from 'react'
import {useTranslation} from 'next-i18next'
import Button from './Button'
import IcCategoriesClosed from '../assets/icons/CategoriesClosed.svg'
import IcCategoriesOpen from '../assets/icons/CategoriesOpen.svg'

const CategoriesButton: FC = () => {
  const [show, setShow] = useState(false)
  const {t} = useTranslation()

  return (
    <Button
      onClick={() => setShow(!show)}
      className='bg-black-c min-w-min rounded-8 flex-shrink-0 space-x-2 px-2 s:px-3.5'>
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
