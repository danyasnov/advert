import {FC, useRef, useState} from 'react'
import CategoriesButton from './CategoriesButton'
import useOnClickOutside from '../../hooks/useOnClickOutside'
import CategoriesMobileSelector from './CategoriesMobileSelector'
import CategoriesDesktopSelector from './CategoriesDesktopSelector'

const CategoriesSelector: FC = () => {
  const [show, setShow] = useState(false)
  const ref = useRef()
  useOnClickOutside(ref, () => {
    setShow(false)
  })

  return (
    <div ref={ref}>
      <CategoriesButton
        show={show}
        onClick={() => {
          setShow(!show)
        }}
      />
      {show && (
        <>
          <div className='s:hidden'>
            <CategoriesMobileSelector />
          </div>
          <div className='hidden s:block'>
            <CategoriesDesktopSelector />
          </div>
        </>
      )}
    </div>
  )
}

export default CategoriesSelector
