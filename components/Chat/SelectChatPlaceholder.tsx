import {FC} from 'react'
import {Chat} from 'react-iconly'
import {useTranslation} from 'next-i18next'

const SelectChatPlaceholder: FC = () => {
  const {t} = useTranslation()
  return (
    <div className='flex flex-col items-center'>
      <div className='text-primary-500 mb-4'>
        <Chat stroke='light' size={46} />
      </div>
      <span className='text-body-16 text-greyscale-900'>
        {t('SELECT_CHAT')}
      </span>
    </div>
  )
}
export default SelectChatPlaceholder
