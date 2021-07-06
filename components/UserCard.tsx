import {FC} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import IcPersonAdd from 'icons/material/PersonAdd.svg'
import IcStar from 'icons/material/Star.svg'
import {useProductsStore} from '../providers/RootStoreProvider'
import {unixToDate} from '../utils'
import ImageWrapper from './ImageWrapper'

const UserCard: FC = observer(() => {
  const {product} = useProductsStore()
  const {t} = useTranslation()

  return (
    <div className='flex flex-col bg-white px-2 py-6'>
      <div className='flex mb-3'>
        <div className='flex flex-col items-center mr-5'>
          <div className='w-16 h-16 rounded-full overflow-hidden mb-1'>
            {!!product.owner.image && (
              <ImageWrapper
                width={64}
                height={64}
                type={product.owner.image}
                alt='avatar'
              />
            )}
          </div>
          <IcPersonAdd className='fill-current h-6 w-6 ' />
        </div>

        <div>
          <span className='text-brand-b1 text-h-3 font-bold'>
            {product.owner.name}
          </span>
          <div className='text-brand-a1 text-body-2 flex items-center'>
            <IcStar className='fill-current h-6 w-6 mr-2' />
            <span className='mr-1'>{product.owner.ratingMark}</span>
            <span>({product.owner.ratingMarkCnt})</span>
          </div>
          {/* <div> */}
          {/*  <IcAdvert className='fill-current text-black-c h-6 w-6 mr-2' /> */}
          {/* </div> */}
          <span className='text-black-c text-body-2'>
            {t('SINCE', {date: unixToDate(product.owner.dateRegistered)})}
          </span>
        </div>
      </div>
      <div className='flex text-black-c text-body-3 items-center'>
        <span className='mr-2'>{t('I_SPEAK')}</span>
        <div className='flex'>
          {product.owner.languages.map((l) => (
            <div className='mr-2 w-3 h-3' key={l}>
              <ImageWrapper
                key={l}
                type={`https://adverto.sale/img/flags/${l}.png`}
                alt='lang'
                width={12}
                height={12}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
})

export default UserCard
