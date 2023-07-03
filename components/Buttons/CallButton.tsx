import {FC} from 'react'
import {observer} from 'mobx-react-lite'
import {toast} from 'react-toastify'
import {useTranslation} from 'next-i18next'
import Button from './Button'
import {makeRequest} from '../../api'
import {useModalsStore} from '../../providers/RootStoreProvider'
import {trackSingle} from '../../helpers'

interface Props {
  productHash: string
  ownerHash: string
  className: string
  hideNumber?: boolean
}

const CallButton: FC<Props> = observer(
  ({productHash, ownerHash, className, children, hideNumber}) => {
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
              hash: productHash,
            },
          })

          if (permissionData.error) {
            return toast.error(t(permissionData.error))
          }
          const {data: userData} = await makeRequest({
            method: 'post',
            url: '/api/user-info',
            data: {
              hash: ownerHash,
            },
          })
          if (userData.error) {
            return toast.error(t(userData.error))
          }
          setModal('PHONE_MODAL', {
            hideNumber,
            displayAllowed: permissionData.result.displayAllowed,
            phone: permissionData.result.num,
            imageUrl: userData.result.imageUrl,
            name: userData.result.name,
            userHash: ownerHash,
          })
        }}
        className={className}>
        {children}
      </Button>
    )
  },
)

export default CallButton
