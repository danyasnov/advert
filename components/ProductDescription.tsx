import {FC, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import IcVisibility from 'icons/material/Visibility.svg'
import IcLike from 'icons/material/Like.svg'
import IcNoEntry from 'icons/material/NoEntry.svg'
import IcService from 'icons/material/Service.svg'
import {useProductsStore} from '../providers/RootStoreProvider'
import Button from './Buttons/Button'
import {notImplementedAlert} from '../helpers'
import OutlineButton from './Buttons/OutlineButton'
import {unixToDateTime} from '../utils'
import Tabs from './Tabs'

const tabs = [
  {id: 0, title: 'DESCRIPTION'},
  {id: 1, title: 'CHARACTERISTICS_TAB'},
]
const ProductDescription: FC = observer(() => {
  const [activeTab, setActiveTab] = useState(0)
  const {product} = useProductsStore()
  const {t} = useTranslation()

  return (
    <div>
      <div className='flex justify-between'>
        <OutlineButton
          onClick={notImplementedAlert}
          className='text-black-b text-body-2'>
          {t('ADD_NOTE')}
        </OutlineButton>
        <div className='flex items-center space-x-6'>
          <Button
            onClick={notImplementedAlert}
            className='text-black-b text-body-2'>
            <IcLike className='fill-current text-black-c w-4 h-4 mr-2' />
            {product.advert.favoriteCounter}
          </Button>
          <Button
            onClick={notImplementedAlert}
            className='text-black-b text-body-2'>
            <IcVisibility className='fill-current text-black-c w-5 h-5 mr-2' />
            {product.advert.views}
          </Button>
          <span suppressHydrationWarning className='text-black-b text-body-2'>
            {unixToDateTime(product.advert.dateUpdated)}
          </span>
        </div>
      </div>
      <div className='h-full flex flex-col'>
        <Tabs
          items={tabs}
          value={activeTab}
          onChange={(id) => setActiveTab(id)}
        />
        {activeTab === 0 && <DescriptionTab />}
        {activeTab === 1 && <CharacteristicsTab />}
      </div>
      <div className='flex justify-end mt-4 text-body-2'>
        <OutlineButton onClick={notImplementedAlert} className='mr-3'>
          <IcNoEntry className='fill-current text-black-c h-6 w-6 mr-2' />
          {t('BLOCK_MESSAGE')}
        </OutlineButton>
        <OutlineButton onClick={notImplementedAlert}>
          <IcService className='fill-current text-black-c h-6 w-6 mr-2' />
          {t('SUPPORT')}
        </OutlineButton>
      </div>
    </div>
  )
})

const DescriptionTab: FC = observer(() => {
  const {product} = useProductsStore()

  return (
    <div className='bg-white p-4 text-black-b text-body-1'>
      {product.advert.description}
    </div>
  )
})

const CharacteristicsTab: FC = observer(() => {
  const {product} = useProductsStore()

  return (
    <div className='bg-white p-4 text-black-c text-body-3 space-y-2'>
      {product.advert.fields.map((field) => {
        return (
          <div className='flex justify-between' key={field.fieldNameText}>
            <div>{field.fieldNameText}</div>
            <div>
              {field.fieldValueText.map((fieldValue) => (
                <span key={fieldValue}>{fieldValue}</span>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
})

export default ProductDescription
