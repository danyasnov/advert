import {FC} from 'react'
import {observer} from 'mobx-react-lite'
import {ArrowLeft} from 'react-iconly'
import {useGeneralStore} from '../providers/RootStoreProvider'
import Button from './Buttons/Button'

const SectionTitle: FC<{title: string}> = observer(({title}) => {
  const {setActiveUserPage} = useGeneralStore()
  const className = 's:hidden m:block text-h-5 font-bold text-greyscale-900'
  return (
    <div className='mb-8 z-10 relative'>
      <Button onClick={() => setActiveUserPage(null)} className='s:hidden'>
        <ArrowLeft size={24} />
        <span className={`${className} ml-2`}>{title}</span>
      </Button>
      <span className={`${className} hidden s:block`}>{title}</span>
    </div>
  )
})

export default SectionTitle
