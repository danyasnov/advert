import {FC, useRef} from 'react'
import {useTranslation} from 'next-i18next'
import IcKeyboardArrowLeft from 'icons/material/KeyboardArrowLeft.svg'
import IcCloseSquare from 'icons/material/CloseSquare.svg'
import IcActiveCloseSquare from 'icons/material/ActiveCloseSquare.svg'
import {CloseSquare} from 'react-iconly'
import {useHover, useHoverDirty, useMouseHovered} from 'react-use'
import Button from '../Buttons/Button'

interface Props {
  show: boolean
  onClick: () => void
}

const CategoriesButton: FC<Props> = ({show, onClick}) => {
  const {t} = useTranslation()
  const ref = useRef(null)

  const isHovering = useHoverDirty(ref)

  return (
    <div ref={ref}>
      <Button
        onClick={onClick}
        id='categories'
        className='bg-greyscale-200 rounded-2 h-10 space-x-2 px-2 s:px-5 py-2.5'>
        <span className='hidden s:block text-body-14 text-greyscale-800 capitalize-first whitespace-nowrap'>
          {t('ALL_CATEGORIES')}
        </span>
        <div className='flex justify-end items-center'>
          {show ? (
            <>
              {isHovering ? (
                <IcActiveCloseSquare className='w-5 h-5' />
              ) : (
                <IcCloseSquare className='w-5 h-5' />
              )}
            </>
          ) : (
            <IcKeyboardArrowLeft className='fill-current text-greyscale-900 w-5 h-5 -rotate-90' />
          )}
        </div>
      </Button>
    </div>
  )
}
export default CategoriesButton
