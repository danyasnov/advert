import {FC} from 'react'
import HeaderFooterWrapper from './HeaderFooterWrapper'
import {useGeneralStore} from '../../providers/RootStoreProvider'
import MetaTags from '../MetaTags'

const DocumentLayout: FC = () => {
  const {document} = useGeneralStore()
  return (
    <HeaderFooterWrapper>
      <MetaTags title={document.title} description={document.description} />
      <div className='bg-white px-4 s:px-8 flex min-h-half-screen'>
        <div className='m:flex m:space-x-12 l:space-x-6 m:mx-auto s:w-full justify-center w-full'>
          <main className='prose my-10'>
            {/* eslint-disable-next-line react/no-danger */}
            <div dangerouslySetInnerHTML={{__html: document.content}} />
          </main>
        </div>
      </div>
    </HeaderFooterWrapper>
  )
}

export default DocumentLayout
