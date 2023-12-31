import {FC, useEffect, useRef, useState} from 'react'
import {useRouter} from 'next/router'
import {observer} from 'mobx-react-lite'
import {useWindowSize} from 'react-use'
import CategoriesButton from './CategoriesButton'
import useOnClickOutside from '../../hooks/useOnClickOutside'
import CategoriesMobileSelector from './CategoriesMobileSelector'
import CategoriesDesktopSelector from './CategoriesDesktopSelector'
import {useGeneralStore} from '../../providers/RootStoreProvider'

const CategoriesSelector: FC = observer(() => {
  const [show, setShow] = useState(false)
  const ref = useRef()
  const {setShowOnlyHeader} = useGeneralStore()
  const {width} = useWindowSize()
  useOnClickOutside(ref, () => {
    setShow(false)
  })
  const router = useRouter()

  useEffect(() => {
    setShow(false)
  }, [router.asPath])

  return (
    <div ref={ref}>
      <CategoriesButton
        show={show}
        onClick={() => {
          setShow(!show)
          if (width < 768) {
            setShowOnlyHeader(!show)
          } else {
            setShowOnlyHeader(false)
          }
        }}
      />
      {show && (
        <>
          <div className='s:hidden'>
            <CategoriesMobileSelector />
          </div>
          <div className='hidden s:block '>
            <CategoriesDesktopSelector />
          </div>
        </>
      )}
    </div>
  )
})

export default CategoriesSelector
