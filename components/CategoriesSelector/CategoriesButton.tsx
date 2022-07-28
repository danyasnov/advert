import {FC} from 'react'
import {useTranslation} from 'next-i18next'
import IcKeyboardArrowLeft from 'icons/material/KeyboardArrowLeft.svg'
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
      className='bg-greyscale-200 rounded-2 h-10 space-x-2 px-2 s:px-5 py-2.5'>
      <span className='hidden s:block text-body-2 text-greyscale-800 capitalize-first whitespace-nowrap'>
        {t('ALL_CATEGORIES')}
      </span>
      <div className='flex justify-end items-center'>
        <IcKeyboardArrowLeft
          className={`fill-current text-greyscale-900 w-5 h-5 ${
            show ? 'rotate-90' : '-rotate-90'
          }`}
        />
      </div>
    </Button>
  )
}
export default CategoriesButton
