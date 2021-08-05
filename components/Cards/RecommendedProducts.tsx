import {FC} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import {useProductsStore} from '../../providers/RootStoreProvider'
import Card from './Card'
import TitleWithSeparator from '../TitleWithSeparator'
import LinkWrapper from '../Buttons/LinkWrapper'

const RecommendedProducts: FC = observer(() => {
  const {t} = useTranslation()
  const {products} = useProductsStore()
  return (
    <div>
      <TitleWithSeparator
        title={t('RECOMMENDATIONS_FOR_YOU')}
        rightContent={
          <LinkWrapper
            className='text-brand-b1'
            title={t('SEE_ALL')}
            href='/all/all'>
            {t('SEE_ALL')}
          </LinkWrapper>
        }
      />
      <div className='flex mx-4 s:mx-8 m:mx-0'>
        <div className='flex flex-wrap -mx-1 s:-mx-2'>
          {products.map((p) => (
            <LinkWrapper
              title={p.title}
              href={p.url}
              key={p.hash}
              target='_blank'
              className='px-1 pb-2 s:px-2 s:pb-4 text-brand-b1'>
              <Card product={p} />
            </LinkWrapper>
          ))}
        </div>
      </div>
    </div>
  )
})

export default RecommendedProducts
