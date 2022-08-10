import {FC} from 'react'
import {CountryModel} from 'front-api'
import {GeoPositionItemModel} from 'front-api/src/models/index'
import {useTranslation} from 'next-i18next'
import LinkWrapper from './Buttons/LinkWrapper'
import Button from './Buttons/Button'

interface Props {
  /* eslint-disable @typescript-eslint/no-explicit-any */
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
          {title && (
            <h1 className='text-body-14 text-black-a mb-2 font-bold'>
              {title}
            </h1>
          )}
          {subTitle && (
            <span className='text-body-16 text-greyscale-900 mb-4'>
              {subTitle}
            </span>
          )}
        </div>
        <div className='flex'>
          <LinkWrapper
            title={t('SHOW_ALL_ADVERTS')}
            className='text-body-14 text-brand-b1'
            href={showAllLink}>
            {t('SHOW_ALL_ADVERTS')}
          </LinkWrapper>
        </div>
      </div>
      <div className='flex flex-wrap'>
        {Object.entries(items).map(([key, values]) => (
          <div className='flex flex-col w-1/3 s:w-1/6 mb-4' key={key}>
            <div className='text-greyscale-900 h-10 bg-black-e flex items-center mb-2 pl-4'>
              {key}
            </div>
            <div className='pl-4'>
              {values.map((c) => (
                <LinkWrapper
                  title={c.title || c.value || c.word}
                  className='text-body-14 text-brand-b1'
                  href={c.href}
                  key={c.id}>
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
