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
        rightContent={<LinkWrapper href='/all/all'>{t('SEE_ALL')}</LinkWrapper>}
      />
      <div className='flex mx-4 s:mx-8 m:mx-0'>
        <div className='flex flex-wrap -mx-1 s:-mx-2'>
          {products.map((p) => (
            <div className='px-1 pb-2 s:px-2 s:pb-4' key={p.hash}>
              <Card product={p} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
})

export default RecommendedProducts
