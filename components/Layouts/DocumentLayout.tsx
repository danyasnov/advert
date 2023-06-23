import {FC, useEffect, useState} from 'react'
import {useRouter} from 'next/router'
import mammoth from 'mammoth'
import {useTranslation} from 'next-i18next'
import HeaderFooterWrapper from './HeaderFooterWrapper'
import {useGeneralStore} from '../../providers/RootStoreProvider'
import MetaTags from '../MetaTags'
import {getQueryValue} from '../../helpers'

const DocumentLayout: FC = () => {
  const {t} = useTranslation()
  const {document} = useGeneralStore()
  const {query} = useRouter()
  const docTitle = getQueryValue(query, 'document')
  const [doc, setDoc] = useState(document)
  let pageTitle
  if (docTitle === 'terms-and-conditions') {
    pageTitle = 'TERMS_AND_CONDITIONS'
  } else if (docTitle === 'privacy-policy') {
    pageTitle = 'PRIVACY_POLICY'
  } else if (docTitle === 'cookies-policy') {
    pageTitle = 'COOKIES_POLICY'
  }
  useEffect(() => {
    fetch(`/${docTitle}.docx`)
      .then((response) => {
        return response.arrayBuffer()
      })
      .then((arrayBuffer) => {
        mammoth.convertToHtml({arrayBuffer}).then((result) => {
          const html = result.value
          // @ts-ignore
          setDoc({content: html})
        })
      })
  }, [docTitle])

  return (
    <HeaderFooterWrapper>
      <MetaTags title={t(pageTitle)} description={document.description} />
      <div className='bg-white px-4 s:px-8 flex min-h-1/2'>
        <div className='m:flex m:space-x-12 l:space-x-6 m:mx-auto s:w-full justify-center w-full'>
          <main className='prose my-10'>
            {/* eslint-disable-next-line react/no-danger */}
            <div dangerouslySetInnerHTML={{__html: doc.content}} />
          </main>
        </div>
      </div>
    </HeaderFooterWrapper>
  )
}

export default DocumentLayout
