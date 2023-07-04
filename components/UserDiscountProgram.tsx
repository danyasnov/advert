import {FC} from 'react'
import {Discovery, Wallet} from 'react-iconly'
import {useTranslation} from 'next-i18next'
import IcWallet from 'icons/Wallet.svg'
import IcWalletTopUp from 'icons/WalletTopUp.svg'
import Button from './Buttons/Button'

const UserDiscountProgram: FC = () => {
  const {t} = useTranslation()
  const historyData = [
    {
      date: '12.12.2021',
      amount: 545,
    },
    {
      date: '10.12.2021',
      amount: 5,
    },
    {
      date: '09.12.2021',
      amount: 34,
    },
    {
      date: '08.12.2021',
      amount: 12,
    },
    {
      date: '07.12.2021',
      amount: 11,
    },
  ]
  return (
    <div className='flex flex-col'>
      <div className='flex space-x-3 items-center mb-5 '>
        <div className='text-primary-500'>
          <Wallet size={40} />
        </div>
        <div className='text-h-5 font-bold'>
          <span className='text-greyscale-900 mr-1'>{t('BALANCE')}</span>
          <span className='text-primary-500'>123 EUR</span>
        </div>
      </div>
      <div className='rounded-2xl bg-gradient-to-l from-[#7210FF] to-[#9D59FF] p-4 mb-6 w-[328px]'>
        <div className='flex justify-between items-center mb-2'>
          <div className='flex items-center'>
            <IcWallet className='w-12 h-8 mr-2' />
            <span className='text-body-18 text-white font-bold'>
              {t('TOP_UP_WALLET')}
            </span>
          </div>
          <Button>
            <IcWalletTopUp className='w-6 h-6' />
          </Button>
        </div>
        <span className='text-body-14 text-white'>
          {t('USE_PAID_SERVICES')}
        </span>
      </div>
      <div className='flex flex-col'>
        <span className='mb-[30px] font-medium'>{t('HISTORY_WALLET')}</span>
        {historyData.map((h) => (
          <div className='flex justify-between py-4 not-last:border-b border-greyscale-200'>
            <span className='text-body-16 text-greyscale-500'>{h.date}</span>
            <div className='flex space-x-1'>
              <span className='text-body-16 text-greyscale-900'>
                +{h.amount}
              </span>
              <div className='text-[#FACC15]'>
                <Discovery size={20} filled />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default UserDiscountProgram
