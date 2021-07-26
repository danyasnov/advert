import {FC} from 'react'
import {CountryModel} from 'front-api'
import {GeoPositionItemModel} from 'front-api/src/models/index'
import {useTranslation} from 'next-i18next'
import LinkWrapper from './Buttons/LinkWrapper'
import Button from './Buttons/Button'

interface Props {
  items: Record<string, any>
  title?: string
  subTitle?: string
  showAllLink: string
  onSelect: (
    item: (CountryModel | GeoPositionItemModel) & {
      href?: string
      isoCode?: string
    },
  ) => void
}
const LocationSelector: FC<Props> = ({
  items,
  title,
  subTitle,
  onSelect,
  showAllLink,
}) => {
  const {t} = useTranslation()
  return (
    <div className='flex flex-col'>
      <div className='flex items-center justify-between'>
        <div className='flex flex-col mt-2 pt-4'>
          {title && <span className='text-h-2 text-black-a mb-2'>{title}</span>}
          {subTitle && (
            <span className='text-h-4 text-black-b mb-4'>{subTitle}</span>
          )}
        </div>
        <div className='flex'>
          <LinkWrapper href={showAllLink}>{t('SHOW_ALL_ADVERTS')}</LinkWrapper>
        </div>
      </div>
      <div className='flex flex-wrap'>
        {Object.entries(items).map(([key, values]) => (
          <div className='flex flex-col w-1/6 mb-4' key={key}>
            <div className='text-black-b h-10 bg-black-e flex items-center mb-2 pl-4'>
              {key}
            </div>
            <div className='pl-4'>
              {values.map((c) => (
                <LinkWrapper href={c.href} key={c.id}>
                  <Button onClick={() => onSelect(c)} className='text-left'>
                    {c.title || c.value || c.word}
                  </Button>
                </LinkWrapper>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default LocationSelector
