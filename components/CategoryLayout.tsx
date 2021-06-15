import {FC, ReactNode} from 'react'
import Header from './Header'
import Footer from './Footer'
import CategoryFilter from './CategoryFilter'

interface Props {
  children: ReactNode
}

const CategoryLayout: FC = ({children}: Props) => {
  return (
    <>
      <Header />
      <div className='bg-black-e py-8 m:flex'>
        <div className='m:flex m:space-x-12 l:space-x-6 m:mx-auto'>
          <main className='m:w-608px l:w-896px space-y-12'>{children}</main>
          <aside>
            <CategoryFilter />
          </aside>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default CategoryLayout
