import {FC} from 'react'
import {observer} from 'mobx-react-lite'
import {toast} from 'react-toastify'
import {useTranslation} from 'next-i18next'
import Button from './Button'
import {makeRequest} from '../../api'
import {useModalsStore} from '../../providers/RootStoreProvider'
import {trackSingle} from '../../helpers'

interface Props {
  hash: string
  ownerHash: string
  className: string
}

const CallButton: FC<Props> = observer(
  ({hash, ownerHash, className, children}) => {
    const {setModal} = useModalsStore()
    const {t} = useTranslation()
    return (
      <Button
        id='call'
        onClick={async (e) => {
          e.preventDefault()
          trackSingle('Contact')
          const {data: permissionData} = await makeRequest({
            method: 'post',
            url: '/api/check-phone-permissions',
            data: {
              hash,
            },
          })

          if (permissionData.status !== 200) {
            return toast.error(t(permissionData.error))
          }
          const {data: userData} = await makeRequest({
            method: 'post',
            url: '/api/user-info',
            data: {
              hash: ownerHash,
            },
          })
          setModal('PHONE_MODAL', {
            displayAllowed: permissionData.result.displayAllowed,
            phone: permissionData.result.num,
            imageUrl: userData.result.imageUrl,
            name: userData.result.name,
          })
        }}
        className={className}>
        {children}
      </Button>
    )
  },
)

export default CallButton
