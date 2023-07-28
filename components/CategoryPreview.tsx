import {FC} from 'react'
import {toJS} from 'mobx'
import {useTranslation} from 'next-i18next'
import {useRouter} from 'next/router'
import {CACategoryModel} from 'front-api'
import LinkWrapper from './Buttons/LinkWrapper'
import {clearUrlFromQuery} from '../utils'
import ImageWrapper from './ImageWrapper'

interface Props {
  category: CACategoryModel
}

const previewDict = {
  27: ['motorcycle/1', 'motorcycle/2'],
  10077: ['watercraft/1', 'watercraft/2'],
  10071: ['seats/1', 'seats/2'],
  12271: ['parts/1', 'parts/2'],
  25: ['commercial/1', 'commercial/2', 'commercial/3', 'commercial/4'],
}
const CategoryPreview: FC<Props> = ({category}) => {
  const {t} = useTranslation()
  const router = useRouter()

  const images = previewDict[category.id]

  const mainHref = `${clearUrlFromQuery(router.asPath)}/${category.slug}`

  const imageClassname =
    images.length === 2
      ? 's:w-[164px] s:h-[134px] m:w-[220px] m:h-[180px] l:w-[280px] l:h-[232px] '
      : 's:w-[164px] s:h-[130px] m:w-[224px] m:h-[178px] l:w-[290px] l:h-[230px]'
  return (
    <div className='flex flex-col w-full'>
      <div className='flex justify-between items-baseline mb-6'>
        <span className='text-h-4 font-bold text-greyscale-900'>
          {category.name}
        </span>
        <LinkWrapper
          href={mainHref}
          title={category.name}
          className='text-primary-500 font-bold text-body-16 whitespace-nowrap'>
          {t('SEE_ALL')}
        </LinkWrapper>
      </div>
      <div className='flex justify-between'>
        {images.map((i) => (
          <div className={`${imageClassname} shrink-0 relative`}>
            <ImageWrapper
              type={`/img/categories-preview/${i}.png`}
              alt={i}
              layout='fill'
            />
          </div>
        ))}
      </div>
      <div
        className={`grid ${
          images.length === 2 ? 'grid-cols-2' : 'grid-cols-4'
        } gap-4 mt-6`}>
        {category.items.map((i) => (
          <LinkWrapper
            title={i.name}
            href={`${mainHref}/${i.slug}`}
            className='text-body-16 font-medium text-greyscale-900'>
            {i.name}
          </LinkWrapper>
        ))}
      </div>
    </div>
  )
}

export default CategoryPreview
